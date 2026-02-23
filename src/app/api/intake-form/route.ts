import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildIntakeNotificationEmailHtml, type IntakeData } from "@/lib/email-template";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeField, sanitizeEmail, sanitizePhone, isHoneypotFilled } from "@/lib/sanitize";
import { createServiceClient } from "@/lib/supabase/server";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no configurada.");
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`intake:${ip}`, { maxRequests: 3, windowMs: 120_000 });
    if (!success) {
      return NextResponse.json({ error: "Demasiados intentos. Espera un par de minutos." }, { status: 429 });
    }

    const body = await request.json();

    if (isHoneypotFilled(body)) {
      return NextResponse.json({ success: true });
    }

    const name = sanitizeField(body.name, 100);
    const email = sanitizeEmail(body.email);
    const phone = sanitizePhone(body.phone);

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Nombre, email y telefono son obligatorios." }, { status: 400 });
    }

    const sanitizedBody: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (key === "_hp") continue;
      sanitizedBody[key] = typeof value === "string" ? sanitizeField(value, 2000) : String(value ?? "");
    }
    sanitizedBody.name = name;
    sanitizedBody.email = email;
    sanitizedBody.phone = phone;
    const intakeData = sanitizedBody as unknown as IntakeData;

    const resend = getResendClient();
    const emailFrom = process.env.EMAIL_FROM || "Sandra Lorden <onboarding@resend.dev>";
    const sandraEmail = process.env.SANDRA_EMAIL;
    if (!sandraEmail) throw new Error("SANDRA_EMAIL no configurada.");

    const result = await resend.emails.send({
      from: emailFrom,
      to: sandraEmail,
      subject: `📋 Formulario completo: ${name} - ${sanitizedBody.service || "Sin especificar"}`,
      html: buildIntakeNotificationEmailHtml(intakeData),
    });
    console.log("Sandra intake email result:", JSON.stringify(result));

    try {
      const supabase = await createServiceClient();
      const goal = [sanitizedBody.mejoraRendimiento, sanitizedBody.mejoraEstetica].filter(Boolean).join(" | ");

      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("email", email)
        .single();

      if (existing) {
        await supabase
          .from("clients")
          .update({
            name,
            phone,
            service_type: sanitizedBody.service || undefined,
            goal: goal || undefined,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("clients").insert({
          name,
          email,
          phone,
          service_type: sanitizedBody.service || "",
          goal,
          status: "active",
          notes: "Formulario detallado completado",
        });
      }
      await supabase.from("activity_logs").insert({
        action: "Nuevo formulario completado",
        details: `${name} (${email}) — ${sanitizedBody.service || "Sin servicio"}`,
      });
    } catch (dbErr) {
      console.error("Supabase insert error (non-blocking):", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in intake-form:", error);
    return NextResponse.json(
      { error: "Error al enviar el formulario. Por favor, intentalo de nuevo." },
      { status: 500 }
    );
  }
}
