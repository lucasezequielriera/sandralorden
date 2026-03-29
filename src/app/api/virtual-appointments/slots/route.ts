import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { fetchAvailableSlots } from "@/lib/virtual-appointments";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`va_slots:${ip}`, { maxRequests: 40, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });
  }

  try {
    const supabase = await createServiceClient();
    const slots = await fetchAvailableSlots(supabase);
    return NextResponse.json({ slots });
  } catch (e) {
    console.error("virtual-appointments/slots:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "No se pudieron cargar los horarios." }, { status: 500 });
  }
}
