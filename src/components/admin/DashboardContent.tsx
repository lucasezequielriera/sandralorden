"use client";

import { useState } from "react";
import Link from "next/link";

interface Stats {
  totalClients: number;
  activeClients: number;
  pendingInvoices: number;
  presencialClients: number;
  virtualClients: number;
  yearTotalRevenue: number;
  yearTotalPending: number;
  thisMonthClients: number;
  thisMonthRevenue: number;
  thisMonthPending: number;
  pctClients: number | null;
  pctRevenue: number | null;
  pctPending: number | null;
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
  const currentMonthName = MONTH_NAMES[currentMonth];
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* 1. Clientes totales */}
        <div className="bg-white rounded-2xl p-6 border border-warm-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-rosa-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-rosa-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-warm-gray-400 uppercase tracking-wider mt-4">Clientes totales</p>
          <p className="text-4xl font-light text-warm-dark mt-1">{stats.totalClients}</p>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-warm-gray-100/60">
            <span className="flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              {stats.presencialClients} presencial
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-purple-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              {stats.virtualClients} virtual
            </span>
          </div>
        </div>

        {/* 2. Clientes activos */}
        <div className="bg-white rounded-2xl p-6 border border-warm-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-warm-gray-400 uppercase tracking-wider mt-4">Clientes activos</p>
          <p className="text-4xl font-light text-warm-dark mt-1">{stats.activeClients}</p>
          <div className="mt-3 pt-3 border-t border-warm-gray-100/60">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-warm-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${stats.totalClients > 0 ? (stats.activeClients / stats.totalClients) * 100 : 0}%` }} />
              </div>
              <span className="text-[11px] text-green-600 font-medium">{stats.totalClients > 0 ? Math.round((stats.activeClients / stats.totalClients) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* 3. Nuevos este mes */}
        <div className="bg-white rounded-2xl p-6 border border-warm-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
            <DeltaBadge pct={stats.pctClients} />
          </div>
          <p className="text-[11px] text-warm-gray-400 uppercase tracking-wider mt-4">Nuevos en {currentMonthName}</p>
          <p className="text-4xl font-light text-warm-dark mt-1">{stats.thisMonthClients}</p>
          <p className="text-[10px] text-warm-gray-300 mt-3 pt-3 border-t border-warm-gray-100/60">vs mes anterior</p>
        </div>

        {/* 4. Ingresos este mes */}
        <div className="bg-white rounded-2xl p-6 border border-warm-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
            </div>
            <DeltaBadge pct={stats.pctRevenue} />
          </div>
          <p className="text-[11px] text-warm-gray-400 uppercase tracking-wider mt-4">Ingresos {currentMonthName}</p>
          <p className="text-4xl font-light text-green-600 mt-1">{stats.thisMonthRevenue.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-3 pt-3 border-t border-warm-gray-100/60">vs mes anterior</p>
        </div>

        {/* 5. Pendiente este mes */}
        <div className="bg-white rounded-2xl p-6 border border-warm-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <DeltaBadge pct={stats.pctPending} invert />
          </div>
          <p className="text-[11px] text-warm-gray-400 uppercase tracking-wider mt-4">Pendiente {currentMonthName}</p>
          <p className="text-4xl font-light text-amber-600 mt-1">{stats.thisMonthPending.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-3 pt-3 border-t border-warm-gray-100/60">vs mes anterior</p>
        </div>

        {/* 6. Pagos pendientes (count) */}
        <div className="bg-white rounded-2xl p-6 border border-warm-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-warm-gray-400 uppercase tracking-wider mt-4">Facturas sin cobrar</p>
          <p className="text-4xl font-light text-red-500 mt-1">{stats.pendingInvoices}</p>
          <div className="mt-3 pt-3 border-t border-warm-gray-100/60">
            <p className="text-[11px] text-warm-gray-300">del año {year}</p>
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

function DeltaBadge({ pct, invert }: { pct: number | null; invert?: boolean }) {
  if (pct === null) return null;
  const isUp = pct > 0;
  const isDown = pct < 0;
  const positive = invert ? isDown : isUp;
  const negative = invert ? isUp : isDown;

  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
      positive ? "bg-green-50 text-green-600" : negative ? "bg-red-50 text-red-500" : "bg-warm-gray-100 text-warm-gray-400"
    }`}>
      {isUp ? "↑" : isDown ? "↓" : "="} {Math.abs(pct)}%
    </span>
  );
}
