import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(name, email)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();

  const body = await request.json();
  const { client_id, amount, concept, status, due_date } = body;

  if (!client_id || !concept) {
    return NextResponse.json({ error: "Cliente y concepto son obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      client_id,
      amount: Number(amount) || 0,
      currency: "EUR",
      concept,
      status: status || "pending",
      due_date: due_date || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Nueva factura creada", `${concept} — ${amount}€`, client_id);
  return NextResponse.json(data, { status: 201 });
}
