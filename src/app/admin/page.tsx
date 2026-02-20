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

  const conversionRate = (totalClients ?? 0) > 0
    ? Math.round(((activeClients ?? 0) / (totalClients ?? 1)) * 100)
    : 0;

  const now = new Date();
  const year = now.getFullYear();
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;

  const { data: allInvoicesYear } = await supabase
    .from("invoices")
    .select("amount, status, paid_date, created_at")
    .gte("created_at", `${yearStart}T00:00:00`)
    .lte("created_at", `${yearEnd}T23:59:59`);

  const { data: allClientsYear } = await supabase
    .from("clients")
    .select("created_at, status")
    .gte("created_at", `${yearStart}T00:00:00`)
    .lte("created_at", `${yearEnd}T23:59:59`);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthClients = (allClientsYear ?? []).filter((c) => new Date(c.created_at).getMonth() === i);
    const monthInvoices = (allInvoicesYear ?? []).filter((inv) => new Date(inv.created_at).getMonth() === i);
    const paidInvoices = monthInvoices.filter((inv) => inv.status === "paid");
    const pendingInv = monthInvoices.filter((inv) => inv.status === "pending");

    return {
      month: i,
      newClients: monthClients.length,
      revenue: paidInvoices.reduce((s, inv) => s + (inv.amount || 0), 0),
      pending: pendingInv.reduce((s, inv) => s + (inv.amount || 0), 0),
      invoiceCount: monthInvoices.length,
    };
  });

  const yearTotalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0);
  const yearTotalPending = monthlyData.reduce((s, m) => s + m.pending, 0);

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

  return (
    <AdminShell>
      <DashboardContent
        stats={{
          totalClients: totalClients ?? 0,
          activeClients: activeClients ?? 0,
          leads: leads ?? 0,
          pendingInvoices: pendingInvoices ?? 0,
          conversionRate,
          yearTotalRevenue,
          yearTotalPending,
        }}
        monthlyData={monthlyData}
        year={year}
        recentClients={recentClients ?? []}
        recentInvoices={recentInvoices ?? []}
        recentLogs={recentLogs ?? []}
      />
    </AdminShell>
  );
}
