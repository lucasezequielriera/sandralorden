import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const year = new Date().getFullYear();
  const { data } = await supabase
    .from("invoices")
    .select("id, amount, status, concept, due_date, paid_date, created_at")
    .eq("client_id", id)
    .gte("due_date", `${year}-01-01`)
    .lte("due_date", `${year}-12-31`)
    .order("due_date");

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const { month, year, action, amount: bodyAmount } = await request.json();
  const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const monthEnd = month === 11
    ? `${year + 1}-01-01`
    : `${year}-${String(month + 2).padStart(2, "0")}-01`;

  const { data: existingList } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("client_id", id)
    .gte("due_date", monthStart)
    .lt("due_date", monthEnd)
    .order("created_at", { ascending: false })
    .limit(1);

  const existing = existingList?.[0] ?? null;

  const { data: client } = await supabase
    .from("clients")
    .select("name")
    .eq("id", id)
    .single();

  // sin factura → pendiente (con monto, desde modal)
  if (action === "create") {
    if (existing) {
      await supabase.from("invoices").update({
        status: "pending",
        amount: bodyAmount ?? 0,
      }).eq("id", existing.id);
      await logActivity("Factura creada (pendiente)", `${client?.name ?? "Cliente"} — ${MONTH_NAMES[month]} ${year} (${bodyAmount ?? 0}€)`, id);
      return NextResponse.json({ status: "pending", invoice_id: existing.id });
    }

    const { data: newInv } = await supabase
      .from("invoices")
      .insert({
        client_id: id,
        amount: bodyAmount ?? 0,
        concept: `Pago ${MONTH_NAMES[month]} ${year}`,
        status: "pending",
        due_date: monthStart,
      })
      .select()
      .single();
    await logActivity("Factura creada (pendiente)", `${client?.name ?? "Cliente"} — ${MONTH_NAMES[month]} ${year} (${bodyAmount ?? 0}€)`, id);
    return NextResponse.json({ status: "pending", invoice_id: newInv?.id });
  }

  // pendiente → pagado, pagado → eliminar
  if (action === "toggle") {
    if (existing) {
      if (existing.status === "pending") {
        await supabase.from("invoices").update({
          status: "paid",
          paid_date: new Date().toISOString().split("T")[0],
        }).eq("id", existing.id);
        await logActivity("Pago confirmado", `${client?.name ?? "Cliente"} — ${MONTH_NAMES[month]} ${year}`, id);
        return NextResponse.json({ status: "paid", invoice_id: existing.id });
      } else if (existing.status === "paid") {
        await supabase.from("invoices").delete().eq("id", existing.id);
        await logActivity("Pago eliminado", `${client?.name ?? "Cliente"} — ${MONTH_NAMES[month]} ${year}`, id);
        return NextResponse.json({ status: "none", invoice_id: null });
      }
    }
    return NextResponse.json({ status: "none" });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
