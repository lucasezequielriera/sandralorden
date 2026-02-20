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

  const now = new Date();
  const year = now.getFullYear();
  const currentMonth = now.getMonth();
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;

  const { count: presencialClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("modality", "presencial");

  const { count: virtualClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("modality", "virtual");

  const { data: allInvoicesYear } = await supabase
    .from("invoices")
    .select("amount, status, paid_date, due_date, created_at")
    .gte("due_date", yearStart)
    .lte("due_date", yearEnd);

  const { data: allClientsYear } = await supabase
    .from("clients")
    .select("created_at, status")
    .gte("created_at", `${yearStart}T00:00:00`)
    .lte("created_at", `${yearEnd}T23:59:59`);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthClients = (allClientsYear ?? []).filter((c) => new Date(c.created_at).getMonth() === i);
    const monthInvoices = (allInvoicesYear ?? []).filter((inv) => {
      if (!inv.due_date) return new Date(inv.created_at).getMonth() === i;
      return new Date(inv.due_date + "T00:00:00").getMonth() === i;
    });
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

  const cur = monthlyData[currentMonth];
  const prev = currentMonth > 0 ? monthlyData[currentMonth - 1] : null;

  function pctChange(current: number, previous: number | null | undefined): number | null {
    if (previous == null || previous === 0) return current > 0 ? 100 : null;
    return Math.round(((current - previous) / previous) * 100);
  }

  const thisMonthClients = cur.newClients;
  const prevMonthClients = prev?.newClients ?? 0;
  const thisMonthRevenue = cur.revenue;
  const prevMonthRevenue = prev?.revenue ?? 0;
  const thisMonthPending = cur.pending;
  const prevMonthPending = prev?.pending ?? 0;

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
          presencialClients: presencialClients ?? 0,
          virtualClients: virtualClients ?? 0,
          yearTotalRevenue,
          yearTotalPending,
          thisMonthClients,
          thisMonthRevenue,
          thisMonthPending,
          pctClients: pctChange(thisMonthClients, prevMonthClients),
          pctRevenue: pctChange(thisMonthRevenue, prevMonthRevenue),
          pctPending: pctChange(thisMonthPending, prevMonthPending),
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
