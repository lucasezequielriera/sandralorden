import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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
  await logActivity("Factura actualizada", `${data.concept} → ${data.status}`);
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Factura eliminada", `ID: ${id}`);
  return NextResponse.json({ success: true });
}
