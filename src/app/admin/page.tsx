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

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count: newClientsThisMonth } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .gte("created_at", monthStart);

  const { data: paidThisMonth } = await supabase
    .from("invoices")
    .select("amount")
    .eq("status", "paid")
    .gte("paid_date", monthStart.split("T")[0]);

  const monthlyRevenue = paidThisMonth?.reduce((s, i) => s + (i.amount || 0), 0) ?? 0;

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

  const { data: recentLogs } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const conversionRate = (totalClients ?? 0) > 0
    ? Math.round(((activeClients ?? 0) / (totalClients ?? 1)) * 100)
    : 0;

  return (
    <AdminShell>
      <DashboardContent
        stats={{
          totalClients: totalClients ?? 0,
          activeClients: activeClients ?? 0,
          leads: leads ?? 0,
          pendingInvoices: pendingInvoices ?? 0,
          newClientsThisMonth: newClientsThisMonth ?? 0,
          monthlyRevenue,
          conversionRate,
        }}
        recentClients={recentClients ?? []}
        recentInvoices={recentInvoices ?? []}
        recentLogs={recentLogs ?? []}
      />
    </AdminShell>
  );
}
