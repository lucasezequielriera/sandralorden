import { escapeHtml } from "@/lib/sanitize";

export type PremiumAccessEmailVariant = "payment" | "resend";

const introHtml: Record<PremiumAccessEmailVariant, string> = {
  payment: "Tu pago del Programa Premium 90 días se confirmó correctamente.",
  resend:
    "Te reenviamos el enlace para crear tu contraseña y entrar al panel de cliente (mismo proceso que tras el alta).",
};

const introText: Record<PremiumAccessEmailVariant, string> = {
  payment: "Tu pago del Programa Premium 90 días se confirmó.",
  resend: "Te reenviamos el enlace para crear tu contraseña y acceder a tu panel de cliente.",
};

/** Correo HTML con botón al enlace mágico de Supabase (recovery). */
export function buildPremiumAccessEmailHtml(
  name: string,
  magicLink: string,
  variant: PremiumAccessEmailVariant = "payment"
): string {
  const safeName = escapeHtml(name);
  const safeHref = escapeHtml(magicLink);
  return `
          <div style="font-family: Arial, sans-serif; color:#2f2f2f; line-height:1.5;">
            <h2 style="margin:0 0 12px;">¡Bienvenida/o, ${safeName}!</h2>
            <p style="margin:0 0 12px;">${escapeHtml(introHtml[variant])}</p>
            <p style="margin:0 0 16px;">Pulsa el botón para crear tu contraseña y entrar al panel de cliente:</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 20px;">
              <tr>
                <td style="border-radius:12px;background:#3d2c2c;">
                  <a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff !important;text-decoration:none;border-radius:12px;">
                    Crear contraseña
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0;font-size:12px;color:#666;">El enlace caduca y es de un solo uso; si falla, solicita un nuevo acceso desde la web.</p>
            <p style="margin:12px 0 0;font-size:11px;color:#999;">Si no solicitaste este acceso, ignora este mensaje.</p>
          </div>
        `;
}

export function buildPremiumAccessEmailText(
  name: string,
  magicLink: string,
  variant: PremiumAccessEmailVariant = "payment"
): string {
  return `Hola ${name},

${introText[variant]}

Abre este enlace en el navegador para crear tu contraseña (o cópialo y pégalo en la barra de direcciones):

${magicLink}

Después podrás iniciar sesión en tu panel de cliente.
`;
}
