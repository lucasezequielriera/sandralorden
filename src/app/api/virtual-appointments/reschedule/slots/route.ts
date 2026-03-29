import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { fetchAvailableSlots } from "@/lib/virtual-appointments";
import { rateLimit } from "@/lib/rate-limit";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`va_reschedule_slots:${ip}`, { maxRequests: 40, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });
  }

  const token = request.nextUrl.searchParams.get("t")?.trim() ?? "";
  if (!UUID_RE.test(token)) {
    return NextResponse.json({ error: "Enlace no válido." }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data: row } = await supabase
    .from("virtual_appointments")
    .select("id, status")
    .eq("reschedule_token", token)
    .maybeSingle();

  if (!row || row.status !== "paid") {
    return NextResponse.json({ error: "No encontramos esta reserva." }, { status: 404 });
  }

  const slots = await fetchAvailableSlots(supabase, { excludeAppointmentId: row.id as string });
  return NextResponse.json({ slots });
}
