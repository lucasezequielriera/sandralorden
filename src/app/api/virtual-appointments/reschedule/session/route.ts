import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { isWithinReschedulePolicyWindow } from "@/lib/virtual-appointment-reschedule";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`va_reschedule_session:${ip}`, { maxRequests: 30, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });
  }

  const token = request.nextUrl.searchParams.get("t")?.trim() ?? "";
  if (!UUID_RE.test(token)) {
    return NextResponse.json({ error: "Enlace no válido." }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data: row, error } = await supabase
    .from("virtual_appointments")
    .select("id, starts_at, ends_at, status, name, locale")
    .eq("reschedule_token", token)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json({ error: "No encontramos esta reserva." }, { status: 404 });
  }

  if (row.status !== "paid") {
    return NextResponse.json({ error: "Solo se puede reprogramar tras confirmar el pago." }, { status: 400 });
  }

  const startsAt = row.starts_at as string;
  if (new Date(startsAt).getTime() < Date.now()) {
    return NextResponse.json({ error: "Esta cita ya pasó." }, { status: 400 });
  }

  const policyOk = isWithinReschedulePolicyWindow(startsAt);
  const locale = row.locale === "en" ? "en" : "es";

  return NextResponse.json({
    name: row.name,
    startsAt,
    endsAt: row.ends_at as string,
    locale,
    policyOk,
    policyMessageKey: policyOk ? null : "deadline",
  });
}
