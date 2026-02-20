"use client";

import { useState } from "react";
import Link from "next/link";

interface Stats {
  totalClients: number;
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
  active: "bg-[#A8D5BA]/30 text-[#3D6B4F]",
  lead: "bg-[#E8D5F0]/50 text-[#6B3A7E]",
  inactive: "bg-warm-gray-100 text-warm-gray-400",
  pending: "bg-[#F2B8B5]/30 text-[#8C4A47]",
  paid: "bg-[#A8D5BA]/30 text-[#3D6B4F]",
  cancelled: "bg-warm-gray-200 text-warm-gray-500",
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
        {/* Clientes totales */}
        <div className="relative overflow-hidden bg-crema rounded-3xl p-5 group hover:shadow-[0_4px_24px_rgba(192,113,112,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-rosa-100/40 -translate-y-8 translate-x-8" />
          <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Clientes</p>
          <p className="text-3xl font-[family-name:var(--font-display)] italic text-warm-dark mt-1.5 leading-none">{stats.totalClients}</p>
          <div className="flex items-center gap-2.5 mt-3">
            <span className="flex items-center gap-1 text-[10px] text-marron-400">
              <span className="w-1.5 h-1.5 rounded-full bg-marron-400" />
              {stats.presencialClients} presencial
            </span>
            <span className="flex items-center gap-1 text-[10px] text-rosa-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rosa-400" />
              {stats.virtualClients} virtual
            </span>
          </div>
        </div>

        {/* Nuevos este mes */}
        <div className="relative overflow-hidden bg-crema rounded-3xl p-5 group hover:shadow-[0_4px_24px_rgba(192,113,112,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-rosa-200/30 -translate-y-8 translate-x-8" />
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Nuevos · {currentMonthName.substring(0, 3)}</p>
            <DeltaBadge pct={stats.pctClients} />
          </div>
          <p className="text-3xl font-[family-name:var(--font-display)] italic text-warm-dark mt-1.5 leading-none">{stats.thisMonthClients}</p>
          <p className="text-[10px] text-warm-gray-300 mt-3">vs mes anterior</p>
        </div>

