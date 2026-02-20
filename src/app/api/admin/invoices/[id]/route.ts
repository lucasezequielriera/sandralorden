import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const body = await request.json();
  const updateData: Record<string, unknown> = {};

  if (body.status) updateData.status = body.status;
  if (body.status === "paid") updateData.paid_date = new Date().toISOString().split("T")[0];
  if (body.amount !== undefined) updateData.amount = body.amount;
  if (body.concept) updateData.concept = body.concept;
  if (body.due_date) updateData.due_date = body.due_date;

  const { data, error } = await supabase
    .from("invoices")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Factura actualizada", `${data.concept} → ${data.status}`, data.client_id);
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const { data: inv } = await supabase.from("invoices").select("client_id, concept").eq("id", id).single();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Factura eliminada", inv?.concept ?? `ID: ${id}`, inv?.client_id);
  return NextResponse.json({ success: true });
}
