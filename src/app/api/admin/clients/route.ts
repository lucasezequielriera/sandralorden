import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

export async function GET() {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Clients GET error:", error.message);
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const body = await request.json();
  const { name, email, phone, service_type, modality, goal, status, notes } = body;

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Nombre, email y teléfono son obligatorios" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Ya existe un cliente con ese email" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      name, email, phone,
      service_type: service_type || "",
      modality: modality || "",
      goal: goal || "",
      status: status || "lead",
      notes: notes || "",
    })
    .select()
    .single();

  if (error) {
    console.error("Client creation error:", error.message);
    return NextResponse.json({ error: "Error al crear el cliente" }, { status: 500 });
  }
  await logActivity("Nuevo cliente creado", `${name} (${email})`, data.id);
  return NextResponse.json(data, { status: 201 });
}
