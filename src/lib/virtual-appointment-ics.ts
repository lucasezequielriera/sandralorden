import { DateTime } from "luxon";

const TZ = process.env.VIRTUAL_APPOINTMENT_TZ || "Europe/Madrid";

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 0) {
    parts.push(rest.slice(0, 75));
    rest = rest.slice(75);
  }
  return parts.join("\r\n ");
}

/**
 * Genera un .ics (RFC 5545) para que el cliente añada la cita a su calendario.
 */
export function buildVirtualAppointmentIcs(opts: {
  uidSeed: string;
  startsAtIso: string;
  endsAtIso: string;
  meetUrl: string;
  clientName: string;
  reason?: string | null;
  locale: "es" | "en";
}): string {
  const start = DateTime.fromISO(opts.startsAtIso, { zone: "utc" });
  const end = DateTime.fromISO(opts.endsAtIso, { zone: "utc" });
  const dtStart = start.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const dtEnd = end.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const dtStamp = DateTime.utc().toFormat("yyyyMMdd'T'HHmmss'Z'");

  const uid = `${opts.uidSeed.replace(/[^a-zA-Z0-9-]/g, "")}@sandralorden-virtual`;
  const summary =
    opts.locale === "en"
      ? `Virtual session — Sandra Lorden (${opts.clientName})`
      : `Cita virtual — Sandra Lorden (${opts.clientName})`;

  const descLines: string[] = [];
  if (opts.locale === "en") {
    descLines.push(`Google Meet: ${opts.meetUrl}`);
    if (opts.reason?.trim()) descLines.push("", `Reason: ${opts.reason.trim()}`);
    descLines.push("", `Timezone for display: ${TZ}`);
  } else {
    descLines.push(`Google Meet: ${opts.meetUrl}`);
    if (opts.reason?.trim()) descLines.push("", `Motivo: ${opts.reason.trim()}`);
    descLines.push("", `Zona horaria (referencia): ${TZ}`);
  }
  const description = escapeIcsText(descLines.join("\n"));
  const location = escapeIcsText(opts.meetUrl);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sandra Lorden//Virtual Appointment//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `URL:${escapeIcsText(opts.meetUrl)}`,
    `END:VEVENT`,
    "END:VCALENDAR",
  ];

  return lines.map((l) => foldLine(l)).join("\r\n");
}

export function virtualAppointmentIcsFilename(locale: "es" | "en"): string {
  return locale === "en" ? "virtual-session-sandra-lorden.ics" : "cita-virtual-sandra-lorden.ics";
}
