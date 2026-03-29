import { randomUUID } from "crypto";
import { google } from "googleapis";
import type Stripe from "stripe";

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_ID?.trim() &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() &&
      process.env.GOOGLE_PRIVATE_KEY?.trim(),
  );
}

/** Acepta clave en .env con \n escapados o comillas envolventes (evita error DECODER routines::unsupported). */
function normalizeGooglePrivateKey(raw: string): string {
  let k = raw.trim();
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1);
  }
  k = k.replace(/\\n/g, "\n");
  if (!k.includes("BEGIN PRIVATE KEY") && !k.includes("BEGIN RSA PRIVATE KEY")) {
    console.error(
      "google-calendar-meet: GOOGLE_PRIVATE_KEY no parece un PEM (faltan líneas BEGIN/END). Revisa el .env.",
    );
  }
  return k;
}

/**
 * Crea un evento en Google Calendar con Meet único por cita (API Calendar).
 * Requiere: proyecto Google Cloud con Calendar API, cuenta de servicio, y un calendario
 * compartido con esa cuenta (permiso "Hacer cambios en los eventos").
 *
 * Si faltan variables o falla la API, devuelve null y se usa VIRTUAL_APPOINTMENT_MEET_URL.
 */
export type GoogleMeetCreateResult = { meetLink: string; calendarEventId: string };

export async function createGoogleMeetForVirtualAppointment(
  session: Stripe.Checkout.Session,
): Promise<GoogleMeetCreateResult | null> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  if (!calendarId || !saEmail || !privateKeyRaw?.trim()) {
    return null;
  }
  const privateKey = normalizeGooglePrivateKey(privateKeyRaw);

  const meta = session.metadata || {};
  const start = typeof meta.slot_start === "string" ? meta.slot_start.trim() : "";
  const end = typeof meta.slot_end === "string" ? meta.slot_end.trim() : "";
  const clientName = typeof meta.client_name === "string" ? meta.client_name.trim() : "Cliente";
  const reasonMeta =
    typeof meta.appointment_reason === "string" ? meta.appointment_reason.trim() : "";

  if (!start || !end) {
    console.error("google-calendar-meet: metadata sin slot_start/slot_end");
    return null;
  }

  const tz = process.env.VIRTUAL_APPOINTMENT_TZ?.trim() || "Europe/Madrid";
  /** Google Workspace: email del usuario a suplantar (delegación de dominio en Admin). Sin esto, Meet desde API a veces falla con cuenta de servicio + Gmail personal. */
  const delegatedUser = process.env.GOOGLE_CALENDAR_DELEGATED_USER?.trim();

  try {
    const auth = new google.auth.JWT({
      email: saEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
      ...(delegatedUser ? { subject: delegatedUser } : {}),
    });

    const calendar = google.calendar({ version: "v3", auth });

    const baseBody = {
      summary: `Cita virtual — ${clientName}`,
      description: reasonMeta
        ? `Videollamada individual (Sandra Lorden). Enlace único para esta cita.\n\nMotivo de la consulta:\n${reasonMeta}`
        : "Videollamada individual (Sandra Lorden). Enlace único para esta cita.",
      start: { dateTime: start, timeZone: tz },
      end: { dateTime: end, timeZone: tz },
    };

    /**
     * hangoutsMeet suele dar "Invalid conference type" con service account + Gmail personal.
     * Orden: sin tipo (Google elige) → Meet explícito → Hangouts clásico (algunas cuentas).
     */
    const conferenceAttempts: Array<{
      label: string;
      createRequest: { requestId: string; conferenceSolutionKey?: { type: string } };
    }> = [
      {
        label: "default",
        createRequest: { requestId: randomUUID() },
      },
      {
        label: "hangoutsMeet",
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      {
        label: "eventHangout",
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: { type: "eventHangout" },
        },
      },
    ];

    let lastConferenceError: unknown;

    for (const attempt of conferenceAttempts) {
      try {
        const res = await calendar.events.insert({
          calendarId,
          conferenceDataVersion: 1,
          requestBody: {
            ...baseBody,
            conferenceData: { createRequest: attempt.createRequest },
          },
        });
        const link =
          res.data.hangoutLink ||
          res.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ||
          null;
        const eventId = res.data.id;
        if (link && eventId) {
          return { meetLink: link, calendarEventId: eventId };
        }
        console.error(
          `google-calendar-meet: intento «${attempt.label}»: evento creado pero sin enlace Meet (no se reintenta para no duplicar eventos).`,
        );
        return null;
      } catch (err) {
        const m = err instanceof Error ? err.message : String(err);
        if (m.includes("Invalid conference") || m.includes("conference type")) {
          lastConferenceError = err;
          continue;
        }
        throw err;
      }
    }

    if (lastConferenceError) {
      throw lastConferenceError instanceof Error
        ? lastConferenceError
        : new Error(String(lastConferenceError));
    }

    return null;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("google-calendar-meet:", msg);
    if (msg.includes("DECODER") || msg.includes("unsupported")) {
      console.error(
        "google-calendar-meet: la clave privada no es un PEM válido. En .env usa GOOGLE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n\" (una línea con \\n entre bloques).",
      );
    }
    if (msg.includes("writer access") || msg.includes("403") || msg.includes("Forbidden")) {
      console.error(
        "google-calendar-meet: comparte el calendario (GOOGLE_CALENDAR_ID) con GOOGLE_SERVICE_ACCOUNT_EMAIL con permiso «Hacer cambios en los eventos» (no solo ver). El ID debe ser el del calendario compartido (p. ej. xxx@group.calendar.google.com).",
      );
    }
    if (msg.includes("Invalid conference") || msg.includes("conference type")) {
      console.error(
        "google-calendar-meet: Meet por API suele requerir Google Workspace con delegación: GOOGLE_CALENDAR_DELEGATED_USER=tu@dominio.com (Admin → delegación de dominio para la cuenta de servicio). Con Gmail personal a veces no hay Meet por API; usa VIRTUAL_APPOINTMENT_MEET_URL o OAuth de usuario.",
      );
    }
    return null;
  }
}

