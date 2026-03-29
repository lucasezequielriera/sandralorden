import { randomUUID } from "crypto";
import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import {
  buildVirtualAppointmentEmailHtml,
  buildVirtualAppointmentEmailText,
  virtualAppointmentEmailSubject,
  type VirtualAppointmentEmailOptions,
} from "@/lib/email-virtual-appointment";
import { escapeHtml } from "@/lib/sanitize";
import { getCheckoutReceiptUrl } from "@/lib/stripe-checkout-receipt";
import {
  buildVirtualAppointmentIcs,
  virtualAppointmentIcsFilename,
} from "@/lib/virtual-appointment-ics";
import {
  createGoogleCalendarEventWithMeetInDescription,
  createGoogleMeetForVirtualAppointment,
  isGoogleCalendarConfigured,
} from "@/lib/google-calendar-meet";
import {
  formatAppointmentLabel,
  formatAppointmentLabelEs,
  getVirtualAppointmentMeetUrl,
  getVirtualAppointmentUnitAmountCents,
} from "@/lib/virtual-appointments";
import { buildVirtualAppointmentRescheduleUrl } from "@/lib/virtual-appointment-reschedule";
import { captureException } from "@/lib/sentry";

/** Texto en una línea para `activity_logs.details` (panel admin). */
function reasonForActivityLog(reason: string, max = 240): string {
  return reason.trim().replace(/\s+/g, " ").slice(0, max);
}

