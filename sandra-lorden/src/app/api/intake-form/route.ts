import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildIntakeNotificationEmailHtml } from "@/lib/email-template";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no configurada.");
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Nombre, email y telefono son obligatorios." }, { status: 400 });
    }

    const resend = getResendClient();
    const emailFrom = process.env.EMAIL_FROM || "Sandra Lorden <onboarding@resend.dev>";
    const sandraEmail = process.env.SANDRA_EMAIL || "sandralorden@gmail.com";

    const result = await resend.emails.send({
      from: emailFrom,
      to: sandraEmail,
      subject: `📋 Formulario completo: ${name} - ${body.service || "Sin especificar"}`,
      html: buildIntakeNotificationEmailHtml(body),
    });
    console.log("Sandra intake email result:", JSON.stringify(result));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in intake-form:", error);
    return NextResponse.json(
      { error: "Error al enviar el formulario. Por favor, intentalo de nuevo." },
      { status: 500 }
    );
  }
}
