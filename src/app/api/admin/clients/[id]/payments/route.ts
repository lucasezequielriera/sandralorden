import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { month, year, action } = await request.json();
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

  if (action === "toggle") {
    if (existing) {
      const newStatus = existing.status === "paid" ? "pending" : "paid";
      const updateData: Record<string, unknown> = { status: newStatus };
      if (newStatus === "paid") updateData.paid_date = new Date().toISOString().split("T")[0];
      await supabase.from("invoices").update(updateData).eq("id", existing.id);
      await logActivity(
        `Pago ${newStatus === "paid" ? "marcado" : "desmarcado"}`,
        `${client?.name ?? "Cliente"} — ${MONTH_NAMES[month]} ${year}`
      );
      return NextResponse.json({ status: newStatus, invoice_id: existing.id });
    } else {
      const { data: newInv } = await supabase
        .from("invoices")
        .insert({
          client_id: id,
          amount: 0,
          concept: `Pago ${MONTH_NAMES[month]} ${year}`,
          status: "paid",
          due_date: monthStart,
          paid_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();
      await logActivity("Pago marcado", `${client?.name ?? "Cliente"} — ${MONTH_NAMES[month]} ${year}`);
      return NextResponse.json({ status: "paid", invoice_id: newInv?.id });
    }
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
