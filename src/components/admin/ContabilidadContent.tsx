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
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
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

  const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  const filtered = invoices.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (monthFilter !== "all") {
      const m = new Date(i.created_at).getMonth();
      if (m !== Number(monthFilter)) return false;
    }
    return true;
  });

  const scopeLabel = monthFilter !== "all" ? MONTH_NAMES[Number(monthFilter)] : "Total";

  const totalPaid = filtered.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = filtered.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const totalAll = filtered.reduce((s, i) => s + i.amount, 0);

  const currentMonth = new Date().toLocaleString("es-ES", { month: "long" });
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyPaid = invoices
    .filter((i) => {
      if (i.status !== "paid" || !i.paid_date) return false;
      const d = new Date(i.paid_date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((s, i) => s + i.amount, 0);

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">Contabilidad</h2>
          <p className="text-sm text-warm-gray-400 mt-1">{invoices.length} facturas</p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 transition-all cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nueva factura
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-5 border border-warm-gray-100/50">
          <p className="text-xs text-warm-gray-400 uppercase tracking-wider">Cobrado — {scopeLabel}</p>
          <p className="text-2xl font-light text-green-600 mt-2">{totalPaid.toFixed(2)}€</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5 border border-warm-gray-100/50">
          <p className="text-xs text-warm-gray-400 uppercase tracking-wider">Pendiente — {scopeLabel}</p>
          <p className="text-2xl font-light text-amber-600 mt-2">{totalPending.toFixed(2)}€</p>
        </div>
        <div className="bg-gradient-to-br from-rosa-50 to-rosa-100/50 rounded-2xl p-5 border border-warm-gray-100/50">
          <p className="text-xs text-warm-gray-400 uppercase tracking-wider">Cobrado en {currentMonth}</p>
          <p className="text-2xl font-light text-rosa-500 mt-2">{monthlyPaid.toFixed(2)}€</p>
        </div>
        <div className="bg-gradient-to-br from-warm-gray-50 to-warm-gray-100/50 rounded-2xl p-5 border border-warm-gray-100/50">
          <p className="text-xs text-warm-gray-400 uppercase tracking-wider">Facturado — {scopeLabel}</p>
          <p className="text-2xl font-light text-warm-dark mt-2">{totalAll.toFixed(2)}€</p>
        </div>
      </div>

      {/* New Invoice Form */}
      {showNew && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-warm-gray-100 p-6 mb-6 space-y-4">
          <h3 className="font-medium text-warm-dark">Nueva factura</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warm-dark mb-1.5">Cliente *</label>
              <select value={newInvoice.client_id} onChange={(e) => setNewInvoice({ ...newInvoice, client_id: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
                <option value="">Seleccionar cliente</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-dark mb-1.5">Importe (€) *</label>
              <input type="number" step="0.01" required value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-dark mb-1.5">Concepto *</label>
              <input type="text" required value={newInvoice.concept} onChange={(e) => setNewInvoice({ ...newInvoice, concept: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-dark mb-1.5">Fecha de vencimiento</label>
              <input type="date" value={newInvoice.due_date} onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 transition-all disabled:opacity-50 cursor-pointer">
            {saving ? "Creando..." : "Crear factura"}
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-warm-gray-100 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="paid">Pagadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-warm-gray-100 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
          <option value="all">Todos los meses</option>
          {MONTH_NAMES.map((name, i) => (
            <option key={i} value={i}>{name}</option>
          ))}
        </select>
        {(statusFilter !== "all" || monthFilter !== "all") && (
          <button
            onClick={() => { setStatusFilter("all"); setMonthFilter("all"); }}
            className="px-3 py-2.5 text-xs text-rosa-400 hover:text-rosa-500 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Invoice List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-warm-gray-100">
          <p className="text-warm-gray-300 text-sm">Sin facturas</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-warm-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-gray-100 bg-warm-gray-100/30">
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider">Concepto</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider">Importe</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">Vencimiento</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="border-b border-warm-gray-100/50 hover:bg-warm-gray-100/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-warm-dark">{inv.concept}</td>
                    <td className="px-4 py-3 text-warm-gray-400 hidden sm:table-cell">{inv.clients?.name ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-warm-dark">{inv.amount}€</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusChange(inv.id, inv.status)}
                        title="Clic para cambiar estado"
                        className={`text-[10px] px-2.5 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 transition-opacity ${statusColors[inv.status] ?? ""}`}
                      >
                        {statusLabels[inv.status] ?? inv.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-warm-gray-300 text-xs hidden md:table-cell">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString("es-ES") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(inv.id)}
                        className="text-warm-gray-300 hover:text-red-400 transition-colors cursor-pointer" title="Eliminar">
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
