"use client";

import { useState } from "react";
import Link from "next/link";

interface Stats {
  totalClients: number;
  activeClients: number;
  leads: number;
  pendingInvoices: number;
  presencialClients: number;
  virtualClients: number;
  conversionRate: number;
  yearTotalRevenue: number;
  yearTotalPending: number;
}

interface MonthData {
  month: number;
  newClients: number;
  revenue: number;
  pending: number;
  invoiceCount: number;
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

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function DashboardContent({
  stats,
  monthlyData,
  year,
  recentClients,
  recentInvoices,
  recentLogs,
}: {
  stats: Stats;
  monthlyData: MonthData[];
  year: number;
  recentClients: RecentClient[];
  recentInvoices: RecentInvoice[];
  recentLogs: LogEntry[];
}) {
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const selected = selectedMonth !== null ? monthlyData[selectedMonth] : null;

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">
          Dashboard
        </h2>
        <p className="text-sm text-warm-gray-400 mt-1">Resumen de tu negocio</p>
      </div>

      {/* Totales generales */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <StatCard label="Clientes totales" value={stats.totalClients} color="rosa" />
        <StatCard label="Clientes activos" value={stats.activeClients} color="green" />
        <StatCard label="Leads nuevos" value={stats.leads} color="amber" />
      </div>

      {/* Modality + Pending */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-2xl p-5 border border-blue-100/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider">Presencial</p>
            <p className="text-2xl font-light text-blue-600">{stats.presencialClients}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-purple-100/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider">Virtual</p>
            <p className="text-2xl font-light text-purple-600">{stats.virtualClients}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-5 border border-warm-gray-100/50">
          <p className="text-xs text-warm-gray-400 uppercase tracking-wider">Pagos pendientes</p>
          <p className="text-3xl font-light mt-2 text-red-500">{stats.pendingInvoices}</p>
        </div>
      </div>

      {/* Year totals + Conversion */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-warm-gray-100">
          <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider">Total cobrado {year}</p>
          <p className="text-2xl font-light text-green-600 mt-2">{stats.yearTotalRevenue.toFixed(0)}€</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-warm-gray-100">
          <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider">Pendiente {year}</p>
          <p className="text-2xl font-light text-amber-600 mt-2">{stats.yearTotalPending.toFixed(0)}€</p>
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

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-2xl border border-warm-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium text-warm-dark">Ingresos por mes — {year}</h3>
          {selectedMonth !== null && (
            <button
              onClick={() => setSelectedMonth(null)}
              className="text-xs text-rosa-400 hover:text-rosa-500 transition-colors cursor-pointer"
            >
              Ver todos
            </button>
          )}
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5 sm:gap-2 h-36 mb-4">
          {monthlyData.map((m, i) => {
            const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
            const isCurrentMonth = i === currentMonth;
            const isSelected = selectedMonth === i;
            const hasData = m.revenue > 0 || m.newClients > 0 || m.invoiceCount > 0;

            return (
              <button
                key={i}
                onClick={() => setSelectedMonth(isSelected ? null : i)}
                className={`flex-1 flex flex-col items-center justify-end gap-1 cursor-pointer group transition-all rounded-lg py-1 ${
                  isSelected ? "bg-rosa-50" : "hover:bg-warm-gray-100/30"
                }`}
                title={`${MONTH_NAMES[i]}: ${m.revenue.toFixed(0)}€`}
              >
                {m.revenue > 0 && (
                  <span className="text-[9px] text-warm-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.revenue.toFixed(0)}€
                  </span>
                )}
                <div
                  className={`w-full rounded-t-md transition-all ${
                    isSelected
                      ? "bg-rosa-400"
                      : isCurrentMonth
                        ? "bg-rosa-300"
                        : hasData
                          ? "bg-rosa-200 group-hover:bg-rosa-300"
                          : "bg-warm-gray-100"
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <span className={`text-[9px] ${
                  isSelected ? "text-rosa-500 font-medium" : isCurrentMonth ? "text-warm-dark font-medium" : "text-warm-gray-300"
                }`}>
                  {MONTH_NAMES[i].substring(0, 3)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected month detail */}
        {selected && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-warm-gray-100">
            <div className="bg-warm-gray-100/30 rounded-xl p-3">
              <p className="text-[9px] text-warm-gray-400 uppercase tracking-wider">Clientes nuevos</p>
              <p className="text-xl font-light text-warm-dark mt-1">{selected.newClients}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-[9px] text-warm-gray-400 uppercase tracking-wider">Cobrado</p>
              <p className="text-xl font-light text-green-600 mt-1">{selected.revenue.toFixed(0)}€</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-[9px] text-warm-gray-400 uppercase tracking-wider">Pendiente</p>
              <p className="text-xl font-light text-amber-600 mt-1">{selected.pending.toFixed(0)}€</p>
            </div>
            <div className="bg-rosa-50 rounded-xl p-3">
              <p className="text-[9px] text-warm-gray-400 uppercase tracking-wider">Facturas</p>
              <p className="text-xl font-light text-rosa-500 mt-1">{selected.invoiceCount}</p>
            </div>
          </div>
        )}

        {/* Monthly table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-gray-100">
                <th className="text-left py-2 px-2 font-medium text-warm-gray-400 text-[10px] uppercase tracking-wider">Mes</th>
                <th className="text-right py-2 px-2 font-medium text-warm-gray-400 text-[10px] uppercase tracking-wider">Clientes</th>
                <th className="text-right py-2 px-2 font-medium text-warm-gray-400 text-[10px] uppercase tracking-wider">Cobrado</th>
                <th className="text-right py-2 px-2 font-medium text-warm-gray-400 text-[10px] uppercase tracking-wider">Pendiente</th>
                <th className="text-right py-2 px-2 font-medium text-warm-gray-400 text-[10px] uppercase tracking-wider">Facturas</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m, i) => {
                const isCurrentMonth = i === currentMonth;
                const isSelected = selectedMonth === i;
                const hasActivity = m.revenue > 0 || m.newClients > 0 || m.invoiceCount > 0;
                if (!hasActivity && i > currentMonth) return null;

                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedMonth(isSelected ? null : i)}
                    className={`border-b border-warm-gray-100/50 cursor-pointer transition-colors ${
                      isSelected ? "bg-rosa-50" : isCurrentMonth ? "bg-warm-gray-100/20" : "hover:bg-warm-gray-100/20"
                    }`}
                  >
                    <td className={`py-2.5 px-2 ${isCurrentMonth ? "font-medium text-warm-dark" : "text-warm-gray-400"}`}>
                      {MONTH_NAMES[i]}
                      {isCurrentMonth && <span className="text-[9px] ml-1 text-rosa-400">(actual)</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-warm-dark">{m.newClients}</td>
                    <td className="py-2.5 px-2 text-right text-green-600 font-medium">{m.revenue > 0 ? `${m.revenue.toFixed(0)}€` : "—"}</td>
                    <td className="py-2.5 px-2 text-right text-amber-600">{m.pending > 0 ? `${m.pending.toFixed(0)}€` : "—"}</td>
                    <td className="py-2.5 px-2 text-right text-warm-gray-400">{m.invoiceCount || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-warm-gray-200">
                <td className="py-2.5 px-2 font-medium text-warm-dark">Total {year}</td>
                <td className="py-2.5 px-2 text-right font-medium text-warm-dark">{monthlyData.reduce((s, m) => s + m.newClients, 0)}</td>
                <td className="py-2.5 px-2 text-right font-medium text-green-600">{stats.yearTotalRevenue > 0 ? `${stats.yearTotalRevenue.toFixed(0)}€` : "—"}</td>
                <td className="py-2.5 px-2 text-right font-medium text-amber-600">{stats.yearTotalPending > 0 ? `${stats.yearTotalPending.toFixed(0)}€` : "—"}</td>
                <td className="py-2.5 px-2 text-right font-medium text-warm-gray-400">{monthlyData.reduce((s, m) => s + m.invoiceCount, 0)}</td>
              </tr>
            </tfoot>
          </table>
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