        {/* Ingresos este mes */}
        <div className="relative overflow-hidden bg-crema rounded-3xl p-5 group hover:shadow-[0_4px_24px_rgba(192,113,112,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#A8D5BA]/30 -translate-y-8 translate-x-8" />
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Ingresos · {currentMonthName.substring(0, 3)}</p>
            <DeltaBadge pct={stats.pctRevenue} />
          </div>
          <p className="text-3xl font-[family-name:var(--font-display)] italic text-[#3D6B4F] mt-1.5 leading-none">{stats.thisMonthRevenue.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-3">vs mes anterior</p>
        </div>

        {/* Pendiente este mes */}
        <div className="relative overflow-hidden bg-crema rounded-3xl p-5 group hover:shadow-[0_4px_24px_rgba(192,113,112,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#F2B8B5]/30 -translate-y-8 translate-x-8" />
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Pendiente · {currentMonthName.substring(0, 3)}</p>
            <DeltaBadge pct={stats.pctPending} invert />
          </div>
          <p className="text-3xl font-[family-name:var(--font-display)] italic text-[#8C4A47] mt-1.5 leading-none">{stats.thisMonthPending.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-3">vs mes anterior</p>
        </div>

        {/* Ingresos anuales */}
        <div className="col-span-2 lg:col-span-1 relative overflow-hidden bg-crema rounded-3xl p-5 group hover:shadow-[0_4px_24px_rgba(192,113,112,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#A8D5BA]/30 -translate-y-8 translate-x-8" />
          <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Total {year}</p>
          <p className="text-3xl font-[family-name:var(--font-display)] italic text-[#3D6B4F] mt-1.5 leading-none">{stats.yearTotalRevenue.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-3">ingresos cobrados</p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-crema rounded-3xl p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-[family-name:var(--font-display)] italic text-xl text-warm-dark">Resumen {year}</h3>
            <p className="text-[10px] text-warm-gray-300 mt-0.5 uppercase tracking-[0.12em]">Ingresos mensuales</p>
          </div>
          {selectedMonth !== null && (
            <button
              onClick={() => setSelectedMonth(null)}
              className="text-[10px] text-rosa-400 hover:text-rosa-500 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Ver todos
            </button>
          )}
        </div>

        {/* Bar chart */}
        <div className="flex gap-1 sm:gap-1.5 mb-2">
          {monthlyData.map((m, i) => {
            const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
            const barH = Math.max(pct, 6);
            const isCurrentMonth = i === currentMonth;
            const isSelected = selectedMonth === i;
            const hasData = m.revenue > 0 || m.newClients > 0 || m.invoiceCount > 0;

            return (
              <button
                key={i}
                onClick={() => setSelectedMonth(isSelected ? null : i)}
                className="flex-1 flex flex-col items-center cursor-pointer group"
                title={`${MONTH_NAMES[i]}: ${m.revenue.toFixed(0)}€`}
              >
                <div className="w-full flex flex-col items-center justify-end" style={{ height: 110 }}>
                  {m.revenue > 0 && (
                    <span className="text-[8px] text-warm-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity tabular-nums whitespace-nowrap mb-1">
                      {m.revenue.toFixed(0)}€
                    </span>
                  )}
                  <div
                    className={`w-5 sm:w-6 rounded-full transition-all duration-300 ${
                      isSelected
                        ? "bg-[#3D6B4F]"
                        : isCurrentMonth
                          ? "bg-[#A8D5BA]"
                          : hasData
                            ? "bg-[#A8D5BA]/40 group-hover:bg-[#A8D5BA]"
                            : "bg-warm-gray-200/40"
                    }`}
                    style={{ height: `${barH}%` }}
                  />
                </div>
                <span className={`text-[9px] mt-1.5 ${
                  isSelected ? "text-[#3D6B4F] font-medium" : isCurrentMonth ? "text-warm-dark font-medium" : "text-warm-gray-300"
                }`}>
                  {MONTH_NAMES[i].charAt(0)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected month detail */}
        {selected && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-warm-gray-200/40">
            <div className="bg-warm-white rounded-2xl p-3.5">
              <p className="text-[9px] text-warm-gray-300 uppercase tracking-[0.1em]">Clientes</p>
              <p className="text-lg font-[family-name:var(--font-display)] italic text-warm-dark mt-0.5">{selected.newClients}</p>
            </div>
            <div className="bg-[#A8D5BA]/15 rounded-2xl p-3.5">
              <p className="text-[9px] text-warm-gray-300 uppercase tracking-[0.1em]">Cobrado</p>
              <p className="text-lg font-[family-name:var(--font-display)] italic text-[#3D6B4F] mt-0.5">{selected.revenue.toFixed(0)}€</p>
            </div>
            <div className="bg-[#F2B8B5]/15 rounded-2xl p-3.5">
              <p className="text-[9px] text-warm-gray-300 uppercase tracking-[0.1em]">Pendiente</p>
              <p className="text-lg font-[family-name:var(--font-display)] italic text-[#8C4A47] mt-0.5">{selected.pending.toFixed(0)}€</p>
            </div>
            <div className="bg-warm-white rounded-2xl p-3.5">
              <p className="text-[9px] text-warm-gray-300 uppercase tracking-[0.1em]">Facturas</p>
              <p className="text-lg font-[family-name:var(--font-display)] italic text-warm-dark mt-0.5">{selected.invoiceCount}</p>
            </div>
          </div>
        )}

        {/* Monthly table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Mes</th>
                <th className="text-right py-2 px-3 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Clientes</th>
                <th className="text-right py-2 px-3 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Cobrado</th>
                <th className="text-right py-2 px-3 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Pendiente</th>
                <th className="text-right py-2 px-3 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Facturas</th>
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
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-warm-white rounded-xl"
                        : isCurrentMonth
                          ? "bg-warm-white/50"
                          : "hover:bg-warm-white/40"
                    }`}
                  >
                    <td className={`py-2.5 px-3 text-sm rounded-l-xl ${isCurrentMonth ? "font-medium text-warm-dark" : "text-warm-gray-400"}`}>
                      {MONTH_NAMES[i]}
                      {isCurrentMonth && <span className="text-[8px] ml-1 text-rosa-300 uppercase">actual</span>}
                    </td>
                    <td className="py-2.5 px-3 text-sm text-right text-warm-dark tabular-nums">{m.newClients}</td>
                    <td className="py-2.5 px-3 text-sm text-right text-[#3D6B4F] font-medium tabular-nums">{m.revenue > 0 ? `${m.revenue.toFixed(0)}€` : "—"}</td>
                    <td className="py-2.5 px-3 text-sm text-right text-[#8C4A47] tabular-nums">{m.pending > 0 ? `${m.pending.toFixed(0)}€` : "—"}</td>
                    <td className="py-2.5 px-3 text-sm text-right text-warm-gray-300 rounded-r-xl tabular-nums">{m.invoiceCount || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-warm-gray-200/40">
                <td className="py-3 px-3 text-sm font-medium text-warm-dark">Total {year}</td>
                <td className="py-3 px-3 text-sm text-right font-medium text-warm-dark tabular-nums">{monthlyData.reduce((s, m) => s + m.newClients, 0)}</td>
                <td className="py-3 px-3 text-sm text-right font-medium text-[#3D6B4F] tabular-nums">{stats.yearTotalRevenue > 0 ? `${stats.yearTotalRevenue.toFixed(0)}€` : "—"}</td>
                <td className="py-3 px-3 text-sm text-right font-medium text-[#8C4A47] tabular-nums">{stats.yearTotalPending > 0 ? `${stats.yearTotalPending.toFixed(0)}€` : "—"}</td>
                <td className="py-3 px-3 text-sm text-right font-medium text-warm-gray-400 tabular-nums">{monthlyData.reduce((s, m) => s + m.invoiceCount, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Recent Clients + Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Recent Clients */}
        <div className="bg-crema rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-[family-name:var(--font-display)] italic text-lg text-warm-dark">Últimos clientes</h3>
            <Link href="/admin/clientes" className="text-[10px] text-rosa-400 hover:text-rosa-500 transition-colors uppercase tracking-wider">
              Ver todos
            </Link>
          </div>
          {recentClients.length === 0 ? (
            <p className="text-sm text-warm-gray-300 text-center py-10">Sin clientes aún</p>
          ) : (
            <div className="space-y-1">
              {recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clientes/${client.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-warm-white transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-rosa-100/60 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-rosa-400">{client.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-warm-dark truncate group-hover:text-rosa-500 transition-colors">{client.name}</p>
                      <p className="text-[11px] text-warm-gray-300 truncate">{client.service_type || "Sin servicio"}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ml-3 ${statusColors[client.status] ?? "bg-warm-gray-100 text-warm-gray-400"}`}>
                    {statusLabels[client.status] ?? client.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-crema rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-[family-name:var(--font-display)] italic text-lg text-warm-dark">Últimas facturas</h3>
            <Link href="/admin/contabilidad" className="text-[10px] text-rosa-400 hover:text-rosa-500 transition-colors uppercase tracking-wider">
              Ver todas
            </Link>
          </div>
          {recentInvoices.length === 0 ? (
            <p className="text-sm text-warm-gray-300 text-center py-10">Sin facturas aún</p>
          ) : (
            <div className="space-y-1">
              {recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-warm-white transition-all duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-warm-dark truncate">{inv.concept}</p>
                    <p className="text-[11px] text-warm-gray-300 truncate">
                      {Array.isArray(inv.clients) ? inv.clients[0]?.name ?? "—" : inv.clients?.name ?? "—"} · {inv.due_date ? new Date(inv.due_date + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-sm font-[family-name:var(--font-display)] italic text-warm-dark">{inv.amount}€</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${statusColors[inv.status] ?? "bg-warm-gray-100 text-warm-gray-400"}`}>
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
      <div className="bg-crema rounded-3xl p-6">
        <h3 className="font-[family-name:var(--font-display)] italic text-lg text-warm-dark mb-5">Actividad reciente</h3>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-warm-gray-300 text-center py-8">Sin actividad registrada</p>
        ) : (
          <div className="space-y-0.5">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-warm-white transition-all duration-200">
                <div className="w-1.5 h-1.5 rounded-full bg-rosa-300 mt-2 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-warm-dark">{log.action}</p>
                  {log.details && <p className="text-[11px] text-warm-gray-300 truncate mt-0.5">{log.details}</p>}
                </div>
                <p className="text-[10px] text-warm-gray-300 flex-shrink-0 tabular-nums">
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
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${
      positive ? "bg-[#A8D5BA] text-[#3D6B4F]" : negative ? "bg-[#F2B8B5] text-[#8C4A47]" : "bg-warm-gray-100 text-warm-gray-400"
    }`}>
      {isUp ? "+" : isDown ? "" : ""}{pct}%
    </span>
  );
}
