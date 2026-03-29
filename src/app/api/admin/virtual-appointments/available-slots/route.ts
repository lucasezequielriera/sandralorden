import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/check-role";
import { fetchAvailableSlots } from "@/lib/virtual-appointments";

export async function GET(request: NextRequest) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const excludeId = request.nextUrl.searchParams.get("excludeId")?.trim();
  const slots = await fetchAvailableSlots(
    supabase,
    excludeId ? { excludeAppointmentId: excludeId } : undefined,
  );
  return NextResponse.json({ slots });
}
