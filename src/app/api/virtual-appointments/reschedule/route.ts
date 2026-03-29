import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sanitizeField } from "@/lib/sanitize";
import { executeVirtualAppointmentReschedule } from "@/lib/virtual-appointment-reschedule";
import { rateLimit } from "@/lib/rate-limit";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`va_reschedule_patch:${ip}`, { maxRequests: 15, windowMs: 120_000 });
  if (!success) {
    return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const token = sanitizeField(body.token, 40);
    const startsAt = sanitizeField(body.startsAt, 80);
    const endsAt = sanitizeField(body.endsAt, 80);

    if (!UUID_RE.test(token) || !startsAt || !endsAt) {
      return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const { data: row } = await supabase
      .from("virtual_appointments")
      .select("id, locale")
      .eq("reschedule_token", token)
      .maybeSingle();

    if (!row) {
      return NextResponse.json({ error: "No encontramos esta reserva." }, { status: 404 });
    }

    const emailLocale: "es" | "en" = row.locale === "en" ? "en" : "es";

    const result = await executeVirtualAppointmentReschedule({
      supabase,
      appointmentId: row.id as string,
      startsAt,
      endsAt,
      emailLocale,
      allowPending: false,
      source: "client",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "No se pudo reprogramar." }, { status: 500 });
  }
}
