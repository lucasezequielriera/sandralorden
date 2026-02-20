import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();

  const body = await request.json();
  const { name, email, phone, service_type, goal, status, notes } = body;

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Nombre, email y teléfono son obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({ name, email, phone, service_type: service_type || "", goal: goal || "", status: status || "lead", notes: notes || "" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Nuevo cliente creado", `${name} (${email})`, data.id);
  return NextResponse.json(data, { status: 201 });
}
