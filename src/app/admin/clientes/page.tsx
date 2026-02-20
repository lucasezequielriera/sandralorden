import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import ClientsListContent from "@/components/admin/ClientsListContent";

export default async function ClientesPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  const year = new Date().getFullYear();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("client_id, status, created_at")
    .gte("created_at", `${year}-01-01T00:00:00`)
    .lte("created_at", `${year}-12-31T23:59:59`);

  const paymentMap: Record<string, Record<number, string>> = {};
  for (const inv of invoices ?? []) {
    const month = new Date(inv.created_at).getMonth();
    if (!paymentMap[inv.client_id]) paymentMap[inv.client_id] = {};
    paymentMap[inv.client_id][month] = inv.status;
  }

  return (
    <AdminShell>
      <ClientsListContent clients={clients ?? []} paymentMap={paymentMap} />
    </AdminShell>
  );
}