type SessionSlotMeta = {
  start: string;
  end: string;
  clientName: string;
};

function getSessionSlotMeta(session: Stripe.Checkout.Session): SessionSlotMeta | null {
  const meta = session.metadata || {};
  const start = typeof meta.slot_start === "string" ? meta.slot_start.trim() : "";
  const end = typeof meta.slot_end === "string" ? meta.slot_end.trim() : "";
  const clientName =
    typeof meta.client_name === "string" ? meta.client_name.trim() : "Cliente";
  if (!start || !end) return null;
  return { start, end, clientName };
}

/**
 * Crea un evento en el calendario compartido **sin** conferencia por API (sin Meet generado por Google).
 * El enlace Meet va en **ubicación** (se ve bien en móvil) y en la descripción. Sin invitados Calendar
 * en Gmail personal (cuentas de servicio sin delegación de dominio).
 */
export async function createGoogleCalendarEventWithMeetInDescription(
  session: Stripe.Checkout.Session,
  meetLink: string,
  options?: { attendeeEmail?: string | null; reason?: string | null },
): Promise<{ eventId: string } | null> {
  if (!isGoogleCalendarConfigured()) return null;

  const slot = getSessionSlotMeta(session);
  if (!slot) {
    console.error("google-calendar-meet: metadata sin slot_start/slot_end (evento plano)");
    return null;
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID!.trim();
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!.trim();
  const privateKey = normalizeGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY!);
  const tz = process.env.VIRTUAL_APPOINTMENT_TZ?.trim() || "Europe/Madrid";
  const delegatedUser = process.env.GOOGLE_CALENDAR_DELEGATED_USER?.trim();

  const attendeeEmail =
    typeof options?.attendeeEmail === "string" ? options.attendeeEmail.trim() : "";
  const validAttendee = attendeeEmail.includes("@");
  /** Sin delegación de dominio, la API rechaza attendees en eventos creados por cuenta de servicio. */
  const canInviteAttendees = Boolean(delegatedUser && validAttendee);

  const reasonText =
    (typeof options?.reason === "string" && options.reason.trim()
      ? options.reason.trim()
      : typeof session.metadata?.appointment_reason === "string"
        ? session.metadata.appointment_reason.trim()
        : "") || "";

  const descriptionLines = [
    "Videollamada individual (Sandra Lorden).",
    "",
    `Enlace Meet: ${meetLink}`,
  ];
  if (reasonText) {
    descriptionLines.push("", "Motivo de la consulta:", reasonText);
  }
  if (validAttendee) {
    descriptionLines.push("", `Email cliente: ${attendeeEmail}`);
  }

  try {
    const auth = new google.auth.JWT({
      email: saEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
      ...(delegatedUser ? { subject: delegatedUser } : {}),
    });

    const calendar = google.calendar({ version: "v3", auth });

    const inserted = await calendar.events.insert({
      calendarId,
      ...(canInviteAttendees ? { sendUpdates: "none" as const } : {}),
      requestBody: {
        summary: `Cita virtual — ${slot.clientName}`,
        // En móvil suele mostrarse antes que la descripción (a veces colapsada).
        location: meetLink,
        description: descriptionLines.join("\n"),
        start: { dateTime: slot.start, timeZone: tz },
        end: { dateTime: slot.end, timeZone: tz },
        ...(canInviteAttendees
          ? {
              attendees: [{ email: attendeeEmail, responseStatus: "needsAction" }],
            }
          : {}),
      },
    });

    const eventId = inserted.data.id;
    if (!eventId) return null;
    return { eventId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("google-calendar-meet (evento plano):", msg);
    if (msg.includes("writer access") || msg.includes("403") || msg.includes("Forbidden")) {
      console.error(
        "google-calendar-meet: comparte el calendario con la cuenta de servicio (edición de eventos).",
      );
    }
    if (msg.includes("Domain-Wide Delegation") || msg.includes("invite attendees")) {
      console.error(
        "google-calendar-meet: las cuentas de servicio no pueden invitar asistentes sin Workspace + delegación. El cliente va en la descripción del evento (Gmail personal).",
      );
    }
    return null;
  }
}

/**
 * Actualiza fecha/hora de un evento creado en el calendario compartido (p. ej. tras reprogramar la cita).
 * Con Workspace + delegación y asistente en el evento, `sendUpdates: all` notifica al cliente por Google Calendar.
 */
export async function patchGoogleCalendarVirtualAppointmentEvent(
  eventId: string,
  startIso: string,
  endIso: string,
  options?: { attendeeEmail?: string | null },
): Promise<boolean> {
  if (!isGoogleCalendarConfigured()) return false;

  const calendarId = process.env.GOOGLE_CALENDAR_ID!.trim();
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!.trim();
  const privateKey = normalizeGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY!);
  const tz = process.env.VIRTUAL_APPOINTMENT_TZ?.trim() || "Europe/Madrid";
  const delegatedUser = process.env.GOOGLE_CALENDAR_DELEGATED_USER?.trim();

  const attendeeEmail =
    typeof options?.attendeeEmail === "string" ? options.attendeeEmail.trim() : "";
  const validAttendee = attendeeEmail.includes("@");
  const canInviteAttendees = Boolean(delegatedUser && validAttendee);

  try {
    const auth = new google.auth.JWT({
      email: saEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
      ...(delegatedUser ? { subject: delegatedUser } : {}),
    });

    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.patch({
      calendarId,
      eventId,
      ...(canInviteAttendees ? { sendUpdates: "all" as const } : {}),
      requestBody: {
        start: { dateTime: startIso, timeZone: tz },
        end: { dateTime: endIso, timeZone: tz },
      },
    });

    return true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("google-calendar-meet (patch evento):", msg);
    return false;
  }
}
