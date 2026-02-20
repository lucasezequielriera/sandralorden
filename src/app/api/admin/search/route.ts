import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  const pattern = `%${q}%`;

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, email, service_type")
    .or(`name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern}`)
    .limit(5);

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, concept, amount, status, client_id")
    .ilike("concept", pattern)
    .limit(5);

  const results = [
    ...(clients ?? []).map((c) => ({
      type: "client" as const,
      id: c.id,
      title: c.name,
      subtitle: `${c.email} · ${c.service_type || "Sin servicio"}`,
      href: `/admin/clientes/${c.id}`,
    })),
    ...(invoices ?? []).map((i) => ({
      type: "invoice" as const,
      id: i.id,
      title: i.concept,
      subtitle: `${i.amount}€ · ${i.status}`,
      href: "/admin/contabilidad",
    })),
  ];

  return NextResponse.json(results);
}
