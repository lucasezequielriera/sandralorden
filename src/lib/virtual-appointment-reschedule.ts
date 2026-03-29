import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import {
  buildVirtualAppointmentRescheduleEmailHtml,
  buildVirtualAppointmentRescheduleEmailText,
  virtualAppointmentRescheduleEmailSubject,
} from "@/lib/email-virtual-appointment";
import { buildVirtualAppointmentIcs, virtualAppointmentIcsFilename } from "@/lib/virtual-appointment-ics";
import { getPublicSiteOriginFromEnv } from "@/lib/app-base-url";
import {
  patchGoogleCalendarVirtualAppointmentEvent,
  isGoogleCalendarConfigured,
} from "@/lib/google-calendar-meet";
import { logActivity } from "@/lib/supabase/log-activity";
import { escapeHtml } from "@/lib/sanitize";
import { captureException } from "@/lib/sentry";
import {
  fetchAvailableSlots,
  formatAppointmentLabel,
  formatAppointmentLabelEs,
  getVirtualAppointmentMeetUrl,
  isValidSlotCandidate,
} from "@/lib/virtual-appointments";

/** Política: solo se puede reprogramar hasta 24 h antes del inicio de la cita actual. */
const POLICY_MS_BEFORE_START = 24 * 60 * 60 * 1000;

export function isWithinReschedulePolicyWindow(appointmentStartsAtIso: string): boolean {
  const start = new Date(appointmentStartsAtIso).getTime();
  if (Number.isNaN(start)) return false;
  const deadline = start - POLICY_MS_BEFORE_START;
  return Date.now() < deadline;
}

export function buildVirtualAppointmentRescheduleUrl(locale: "es" | "en", token: string): string {
  const origin = getPublicSiteOriginFromEnv().replace(/\/$/, "");
  const path =
    locale === "en"
      ? `/en/virtual-appointment/reschedule?t=${encodeURIComponent(token)}`
      : `/cita-virtual/reprogramar?t=${encodeURIComponent(token)}`;
  return `${origin}${path}`;
}

export type ExecuteVirtualAppointmentRescheduleParams = {
  supabase: SupabaseClient;
  appointmentId: string;
  startsAt: string;
  endsAt: string;
  emailLocale: "es" | "en";
  /** Admin puede reprogramar pending (checkout sin pagar); el cliente solo con cita pagada. */
  allowPending: boolean;
  source: "admin" | "client";
};

