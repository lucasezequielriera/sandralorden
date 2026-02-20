"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface InvoiceRow {
  id: string;
  amount: number;
  concept: string;
  status: string;
  due_date: string | null;
  paid_date: string | null;
  created_at: string;
  clients: { name: string; email: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-[#F2B8B5]/30 text-[#8C4A47]",
  paid: "bg-[#A8D5BA]/30 text-[#3D6B4F]",
  cancelled: "bg-warm-gray-200 text-warm-gray-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  cancelled: "Cancelado",
};

const nextStatus: Record<string, string> = {
  pending: "paid",
  paid: "cancelled",
  cancelled: "pending",
};

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function ContabilidadContent({
  invoices: initialInvoices,
  clients,
}: {
  invoices: InvoiceRow[];
  clients: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showNew, setShowNew] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [newInvoice, setNewInvoice] = useState({ client_id: "", amount: "", concept: "", due_date: "" });
  const [saving, setSaving] = useState(false);

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const filtered = invoices.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (monthFilter !== "all") {
      const d = i.due_date ? new Date(i.due_date + "T00:00:00") : new Date(i.created_at);
      if (d.getMonth() !== Number(monthFilter)) return false;
    }
    return true;
  });

  const totalPaid = filtered.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = filtered.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);

  const yearPaid = invoices.filter((i) => {
    if (i.status !== "paid") return false;
    const d = i.due_date ? new Date(i.due_date + "T00:00:00") : new Date(i.created_at);
    return d.getFullYear() === thisYear;
  }).reduce((s, i) => s + i.amount, 0);

  const yearPending = invoices.filter((i) => {
    if (i.status !== "pending") return false;
    const d = i.due_date ? new Date(i.due_date + "T00:00:00") : new Date(i.created_at);
    return d.getFullYear() === thisYear;
  }).reduce((s, i) => s + i.amount, 0);

  const paidCount = filtered.filter((i) => i.status === "paid").length;
  const pendingCount = filtered.filter((i) => i.status === "pending").length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });
      if (res.ok) {
        setShowNew(false);
        setNewInvoice({ client_id: "", amount: "", concept: "", due_date: "" });
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = nextStatus[currentStatus] || "pending";
    setInvoices((prev) =>
      prev.map((inv) => inv.id === id ? { ...inv, status: newStatus, paid_date: newStatus === "paid" ? new Date().toISOString().split("T")[0] : inv.paid_date } : inv)
    );
    await fetch(`/api/admin/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta factura?")) return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
  };

  const scopeLabel = monthFilter !== "all" ? MONTH_NAMES[Number(monthFilter)] : `${thisYear}`;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">Contabilidad</h2>
          <p className="text-[11px] text-warm-gray-300 mt-1">{invoices.length} facturas en total</p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-2xl hover:bg-warm-gray-500 transition-all cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nueva factura
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="relative overflow-hidden bg-crema rounded-3xl p-5">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#A8D5BA]/20 -translate-y-6 translate-x-6" />
          <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Cobrado · {scopeLabel}</p>
          <p className="text-2xl font-[family-name:var(--font-display)] italic text-[#3D6B4F] mt-1.5 leading-none">{totalPaid.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-2">{paidCount} factura{paidCount !== 1 ? "s" : ""}</p>
        </div>
        <div className="relative overflow-hidden bg-crema rounded-3xl p-5">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#F2B8B5]/20 -translate-y-6 translate-x-6" />
          <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Pendiente · {scopeLabel}</p>
          <p className="text-2xl font-[family-name:var(--font-display)] italic text-[#8C4A47] mt-1.5 leading-none">{totalPending.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-2">{pendingCount} factura{pendingCount !== 1 ? "s" : ""}</p>
        </div>
        <div className="relative overflow-hidden bg-crema rounded-3xl p-5">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#A8D5BA]/15 -translate-y-6 translate-x-6" />
          <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Total cobrado {thisYear}</p>
          <p className="text-2xl font-[family-name:var(--font-display)] italic text-[#3D6B4F] mt-1.5 leading-none">{yearPaid.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-2">año completo</p>
        </div>
        <div className="relative overflow-hidden bg-crema rounded-3xl p-5">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-[#F2B8B5]/15 -translate-y-6 translate-x-6" />
          <p className="text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.12em]">Total pendiente {thisYear}</p>
          <p className="text-2xl font-[family-name:var(--font-display)] italic text-[#8C4A47] mt-1.5 leading-none">{yearPending.toFixed(0)}€</p>
          <p className="text-[10px] text-warm-gray-300 mt-2">año completo</p>
        </div>
      </div>

      {/* New Invoice Form */}
      {showNew && (
        <form onSubmit={handleCreate} className="bg-crema rounded-3xl p-6 mb-6 space-y-4">
          <h3 className="font-[family-name:var(--font-display)] italic text-lg text-warm-dark">Nueva factura</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.1em] mb-1.5">Cliente *</label>
              <select value={newInvoice.client_id} onChange={(e) => setNewInvoice({ ...newInvoice, client_id: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-2xl bg-warm-white text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
                <option value="">Seleccionar cliente</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.1em] mb-1.5">Importe (€) *</label>
              <input type="number" step="0.01" required value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-warm-white text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.1em] mb-1.5">Concepto *</label>
              <input type="text" required value={newInvoice.concept} onChange={(e) => setNewInvoice({ ...newInvoice, concept: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-warm-white text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.1em] mb-1.5">Fecha de vencimiento</label>
              <input type="date" value={newInvoice.due_date} onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-warm-white text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-2xl hover:bg-warm-gray-500 transition-all disabled:opacity-50 cursor-pointer">
              {saving ? "Creando..." : "Crear factura"}
            </button>
            <button type="button" onClick={() => setShowNew(false)}
              className="px-6 py-2.5 text-sm text-warm-gray-400 hover:text-warm-dark transition-colors cursor-pointer">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setStatusFilter(statusFilter === "paid" ? "all" : "paid")}
          className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            statusFilter === "paid" ? "bg-[#A8D5BA]/40 text-[#3D6B4F]" : "bg-crema text-warm-gray-400 hover:bg-[#A8D5BA]/20"
          }`}
        >
          Pagadas
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "pending" ? "all" : "pending")}
          className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            statusFilter === "pending" ? "bg-[#F2B8B5]/40 text-[#8C4A47]" : "bg-crema text-warm-gray-400 hover:bg-[#F2B8B5]/20"
          }`}
        >
          Pendientes
        </button>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}
          className="px-3.5 py-2 rounded-full bg-crema text-warm-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-rosa-200 cursor-pointer">
          <option value="all">Todos los meses</option>
          {MONTH_NAMES.map((name, i) => (
            <option key={i} value={i}>{name}</option>
          ))}
        </select>
        {(statusFilter !== "all" || monthFilter !== "all") && (
          <button
            onClick={() => { setStatusFilter("all"); setMonthFilter("all"); }}
            className="px-3 py-2 text-[10px] text-rosa-400 hover:text-rosa-500 transition-colors cursor-pointer uppercase tracking-wider"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Invoice List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-crema rounded-3xl">
          <p className="text-warm-gray-300 text-sm">Sin facturas</p>
        </div>
      ) : (
        <div className="bg-crema rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pl-6 pr-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Concepto</th>
                  <th className="text-left px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em] hidden sm:table-cell">Cliente</th>
                  <th className="text-right px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Importe</th>
                  <th className="text-center px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Estado</th>
                  <th className="text-left px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em] hidden md:table-cell">Fecha</th>
                  <th className="w-10 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-warm-white transition-all duration-200">
                    <td className="pl-6 pr-3 py-3.5">
                      <p className="text-sm text-warm-dark truncate max-w-[200px]">{inv.concept}</p>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-warm-gray-400 truncate">{inv.clients?.name ?? "—"}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-sm font-[family-name:var(--font-display)] italic text-warm-dark tabular-nums">{inv.amount}€</span>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <button
                        onClick={() => handleStatusChange(inv.id, inv.status)}
                        title="Clic para cambiar estado"
                        className={`text-[9px] px-2.5 py-1 rounded-full font-medium cursor-pointer hover:opacity-70 transition-opacity ${statusColors[inv.status] ?? "bg-warm-gray-100 text-warm-gray-400"}`}
                      >
                        {statusLabels[inv.status] ?? inv.status}
                      </button>
                    </td>
                    <td className="px-3 py-3.5 hidden md:table-cell">
                      <span className="text-[11px] text-warm-gray-300 tabular-nums">
                        {inv.due_date ? new Date(inv.due_date + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : "—"}
                      </span>
                    </td>
                    <td className="pr-4 py-3.5">
                      <button onClick={() => handleDelete(inv.id)}
                        className="text-warm-gray-200 hover:text-[#8C4A47] transition-colors cursor-pointer opacity-0 group-hover:opacity-100" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
