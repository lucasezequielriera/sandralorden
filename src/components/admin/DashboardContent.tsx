"use client";

import Link from "next/link";

interface Stats {
  totalClients: number;
  activeClients: number;
  leads: number;
  pendingInvoices: number;
  newClientsThisMonth: number;
  monthlyRevenue: number;
  conversionRate: number;
}

interface RecentClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  service_type: string;
  created_at: string;
}

interface RecentInvoice {
  id: string;
  amount: number;
  concept: string;
  status: string;
  due_date: string;
  clients: { name: string }[] | { name: string } | null;
}

interface LogEntry {
  id: string;
  action: string;
  details: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  lead: "bg-amber-100 text-amber-700",
  inactive: "bg-warm-gray-100 text-warm-gray-500",
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  lead: "Lead",
  inactive: "Inactivo",
  pending: "Pendiente",
  paid: "Pagado",
  cancelled: "Cancelado",
};

const currentMonth = new Date().toLocaleString("es-ES", { month: "long" });

export default function DashboardContent({
  stats,
  recentClients,
  recentInvoices,
  recentLogs,
}: {
  stats: Stats;
  recentClients: RecentClient[];
  recentInvoices: RecentInvoice[];
  recentLogs: LogEntry[];
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">
          Dashboard
        </h2>
        <p className="text-sm text-warm-gray-400 mt-1">Resumen de tu negocio</p>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Clientes totales" value={stats.totalClients} color="rosa" />
        <StatCard label="Clientes activos" value={stats.activeClients} color="green" />
        <StatCard label="Leads nuevos" value={stats.leads} color="amber" />
        <StatCard label="Pagos pendientes" value={stats.pendingInvoices} color="red" />
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-warm-gray-100">
          <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider">Nuevos en {currentMonth}</p>
          <p className="text-2xl font-light text-warm-dark mt-2">{stats.newClientsThisMonth}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-warm-gray-100">
          <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider">Ingresos {currentMonth}</p>
          <p className="text-2xl font-light text-green-600 mt-2">{stats.monthlyRevenue.toFixed(0)}€</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-warm-gray-100">
          <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider">Conversión lead→activo</p>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-2xl font-light text-rosa-500">{stats.conversionRate}%</p>
            <div className="flex-1 h-2 bg-warm-gray-100 rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-rosa-400 rounded-full transition-all" style={{ width: `${stats.conversionRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Clients */}
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-warm-dark">Últimos clientes</h3>
            <Link href="/admin/clientes" className="text-xs text-rosa-400 hover:text-rosa-500 transition-colors">
              Ver todos
            </Link>
          </div>
          {recentClients.length === 0 ? (
            <p className="text-sm text-warm-gray-300 text-center py-8">Sin clientes aún</p>
          ) : (
            <div className="space-y-3">
              {recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clientes/${client.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-warm-gray-100/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-warm-dark truncate">{client.name}</p>
                    <p className="text-xs text-warm-gray-300 truncate">{client.service_type || "Sin servicio"}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ml-3 ${statusColors[client.status] ?? "bg-warm-gray-100 text-warm-gray-500"}`}>
                    {statusLabels[client.status] ?? client.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-warm-dark">Últimas facturas</h3>
            <Link href="/admin/contabilidad" className="text-xs text-rosa-400 hover:text-rosa-500 transition-colors">
              Ver todas
            </Link>
          </div>
          {recentInvoices.length === 0 ? (
            <p className="text-sm text-warm-gray-300 text-center py-8">Sin facturas aún</p>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-warm-gray-100/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-warm-dark truncate">{inv.concept}</p>
                    <p className="text-xs text-warm-gray-300 truncate">
                      {Array.isArray(inv.clients) ? inv.clients[0]?.name ?? "—" : inv.clients?.name ?? "—"} · {inv.due_date ? new Date(inv.due_date).toLocaleDateString("es-ES") : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-sm font-medium text-warm-dark">{inv.amount}€</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[inv.status] ?? "bg-warm-gray-100 text-warm-gray-500"}`}>
                      {statusLabels[inv.status] ?? inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-2xl border border-warm-gray-100 p-6">
        <h3 className="font-medium text-warm-dark mb-4">Actividad reciente</h3>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-warm-gray-300 text-center py-6">Sin actividad registrada</p>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-warm-gray-100/20 transition-colors">
                <div className="w-2 h-2 rounded-full bg-rosa-300 mt-1.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-warm-dark">{log.action}</p>
                  {log.details && <p className="text-xs text-warm-gray-300 truncate">{log.details}</p>}
                </div>
                <p className="text-[10px] text-warm-gray-300 flex-shrink-0">
                  {new Date(log.created_at).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const bgMap: Record<string, string> = {
    rosa: "from-rosa-50 to-rosa-100/50",
    green: "from-green-50 to-green-100/50",
    amber: "from-amber-50 to-amber-100/50",
    red: "from-red-50 to-red-100/50",
  };
  const textMap: Record<string, string> = {
    rosa: "text-rosa-500",
    green: "text-green-600",
    amber: "text-amber-600",
    red: "text-red-500",
  };

  return (
    <div className={`bg-gradient-to-br ${bgMap[color]} rounded-2xl p-5 border border-warm-gray-100/50`}>
      <p className="text-xs text-warm-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-light mt-2 ${textMap[color]}`}>{value}</p>
    </div>
  );
}
