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
    .select("client_id, status, due_date")
    .gte("due_date", `${year}-01-01`)
    .lte("due_date", `${year}-12-31`);

  const paymentMap: Record<string, Record<number, string>> = {};
  for (const inv of invoices ?? []) {
    if (!inv.due_date) continue;
    const month = new Date(inv.due_date + "T00:00:00").getMonth();
    if (!paymentMap[inv.client_id]) paymentMap[inv.client_id] = {};
    paymentMap[inv.client_id][month] = inv.status;
  }

  return (
    <AdminShell>
      <ClientsListContent clients={clients ?? []} paymentMap={paymentMap} />
    </AdminShell>
  );
}
