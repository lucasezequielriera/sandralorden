/**
 * Citas virtuales: slots en zona horaria de Sandra (Luxon).
 * Sin Calendly: disponibilidad = días laborables + franja horaria (env).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { DateTime } from "luxon";

const TZ = process.env.VIRTUAL_APPOINTMENT_TZ || "Europe/Madrid";

export function getSlotDurationMinutes(): number {
  const n = Number(process.env.VIRTUAL_APPOINTMENT_DURATION_MINUTES || "45");
  return Number.isFinite(n) && n >= 15 && n <= 120 ? n : 45;
}

export function getVirtualAppointmentUnitAmountCents(): number {
  const euros = Number(process.env.VIRTUAL_APPOINTMENT_PRICE_EUR || "60");
  const cents = Math.round(euros * 100);
  return cents > 0 ? cents : 6000;
}

export function getVirtualAppointmentMeetUrl(): string {
  return (process.env.VIRTUAL_APPOINTMENT_MEET_URL || "").trim();
}

function parseHm(s: string): { h: number; m: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return { h, m: min };
}

function getDayWindow(): { startMin: number; endMin: number } {
  const start = parseHm(process.env.VIRTUAL_APPOINTMENT_DAY_START || "10:00") ?? { h: 10, m: 0 };
  const end = parseHm(process.env.VIRTUAL_APPOINTMENT_DAY_END || "18:00") ?? { h: 18, m: 0 };
  return { startMin: start.h * 60 + start.m, endMin: end.h * 60 + end.m };
}

/** 1 = lunes … 7 = domingo (Luxon: idéntico) */
function getAllowedWeekdays(): Set<number> {
  const raw = (process.env.VIRTUAL_APPOINTMENT_WEEKDAYS || "1,2,3,4,5").split(",");
  const set = new Set<number>();
  for (const p of raw) {
    const n = Number(p.trim());
    if (n >= 1 && n <= 7) set.add(n);
  }
  return set.size ? set : new Set([1, 2, 3, 4, 5]);
}

export type SlotCandidate = { startsAt: string; endsAt: string; label: string };

/** Genera huecos teóricos (antes de filtrar ocupados en BD). */
export function generateSlotCandidates(now: Date, opts?: { horizonDays?: number }): SlotCandidate[] {
  const horizonDays = opts?.horizonDays ?? Number(process.env.VIRTUAL_APPOINTMENT_HORIZON_DAYS || "21");
  const duration = getSlotDurationMinutes();
  const { startMin, endMin } = getDayWindow();
  const allowed = getAllowedWeekdays();
  const slots: SlotCandidate[] = [];

  const nowMs = now.getTime();
  let day = DateTime.fromJSDate(now, { zone: TZ }).startOf("day");
  const lastDay = day.plus({ days: horizonDays });

  while (day < lastDay) {
    const wd = day.weekday;
    if (allowed.has(wd)) {
      for (let minutes = startMin; minutes + duration <= endMin; minutes += duration) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const start = day.set({ hour: h, minute: m, second: 0, millisecond: 0 });
        const end = start.plus({ minutes: duration });
        if (start.toMillis() <= nowMs) continue;
        slots.push({
          startsAt: start.toUTC().toISO()!,
          endsAt: end.toUTC().toISO()!,
          label: start.setLocale("es").toFormat("EEE d MMM, HH:mm"),
        });
      }
    }
    day = day.plus({ days: 1 });
  }

  return slots;
}

/** Ventana en minutos durante la cual un pending bloquea el hueco */
export function getPendingHoldMinutes(): number {
  const n = Number(process.env.VIRTUAL_APPOINTMENT_PENDING_HOLD_MINUTES || "45");
  return Number.isFinite(n) && n >= 10 && n <= 180 ? n : 45;
}

/** Cancela reservas pending abandonadas (checkout sin pagar) para liberar el hueco en BD y en la lista. */
export async function releaseStalePendingAppointments(supabase: SupabaseClient): Promise<void> {
  const holdSince = new Date(Date.now() - getPendingHoldMinutes() * 60 * 1000).toISOString();
  await supabase
    .from("virtual_appointments")
    .update({ status: "cancelled" })
    .eq("status", "pending")
    .lt("created_at", holdSince);
}

export type FetchAvailableSlotsOptions = {
  /** Al reprogramar, excluye esta fila del bloqueo para poder elegir el hueco actual u otro libre. */
  excludeAppointmentId?: string;
};

/** Slots libres (candidatos menos ocupados por pending o paid). */
export async function fetchAvailableSlots(
  supabase: SupabaseClient,
  opts?: FetchAvailableSlotsOptions,
): Promise<SlotCandidate[]> {
  await releaseStalePendingAppointments(supabase);
  const candidates = generateSlotCandidates(new Date());

  const { data: rows } = await supabase
    .from("virtual_appointments")
    .select("id, starts_at, status")
    .gte("starts_at", new Date().toISOString())
    .in("status", ["pending", "paid"]);

  const blocked = new Set<string>();
  for (const r of rows ?? []) {
    if (opts?.excludeAppointmentId && r.id === opts.excludeAppointmentId) continue;
    const key = new Date(r.starts_at as string).toISOString();
    blocked.add(key);
  }

  return candidates.filter((c) => !blocked.has(c.startsAt));
}

/** Comprueba que el par inicio/fin coincide con un hueco generado (misma regla que checkout). */
export function isValidSlotCandidate(startsAt: string, endsAt: string): boolean {
  const candidates = generateSlotCandidates(new Date());
  return candidates.some((c) => c.startsAt === startsAt && c.endsAt === endsAt);
}

export function formatAppointmentLabelEs(startsAtIso: string): string {
  return formatAppointmentLabel(startsAtIso, "es");
}

export function formatAppointmentLabel(startsAtIso: string, locale: "es" | "en"): string {
  return DateTime.fromISO(startsAtIso, { zone: "utc" })
    .setZone(TZ)
    .setLocale(locale)
    .toFormat("cccc d MMMM yyyy, HH:mm");
}
