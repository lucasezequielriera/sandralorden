import { escapeHtml } from "@/lib/sanitize";

export type VirtualAppointmentEmailLocale = "es" | "en";

export type VirtualAppointmentEmailOptions = {
  locale: VirtualAppointmentEmailLocale;
  receiptUrl?: string | null;
  /** Enlace firmado (token) para reprogramar sin login */
  rescheduleUrl?: string | null;
};

type VirtualAppointmentCopy = {
  greeting: (name: string) => string;
  confirmed: string;
  reasonLabel: string;
  meetLabel: string;
  joinCta: string;
  pasteHint: string;
  icsHint: string;
  receiptLabel: string;
  policy: string;
  rescheduleLead: string;
  rescheduleCta: string;
  signOff: string;
};

function copy(locale: VirtualAppointmentEmailLocale): VirtualAppointmentCopy {
  if (locale === "en") {
    return {
      greeting: (name: string) => `Hi ${name},`,
      confirmed: "Your virtual session with Sandra is confirmed:",
      reasonLabel: "Reason for your session:",
      meetLabel: "Google Meet link:",
      joinCta: "Join session",
      pasteHint: "If the button doesn’t work, copy this link into your browser:",
      icsHint: "A calendar file (.ics) is attached — add it to Apple Calendar, Google Calendar, or Outlook.",
      receiptLabel: "Payment receipt (Stripe):",
      policy:
        "You may reschedule up to 24 hours before the session starts. Use the link below or reply to this email.",
      rescheduleLead: "Change your session time:",
      rescheduleCta: "Reschedule session",
      signOff: "— Sandra Lorden",
    };
  }
  return {
    greeting: (name: string) => `Hola ${name},`,
    confirmed: "Tu cita virtual con Sandra está confirmada:",
    reasonLabel: "Motivo de la consulta:",
    meetLabel: "Enlace para la videollamada (Google Meet):",
    joinCta: "Unirse a la cita",
    pasteHint: "Si el botón no funciona, copia y pega este enlace en el navegador:",
    icsHint:
      "Adjuntamos un archivo de calendario (.ics) para que añadas la cita a tu agenda (Google, Apple, Outlook…).",
    receiptLabel: "Recibo del pago (Stripe):",
    policy:
      "Puedes reprogramar la sesión hasta 24 horas antes de la hora acordada. Usa el enlace de abajo o responde a este correo.",
    rescheduleLead: "Cambiar fecha u hora de la cita:",
    rescheduleCta: "Reprogramar mi cita",
    signOff: "— Sandra Lorden",
  };
}

export function virtualAppointmentEmailSubject(locale: VirtualAppointmentEmailLocale): string {
  return locale === "en"
    ? "Virtual session confirmed — Sandra Lorden"
    : "Cita virtual confirmada con Sandra Lorden";
}

