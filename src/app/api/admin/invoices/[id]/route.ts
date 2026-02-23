import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;

  const body = await request.json();

  const ALLOWED_FIELDS = ["status", "amount", "concept", "due_date"];
  const VALID_STATUSES = ["pending", "paid", "cancelled"];
  const updateData: Record<string, unknown> = {};

  for (const key of ALLOWED_FIELDS) {
    if (key in body) updateData[key] = body[key];
  }

  if (updateData.status && !VALID_STATUSES.includes(updateData.status as string)) {
    return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
  }

  if (updateData.status === "paid") {
    updateData.paid_date = new Date().toISOString().split("T")[0];
  }

  if (updateData.amount !== undefined) {
    const amt = Number(updateData.amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return NextResponse.json({ error: "El importe debe ser mayor que 0" }, { status: 400 });
    }
    updateData.amount = amt;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No se proporcionaron campos válidos" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Invoice PATCH error:", error.message);
    return NextResponse.json({ error: "Error al actualizar la factura" }, { status: 500 });
  }
  await logActivity("Factura actualizada", `${data.concept} → ${data.status}`, data.client_id);
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;

  const { data: inv } = await supabase.from("invoices").select("client_id, concept").eq("id", id).single();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) {
    console.error("Invoice DELETE error:", error.message);
    return NextResponse.json({ error: "Error al eliminar la factura" }, { status: 500 });
  }
  await logActivity("Factura eliminada", inv?.concept ?? `ID: ${id}`, inv?.client_id);
  return NextResponse.json({ success: true });
}
