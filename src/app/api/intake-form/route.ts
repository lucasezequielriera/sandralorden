import { NextRequest, NextResponse } from "next/server";
import { buildIntakeNotificationEmailHtml, type IntakeData } from "@/lib/email-template";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeField, sanitizeEmail, sanitizePhone, isHoneypotFilled } from "@/lib/sanitize";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

const PREMIUM_PROGRAM_LABELS = new Set(["Programa Premium 90 días", "Premium 90-Day Program"]);

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
    const normalizedProgramType = sanitizedBody.programType || "Programa no especificado";

    const isPremiumProgram = PREMIUM_PROGRAM_LABELS.has(normalizedProgramType);
    if (!isPremiumProgram) {
      const sandraEmail = process.env.SANDRA_EMAIL;
      if (!sandraEmail) throw new Error("SANDRA_EMAIL no configurada.");

      await sendEmail({
        to: sandraEmail,
        subject: `📋 Formulario completo: ${name} - ${normalizedProgramType} - ${sanitizedBody.service || "Sin especificar"}`,
        html: buildIntakeNotificationEmailHtml(intakeData),
      });
    }

    let persistedClientId: string | null = null;
    let persistedIntakeFormId: string | null = null;

    try {
      const supabase = await createServiceClient();
      const goal = [sanitizedBody.mejoraRendimiento, sanitizedBody.mejoraEstetica].filter(Boolean).join(" | ");

      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("email", email)
        .single();

      let clientId: string | null = null;

      if (existing) {
        clientId = existing.id;
        persistedClientId = existing.id;
        await supabase
          .from("clients")
          .update({
            name,
            phone,
            service_type: sanitizedBody.service || undefined,
            goal: goal || undefined,
            notes: `${isPremiumProgram ? "Pendiente de pago" : "Formulario completado"} · Programa: ${normalizedProgramType}`,
          })
          .eq("id", existing.id);
      } else {
        const { data: created } = await supabase
          .from("clients")
          .insert({
            name,
            email,
            phone,
            service_type: sanitizedBody.service || "",
            goal,
            status: isPremiumProgram ? "lead" : "active",
            notes: `${isPremiumProgram ? "Pendiente de pago" : "Formulario detallado completado"} · Programa: ${normalizedProgramType}`,
          })
          .select("id")
          .single();
        clientId = created?.id ?? null;
        persistedClientId = created?.id ?? null;
      }

      await supabase.from("activity_logs").insert({
        action: "Nuevo formulario completado",
        details: `${name} (${email}) — ${sanitizedBody.service || "Sin servicio"}`,
      });

      const { data: intakeInserted } = await supabase
        .from("intake_forms")
        .insert({
          client_id: clientId,
          email,
          payload: intakeData,
        })
        .select("id")
        .single();
      persistedIntakeFormId = intakeInserted?.id ?? null;
    } catch (dbErr) {
      console.error("Supabase insert error (non-blocking):", dbErr instanceof Error ? dbErr.message : "unknown");
    }

    return NextResponse.json({
      success: true,
      clientId: persistedClientId,
      intakeFormId: persistedIntakeFormId,
      pendingPayment: isPremiumProgram,
    });
  } catch (error) {
    console.error("Error in intake-form:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Error al enviar el formulario. Por favor, intentalo de nuevo." },
      { status: 500 }
    );
  }
}
