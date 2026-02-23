import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;

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
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;

  const { month, year, action, amount: bodyAmount } = await request.json();

  if (typeof month !== "number" || month < 0 || month > 11 || !Number.isInteger(month)) {
    return NextResponse.json({ error: "Mes no válido" }, { status: 400 });
  }
  if (typeof year !== "number" || year < 2020 || year > 2100 || !Number.isInteger(year)) {
    return NextResponse.json({ error: "Año no válido" }, { status: 400 });
  }

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

  if (action === "create") {
    const amt = Number(bodyAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return NextResponse.json({ error: "El importe debe ser mayor que 0" }, { status: 400 });
    }
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
        await supabase.from("invoices").update({
          status: "cancelled",
          paid_date: null,
        }).eq("id", existing.id);
        await logActivity("Pago cancelado", `${client?.name ?? "Cliente"} — ${MONTH_NAMES[month]} ${year}`, id);
        return NextResponse.json({ status: "cancelled", invoice_id: existing.id });
      }
    }
    return NextResponse.json({ status: "none" });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