export async function handleVirtualAppointmentPaid(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session,
  eventId: string,
): Promise<void> {
  const checkoutSessionId = session.id;
  const meta = session.metadata || {};
  const metaRowId = typeof meta.appointment_row_id === "string" ? meta.appointment_row_id.trim() : "";

  const { data: emailDone } = await supabase
    .from("activity_logs")
    .select("id")
    .ilike("details", `%virtual_appt_email:${checkoutSessionId}%`)
    .limit(1)
    .maybeSingle();
  if (emailDone?.id) return;

  const { data: existingVa } = await supabase
    .from("virtual_appointments")
    .select("meet_link")
    .eq("stripe_checkout_session_id", checkoutSessionId)
    .maybeSingle();

  let apiMeetLink: string | null = null;
  let apiCalendarEventId: string | null = null;
  if (!existingVa?.meet_link?.trim()) {
    const apiResult = await createGoogleMeetForVirtualAppointment(session);
    apiMeetLink = apiResult?.meetLink ?? null;
    apiCalendarEventId = apiResult?.calendarEventId ?? null;
  }

  const meetLink =
    existingVa?.meet_link?.trim() ||
    apiMeetLink?.trim() ||
    getVirtualAppointmentMeetUrl().trim() ||
    null;

  const { data: transitioned } = await supabase
    .from("virtual_appointments")
    .update({
      status: "paid",
      meet_link: meetLink,
      reschedule_token: randomUUID(),
    })
    .eq("stripe_checkout_session_id", checkoutSessionId)
    .eq("status", "pending")
    .select("id, client_id, email, name, starts_at, ends_at, source, reason, locale, reschedule_token")
    .maybeSingle();

  let row = transitioned;

  if (!row && metaRowId) {
    const { data: byApptId } = await supabase
      .from("virtual_appointments")
      .update({
        status: "paid",
        meet_link: meetLink,
        stripe_checkout_session_id: checkoutSessionId,
        reschedule_token: randomUUID(),
      })
      .eq("id", metaRowId)
      .eq("status", "pending")
      .select("id, client_id, email, name, starts_at, ends_at, source, reason, locale, reschedule_token")
      .maybeSingle();
    row = byApptId;
  }

  if (!row) {
    const { data: paid } = await supabase
      .from("virtual_appointments")
      .select("id, client_id, email, name, starts_at, ends_at, source, reason, locale, reschedule_token")
      .eq("stripe_checkout_session_id", checkoutSessionId)
      .eq("status", "paid")
      .maybeSingle();
    row = paid;
  }

  if (!row) {
    console.error("virtual_appointment: no row for session", checkoutSessionId);
    throw new Error("virtual_appointment_missing");
  }

  if (apiCalendarEventId) {
    await supabase
      .from("virtual_appointments")
      .update({ google_calendar_event_id: apiCalendarEventId })
      .eq("id", row.id);
  }

  const clientReason = typeof row.reason === "string" ? row.reason : "";
  const reasonLogFragment = clientReason.trim()
    ? ` · Motivo: ${reasonForActivityLog(clientReason)}`
    : "";

  const { data: calendarPlainDone } = await supabase
    .from("activity_logs")
    .select("id")
    .ilike("details", `%va_calendar_plain:${checkoutSessionId}%`)
    .limit(1)
    .maybeSingle();

  if (
    meetLink &&
    isGoogleCalendarConfigured() &&
    !apiMeetLink &&
    !calendarPlainDone?.id
  ) {
    const calInserted = await createGoogleCalendarEventWithMeetInDescription(session, meetLink, {
      attendeeEmail: row.email as string,
      reason: typeof row.reason === "string" ? row.reason : "",
    });
    if (calInserted?.eventId) {
      await supabase
        .from("virtual_appointments")
        .update({ google_calendar_event_id: calInserted.eventId })
        .eq("id", row.id);
      await supabase.from("activity_logs").insert({
        client_id: row.client_id ?? null,
        action: "Cita virtual: evento en Google Calendar",
        details: `va_calendar_plain:${checkoutSessionId}${reasonLogFragment}`,
      });
    }
  }

  const { data: invoiceLogged } = await supabase
    .from("activity_logs")
    .select("id")
    .ilike("details", `%va_invoice:${checkoutSessionId}%`)
    .limit(1)
    .maybeSingle();

  if (!invoiceLogged?.id) {
    const total = session.amount_total;
    const amountEur =
      typeof total === "number" && total > 0
        ? total / 100
        : getVirtualAppointmentUnitAmountCents() / 100;
    const paidDateStr = new Date().toISOString().split("T")[0];
    const reasonStr = typeof row.reason === "string" ? row.reason.trim() : "";
    const conceptSuffix =
      reasonStr.length > 0
        ? ` — ${reasonStr.length > 120 ? `${reasonStr.slice(0, 120)}…` : reasonStr}`
        : "";
    const concept = `Cita virtual · ${String(row.name)} (${String(row.email)})${conceptSuffix}`;

    const { error: invErr } = await supabase.from("invoices").insert({
      client_id: row.client_id ?? null,
      amount: Number(amountEur.toFixed(2)),
      currency: "EUR",
      concept,
      status: "paid",
      paid_date: paidDateStr,
      due_date: paidDateStr,
    });

    if (invErr) {
      console.error("virtual_appointment: factura contabilidad:", invErr.message);
    } else {
      await supabase.from("activity_logs").insert({
        client_id: row.client_id ?? null,
        action: "Factura: cita virtual (Stripe)",
        details: `va_invoice:${checkoutSessionId};amount:${amountEur.toFixed(2)}${reasonLogFragment}`,
      });
    }
  }

  const metaLocale = typeof meta.locale === "string" ? meta.locale.trim() : "";
  const emailLocale: "en" | "es" =
    row.locale === "en" ? "en" : row.locale === "es" ? "es" : metaLocale === "en" ? "en" : "es";
  const tokenForLink =
    row.reschedule_token != null ? String(row.reschedule_token).trim() : "";
  const rescheduleUrl = tokenForLink ? buildVirtualAppointmentRescheduleUrl(emailLocale, tokenForLink) : "";
  const label = formatAppointmentLabel(row.starts_at as string, emailLocale);
  const displayMeet = meetLink || "https://meet.google.com/";
  const labelEs = formatAppointmentLabelEs(row.starts_at as string);

  let receiptUrl: string | null = null;
  try {
    receiptUrl = await getCheckoutReceiptUrl(session);
  } catch (e) {
    captureException(e, { step: "stripe_receipt_url", checkoutSessionId });
  }

  const emailOpts: VirtualAppointmentEmailOptions = {
    locale: emailLocale,
    receiptUrl,
    rescheduleUrl: rescheduleUrl || undefined,
  };

  const icsContent = buildVirtualAppointmentIcs({
    uidSeed: String(row.id),
    startsAtIso: row.starts_at as string,
    endsAtIso: row.ends_at as string,
    meetUrl: displayMeet,
    clientName: String(row.name),
    reason: clientReason,
    locale: emailLocale,
  });

  try {
    await sendEmail({
      to: row.email as string,
      subject: virtualAppointmentEmailSubject(emailLocale),
      html: buildVirtualAppointmentEmailHtml(
        row.name as string,
        label,
        displayMeet,
        clientReason,
        emailOpts,
      ),
      text: buildVirtualAppointmentEmailText(
        row.name as string,
        label,
        displayMeet,
        clientReason,
        emailOpts,
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
    captureException(e, { step: "virtual_appt_client_email", checkoutSessionId });
    throw e;
  }

  await supabase.from("activity_logs").insert({
    client_id: null,
    action: "Cita virtual: correo cliente enviado",
    details: `virtual_appt_email:${checkoutSessionId};stripe_event:${eventId};email:${row.email}${reasonLogFragment}`,
  });

  const sandra = process.env.SANDRA_EMAIL?.trim();
  if (sandra) {
    try {
      await sendEmail({
        to: sandra,
        subject: `Nueva cita virtual pagada — ${labelEs}`,
        html: `<p>Pago confirmado en Stripe.</p><p><strong>${escapeHtml(String(row.name))}</strong> (${escapeHtml(String(row.email))})</p><p>${escapeHtml(labelEs)}</p>${clientReason.trim() ? `<p><strong>Motivo:</strong> ${escapeHtml(clientReason).replace(/\n/g, "<br/>")}</p>` : ""}<p>Origen: ${escapeHtml(String(row.source))}</p>${meetLink ? `<p><a href="${escapeHtml(meetLink)}">Meet</a></p>` : "<p><em>Sin enlace Meet (Calendar o VIRTUAL_APPOINTMENT_MEET_URL).</em></p>"}`,
        text: `Cita virtual pagada.\n${row.name} (${row.email})\n${labelEs}\n${clientReason.trim() ? `Motivo:\n${clientReason}\n` : ""}Origen: ${row.source}\nMeet: ${meetLink || "(sin enlace)"}`,
      });
    } catch (e) {
      captureException(e, { step: "virtual_appt_sandra_email", checkoutSessionId });
      console.error(
        "virtual_appointment: correo a Sandra falló (no se reintenta el del cliente)",
        e instanceof Error ? e.message : e,
      );
    }
  }
}
