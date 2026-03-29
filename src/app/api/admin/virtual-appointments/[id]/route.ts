import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/check-role";
import { sanitizeField } from "@/lib/sanitize";
import { executeVirtualAppointmentReschedule } from "@/lib/virtual-appointment-reschedule";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "ID no válido" }, { status: 400 });
  }

  const body = await request.json();
  const startsAt = sanitizeField(body.startsAt, 80);
  const endsAt = sanitizeField(body.endsAt, 80);
  const localeRaw = sanitizeField(body.emailLocale, 10);
  const emailLocale: "es" | "en" = localeRaw === "en" ? "en" : "es";

  if (!startsAt || !endsAt) {
    return NextResponse.json({ error: "Faltan startsAt y endsAt." }, { status: 400 });
  }

  const result = await executeVirtualAppointmentReschedule({
    supabase,
    appointmentId: id,
    startsAt,
    endsAt,
    emailLocale,
    allowPending: true,
    source: "admin",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { data: row } = await supabase
    .from("virtual_appointments")
    .select("id, starts_at, ends_at, name, email, reason, meet_link")
    .eq("id", id)
    .single();

  return NextResponse.json(row ?? { success: true });
}