export async function executeVirtualAppointmentReschedule(
  params: ExecuteVirtualAppointmentRescheduleParams,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const { supabase, appointmentId, startsAt, endsAt, emailLocale, allowPending, source } = params;

  const { data: row, error: fetchErr } = await supabase
    .from("virtual_appointments")
    .select(
      "id, starts_at, ends_at, status, name, email, phone, reason, meet_link, client_id, google_calendar_event_id, locale",
    )
    .eq("id", appointmentId)
    .single();

  if (fetchErr || !row) {
    return { ok: false, status: 404, error: "Cita no encontrada." };
  }

  if (row.status === "paid") {
    if (!isWithinReschedulePolicyWindow(row.starts_at as string)) {
      return {
        ok: false,
        status: 400,
        error:
          "Ya no se puede reprogramar: solo hasta 24 horas antes de la hora acordada. Escribe a Sandra si necesitas ayuda.",
      };
    }
  } else if (row.status === "pending") {
    if (!allowPending) {
      return { ok: false, status: 400, error: "La reprogramación online requiere el pago confirmado." };
    }
  } else {
    return { ok: false, status: 400, error: "Esta cita no se puede reprogramar." };
  }

  const now = Date.now();
  if (new Date(row.starts_at as string).getTime() < now) {
    return { ok: false, status: 400, error: "No se puede reprogramar una cita ya pasada." };
  }

  const newStartMs = new Date(startsAt).getTime();
  if (newStartMs <= now) {
    return { ok: false, status: 400, error: "El nuevo horario debe ser futuro." };
  }

  if (!isValidSlotCandidate(startsAt, endsAt)) {
    return { ok: false, status: 400, error: "Horario no válido." };
  }

  const available = await fetchAvailableSlots(supabase, { excludeAppointmentId: appointmentId });
  const picked = available.find((s) => s.startsAt === startsAt && s.endsAt === endsAt);
  if (!picked) {
    return { ok: false, status: 400, error: "Ese horario no está disponible." };
  }

  const oldLabel = formatAppointmentLabelEs(row.starts_at as string);
  const calendarEventId =
    typeof row.google_calendar_event_id === "string" ? row.google_calendar_event_id.trim() : "";

  const { data: updated, error: updErr } = await supabase
    .from("virtual_appointments")
    .update({ starts_at: startsAt, ends_at: endsAt })
    .eq("id", appointmentId)
    .select("id, starts_at, ends_at, name, email, reason, meet_link")
    .single();

  if (updErr || !updated) {
    const code = (updErr as { code?: string } | undefined)?.code;
    if (code === "23505") {
      return { ok: false, status: 409, error: "Ese horario ya está ocupado." };
    }
    console.error("virtual_appointment reschedule:", updErr?.message);
    return { ok: false, status: 500, error: "No se pudo actualizar." };
  }

  const meetLink =
    (updated.meet_link as string | null)?.trim() ||
    getVirtualAppointmentMeetUrl().trim() ||
    "https://meet.google.com/";
  const reasonStr = typeof updated.reason === "string" ? updated.reason : "";
  const newLabel = formatAppointmentLabel(startsAt, emailLocale);

  if (calendarEventId && isGoogleCalendarConfigured()) {
    const patched = await patchGoogleCalendarVirtualAppointmentEvent(calendarEventId, startsAt, endsAt, {
      attendeeEmail: updated.email as string,
    });
    if (!patched) {
      captureException(new Error("calendar_patch_failed"), {
        step: "virtual_appt_reschedule_calendar",
        appointmentId,
      });
    }
  }

  const sourceLabel = source === "admin" ? "admin" : "cliente (enlace del correo)";
  await logActivity(
    "Cita virtual reprogramada",
    `${sourceLabel}: ${oldLabel} → ${formatAppointmentLabelEs(startsAt)} · ${row.email}`,
    (row.client_id as string | null) ?? undefined,
  );

  const icsContent = buildVirtualAppointmentIcs({
    uidSeed: `${updated.id}-reschedule-${Date.now()}`,
    startsAtIso: startsAt,
    endsAtIso: endsAt,
    meetUrl: meetLink,
    clientName: String(updated.name),
    reason: reasonStr,
    locale: emailLocale,
  });

  try {
    await sendEmail({
      to: updated.email as string,
      subject: virtualAppointmentRescheduleEmailSubject(emailLocale),
      html: buildVirtualAppointmentRescheduleEmailHtml(
        updated.name as string,
        newLabel,
        meetLink,
        reasonStr,
        emailLocale,
      ),
      text: buildVirtualAppointmentRescheduleEmailText(
        updated.name as string,
        newLabel,
        meetLink,
        reasonStr,
        emailLocale,
      ),
      attachments: [
        {
          filename: virtualAppointmentIcsFilename(emailLocale),
          content: icsContent,
          contentType: "text/calendar; charset=utf-8; method=PUBLISH",
        },
      ],
    });
  } catch (e) {
    captureException(e, { step: "virtual_appt_reschedule_client_email", appointmentId });
    console.error("reschedule email cliente:", e);
  }

  const sandra = process.env.SANDRA_EMAIL?.trim();
  if (sandra) {
    try {
      const sandraHtml =
        source === "admin"
          ? `<p>Reprogramación desde el admin.</p><p><strong>${escapeHtml(String(updated.name))}</strong> (${escapeHtml(String(updated.email))})</p><p>Antes: ${escapeHtml(oldLabel)}</p><p>Ahora: ${escapeHtml(formatAppointmentLabelEs(startsAt))}</p>${meetLink ? `<p><a href="${escapeHtml(meetLink)}">Meet</a></p>` : ""}`
          : `<p>El cliente ha reprogramado desde el enlace del correo.</p><p><strong>${escapeHtml(String(updated.name))}</strong> (${escapeHtml(String(updated.email))})</p><p>Antes: ${escapeHtml(oldLabel)}</p><p>Ahora: ${escapeHtml(formatAppointmentLabelEs(startsAt))}</p>${meetLink ? `<p><a href="${escapeHtml(meetLink)}">Meet</a></p>` : ""}`;
      const sandraText =
        source === "admin"
          ? `Reprogramación admin.\n${updated.name} (${updated.email})\nAntes: ${oldLabel}\nAhora: ${formatAppointmentLabelEs(startsAt)}\nMeet: ${meetLink}`
          : `Reprogramación por el cliente (enlace).\n${updated.name} (${updated.email})\nAntes: ${oldLabel}\nAhora: ${formatAppointmentLabelEs(startsAt)}\nMeet: ${meetLink}`;
      await sendEmail({
        to: sandra,
        subject: `Cita reprogramada — ${formatAppointmentLabelEs(startsAt)} · ${updated.name}`,
        html: sandraHtml,
        text: sandraText,
      });
    } catch (e) {
      captureException(e, { step: "virtual_appt_reschedule_sandra_email", appointmentId });
      console.error("reschedule email Sandra:", e);
    }
  }

  return { ok: true };
}
