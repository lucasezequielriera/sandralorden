import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import DashboardContent from "@/components/admin/DashboardContent";

export default async function AdminPage() {
  const supabase = await createClient();

  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  const { count: activeClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: leads } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "lead");

  const { count: pendingInvoices } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { data: recentClients } = await supabase
    .from("clients")
    .select("id, name, email, phone, status, service_type, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentInvoices } = await supabase
    .from("invoices")
    .select("id, amount, concept, status, due_date, clients(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <AdminShell>
      <DashboardContent
        stats={{
          totalClients: totalClients ?? 0,
          activeClients: activeClients ?? 0,
          leads: leads ?? 0,
          pendingInvoices: pendingInvoices ?? 0,
        }}
        recentClients={recentClients ?? []}
        recentInvoices={recentInvoices ?? []}
      />
    </AdminShell>
  );
}
