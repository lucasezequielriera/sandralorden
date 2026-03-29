import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

/** Extrae la dirección email del header From ("Nombre <a@b.c>" o "a@b.c"). */
function parseFromEmail(from: string): string | null {
  const t = from.trim();
  const angle = t.match(/<([^>]+)>/);
  const raw = (angle?.[1] ?? t).trim();
  const at = raw.lastIndexOf("@");
  if (at < 1 || at === raw.length - 1) return null;
  const domain = raw.slice(at + 1).toLowerCase();
  if (!domain.includes(".")) return null;
  return `${raw.slice(0, at).toLowerCase()}@${domain}`;
}

/**
 * Brevo asigna remitentes tipo *@NNNNNN.brevosend.com cuando no hay dominio propio verificado.
 * Esos correos suelen no llegar o ir a spam; la solución es autenticar el dominio en Brevo y
 * poner EMAIL_FROM con ese dominio (p. ej. Sandra Lorden <hola@tudominio.com>).
 */
function warnIfBrevoSharedSender(from: string) {
  if (process.env.EMAIL_SKIP_BREVO_SENDER_WARN === "1") return;
  const addr = parseFromEmail(from);
  if (!addr) return;
  const host = addr.split("@")[1] ?? "";
  const isShared = host.endsWith("brevosend.com") || host.endsWith("sendinblue.com");
  if (!isShared) return;
  console.warn(
    "[email] EMAIL_FROM usa un remitente compartido de Brevo (%s). Muchos buzones bloquean o marcan spam estos envíos. " +
      "En Brevo: Senders, domains & dedicated IPs → añade y verifica tu dominio (DNS), crea un remitente con @ese-dominio " +
      "y actualiza EMAIL_FROM y (si aplica) SMTP_USER en Vercel/.env.",
    addr
  );
}

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP no configurado. Revisa SMTP_HOST, SMTP_USER y SMTP_PASS.");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  /** Parte texto plano (útil si el HTML modifica enlaces, p. ej. tracking del proveedor). */
  text?: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string | Buffer; contentType?: string }>;
}) {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new Error("EMAIL_FROM no configurado.");
  }

  const resolvedReplyTo =
    replyTo ?? process.env.EMAIL_REPLY_TO ?? process.env.SANDRA_EMAIL;

  warnIfBrevoSharedSender(from);

  const smtp = getTransporter();
  await smtp.sendMail({
    from,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
    ...(resolvedReplyTo ? { replyTo: resolvedReplyTo } : {}),
    ...(attachments?.length ? { attachments } : {}),
  });
}

