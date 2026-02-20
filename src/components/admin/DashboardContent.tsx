"use client";

import Link from "next/link";

interface Stats {
  totalClients: number;
  activeClients: number;
  leads: number;
  pendingInvoices: number;
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

export default function DashboardContent({
  stats,
  recentClients,
  recentInvoices,
}: {
  stats: Stats;
  recentClients: RecentClient[];
  recentInvoices: RecentInvoice[];
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">
          Dashboard
        </h2>
        <p className="text-sm text-warm-gray-400 mt-1">Resumen de tu negocio</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Clientes totales" value={stats.totalClients} color="rosa" />
        <StatCard label="Clientes activos" value={stats.activeClients} color="green" />
        <StatCard label="Leads nuevos" value={stats.leads} color="amber" />
        <StatCard label="Pagos pendientes" value={stats.pendingInvoices} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      {Array.isArray(inv.clients) ? inv.clients[0]?.name ?? "—" : inv.clients?.name ?? "—"} · {new Date(inv.due_date).toLocaleDateString("es-ES")}
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
