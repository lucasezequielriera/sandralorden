import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  return new Resend(key);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, service, message } = await request.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
    }

    const resend = getResendClient();
    const emailFrom = process.env.EMAIL_FROM || "Sandra Lorden <onboarding@resend.dev>";
    const sandraEmail = process.env.SANDRA_EMAIL;

    if (!sandraEmail) {
      return NextResponse.json({ error: "Email de destino no configurado" }, { status: 500 });
    }

    const serviceText = service || "No especificado";
    const messageText = message || "Sin mensaje";

    await resend.emails.send({
      from: emailFrom,
      to: sandraEmail,
      subject: `📩 Nuevo mensaje de contacto: ${name}`,
      html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FFFAF7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#3D2C2C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFAF7;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background-color:#3D2C2C;border-radius:16px 16px 0 0;padding:20px 28px;">
            <p style="color:#F2D1D1;font-size:13px;margin:0;letter-spacing:1px;text-transform:uppercase;">📩 Mensaje desde la web</p>
            <p style="color:#ffffff;font-size:22px;margin:6px 0 0;font-style:italic;font-family:Georgia,'Times New Roman',serif;">${name}</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#ffffff;padding:28px;border-radius:0 0 16px 16px;box-shadow:0 2px 12px rgba(61,44,44,0.06);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
                <span style="font-size:12px;color:#C9A88E;display:inline-block;width:80px;">Email</span>
                <a href="mailto:${email}" style="font-size:14px;color:#3D2C2C;text-decoration:none;">${email}</a>
              </td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
                <span style="font-size:12px;color:#C9A88E;display:inline-block;width:80px;">Servicio</span>
                <span style="font-size:14px;color:#3D2C2C;">${serviceText}</span>
              </td></tr>
            </table>

            <div style="margin-top:20px;background-color:#FFFAF7;border-radius:12px;padding:16px;">
              <p style="font-size:11px;color:#C9A88E;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.8px;">Mensaje</p>
              <p style="font-size:14px;color:#3D2C2C;margin:0;line-height:1.6;white-space:pre-wrap;">${messageText}</p>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
              <tr><td align="center">
                <a href="mailto:${email}?subject=Re: Tu mensaje en sandralorden.com&body=Hola ${name},%0A%0A" style="display:inline-block;background-color:#3D2C2C;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:600;">
                  Responder por email
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}