export function buildVirtualAppointmentEmailHtml(
  name: string,
  label: string,
  meetUrl: string,
  reason: string | null | undefined,
  options: VirtualAppointmentEmailOptions,
): string {
  const c = copy(options.locale);
  const safeName = escapeHtml(name);
  const safeLabel = escapeHtml(label);
  const safeMeet = escapeHtml(meetUrl);
  const reasonTrim = typeof reason === "string" ? reason.trim() : "";
  const reasonBlock = reasonTrim
    ? `<p><strong>${escapeHtml(c.reasonLabel)}</strong><br/>${escapeHtml(reasonTrim).replace(/\n/g, "<br/>")}</p>`
    : "";

  const receiptBlock =
    options.receiptUrl && options.receiptUrl.startsWith("http")
      ? `<p><strong>${escapeHtml(c.receiptLabel)}</strong> <a href="${escapeHtml(options.receiptUrl)}">${escapeHtml(options.receiptUrl)}</a></p>`
      : "";

  const rescheduleBlock =
    options.rescheduleUrl && options.rescheduleUrl.startsWith("http")
      ? `<p style="margin-top:16px;"><strong>${escapeHtml(c.rescheduleLead)}</strong></p><p><a href="${escapeHtml(options.rescheduleUrl)}" style="display:inline-block;padding:10px 18px;background:#5c4a4a;color:#fff;text-decoration:none;border-radius:9999px;">${escapeHtml(c.rescheduleCta)}</a></p><p style="font-size:12px;color:#888;">${escapeHtml(options.rescheduleUrl)}</p>`
      : "";

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="font-family:Georgia,serif;color:#3D2C2C;line-height:1.6;max-width:480px;margin:0 auto;padding:24px;">
  <p>${c.greeting(safeName)}</p>
  <p>${c.confirmed}</p>
  <p style="font-size:18px;font-weight:600;">${safeLabel}</p>
  ${reasonBlock}
  <p>${escapeHtml(c.meetLabel)}</p>
  <p><a href="${safeMeet}" style="display:inline-block;padding:12px 20px;background:#3D2C2C;color:#fff;text-decoration:none;border-radius:9999px;">${escapeHtml(c.joinCta)}</a></p>
  <p style="font-size:13px;color:#888;">${escapeHtml(c.pasteHint)}<br/>${safeMeet}</p>
  <p style="font-size:13px;color:#666;">${escapeHtml(c.icsHint)}</p>
  ${receiptBlock}
  ${rescheduleBlock}
  <p style="font-size:13px;color:#666;border-top:1px solid #eee;padding-top:12px;margin-top:16px;">${escapeHtml(c.policy)}</p>
  <p style="font-size:13px;color:#888;">${escapeHtml(c.signOff)}</p>
</body></html>`;
}

export function buildVirtualAppointmentEmailText(
  name: string,
  label: string,
  meetUrl: string,
  reason: string | null | undefined,
  options: VirtualAppointmentEmailOptions,
): string {
  const c = copy(options.locale);
  const reasonTrim = typeof reason === "string" ? reason.trim() : "";
  const reasonBlock = reasonTrim ? `\n${c.reasonLabel}\n${reasonTrim}\n` : "\n";
  const receiptBlock =
    options.receiptUrl && options.receiptUrl.startsWith("http")
      ? `\n${c.receiptLabel}\n${options.receiptUrl}\n`
      : "";
  const rescheduleBlock =
    options.rescheduleUrl && options.rescheduleUrl.startsWith("http")
      ? `\n${c.rescheduleLead}\n${options.rescheduleUrl}\n`
      : "";
  return `${c.greeting(name)}

${c.confirmed}
${label}${reasonBlock}
${c.meetLabel}
${meetUrl}

${c.icsHint}
${receiptBlock}
${rescheduleBlock}
${c.policy}

${c.signOff}`;
}

export function virtualAppointmentRescheduleEmailSubject(locale: VirtualAppointmentEmailLocale): string {
  return locale === "en"
    ? "Virtual session rescheduled — Sandra Lorden"
    : "Cita virtual reprogramada — Sandra Lorden";
}

function rescheduleCopy(locale: VirtualAppointmentEmailLocale) {
  if (locale === "en") {
    return {
      greeting: (name: string) => `Hi ${name},`,
      lead: "Your virtual session has been rescheduled to:",
      reasonLabel: "Reason for your session:",
      meetLabel: "Google Meet link (unchanged):",
      joinCta: "Join session",
      pasteHint: "If the button doesn’t work, copy this link into your browser:",
      icsHint: "A new calendar file (.ics) is attached with the updated time.",
      signOff: "— Sandra Lorden",
    };
  }
  return {
    greeting: (name: string) => `Hola ${name},`,
    lead: "Tu cita virtual ha sido reprogramada para:",
    reasonLabel: "Motivo de la consulta:",
    meetLabel: "Enlace para la videollamada (Google Meet):",
    joinCta: "Unirse a la cita",
    pasteHint: "Si el botón no funciona, copia y pega este enlace en el navegador:",
    icsHint: "Adjuntamos un nuevo archivo de calendario (.ics) con la hora actualizada.",
    signOff: "— Sandra Lorden",
  };
}

export function buildVirtualAppointmentRescheduleEmailHtml(
  name: string,
  label: string,
  meetUrl: string,
  reason: string | null | undefined,
  locale: VirtualAppointmentEmailLocale,
): string {
  const c = rescheduleCopy(locale);
  const safeName = escapeHtml(name);
  const safeLabel = escapeHtml(label);
  const safeMeet = escapeHtml(meetUrl);
  const reasonTrim = typeof reason === "string" ? reason.trim() : "";
  const reasonBlock = reasonTrim
    ? `<p><strong>${escapeHtml(c.reasonLabel)}</strong><br/>${escapeHtml(reasonTrim).replace(/\n/g, "<br/>")}</p>`
    : "";
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="font-family:Georgia,serif;color:#3D2C2C;line-height:1.6;max-width:480px;margin:0 auto;padding:24px;">
  <p>${c.greeting(safeName)}</p>
  <p>${escapeHtml(c.lead)}</p>
  <p style="font-size:18px;font-weight:600;">${safeLabel}</p>
  ${reasonBlock}
  <p>${escapeHtml(c.meetLabel)}</p>
  <p><a href="${safeMeet}" style="display:inline-block;padding:12px 20px;background:#3D2C2C;color:#fff;text-decoration:none;border-radius:9999px;">${escapeHtml(c.joinCta)}</a></p>
  <p style="font-size:13px;color:#888;">${escapeHtml(c.pasteHint)}<br/>${safeMeet}</p>
  <p style="font-size:13px;color:#666;">${escapeHtml(c.icsHint)}</p>
  <p style="font-size:13px;color:#888;">${escapeHtml(c.signOff)}</p>
</body></html>`;
}

export function buildVirtualAppointmentRescheduleEmailText(
  name: string,
  label: string,
  meetUrl: string,
  reason: string | null | undefined,
  locale: VirtualAppointmentEmailLocale,
): string {
  const c = rescheduleCopy(locale);
  const reasonTrim = typeof reason === "string" ? reason.trim() : "";
  const reasonBlock = reasonTrim ? `\n${c.reasonLabel}\n${reasonTrim}\n` : "\n";
  return `${c.greeting(name)}

${c.lead}
${label}${reasonBlock}
${c.meetLabel}
${meetUrl}

${c.icsHint}

${c.signOff}`;
}
