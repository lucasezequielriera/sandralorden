"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface InvoiceMonth {
  id: string;
  amount: number;
  status: string;
  concept: string;
  due_date: string;
  created_at: string;
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function PaymentGrid({ clientId }: { clientId: string }) {
  const router = useRouter();
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [invoices, setInvoices] = useState<InvoiceMonth[]>([]);
  const [toggling, setToggling] = useState<number | null>(null);
  const [modal, setModal] = useState<{ month: number } | null>(null);
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPayments = useCallback(async () => {
    const res = await fetch(`/api/admin/clients/${clientId}/payments`);
    if (res.ok) setInvoices(await res.json());
  }, [clientId]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const getMonthStatus = (month: number): "paid" | "pending" | "none" => {
    const inv = invoices.find((i) => {
      if (!i.due_date) return false;
      return new Date(i.due_date + "T00:00:00").getMonth() === month;
    });
    if (!inv) return "none";
    return inv.status as "paid" | "pending";
  };

  const getMonthAmount = (month: number): number => {
    const inv = invoices.find((i) => {
      if (!i.due_date) return false;
      return new Date(i.due_date + "T00:00:00").getMonth() === month;
    });
    return inv?.amount ?? 0;
  };

  const handleClick = async (month: number) => {
    const status = getMonthStatus(month);

    if (status === "none") {
      setModal({ month });
      setAmount("");
      setFile(null);
      return;
    }

    setToggling(month);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year, action: "toggle" }),
      });
      if (res.ok) {
        await fetchPayments();
        router.refresh();
      }
    } finally {
      setToggling(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || !amount) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: modal.month,
          year,
          action: "create",
          amount: parseFloat(amount),
        }),
      });

      if (res.ok && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("client_id", clientId);
        await fetch("/api/admin/files", { method: "POST", body: formData });
      }

      if (res.ok) {
        await fetchPayments();
        router.refresh();
        setModal(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const paidCount = MONTHS.filter((_, i) => getMonthStatus(i) === "paid").length;
  const pendingCount = MONTHS.filter((_, i) => getMonthStatus(i) === "pending").length;

  return (
    <>
      <div className="bg-white rounded-2xl border border-warm-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-warm-dark">Pagos {year}</h3>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              Pagado ({paidCount})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Pendiente ({pendingCount})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-warm-gray-200" />
              Sin factura
            </span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {MONTHS.map((name, i) => {
            const status = getMonthStatus(i);
            const monthAmount = getMonthAmount(i);
            const isCurrentMonth = i === currentMonth;
            const isFuture = i > currentMonth;
            const isToggling = toggling === i;

            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={isToggling}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
                  isToggling ? "opacity-50" : "hover:scale-105"
                } ${isCurrentMonth ? "ring-2 ring-rosa-200" : ""}`}
                title={`${name} ${year} — ${status === "paid" ? `Pagado (${monthAmount}€)` : status === "pending" ? "Pendiente" : "Sin factura"} (clic para cambiar)`}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                    status === "paid"
                      ? "bg-green-100 text-green-600"
                      : status === "pending"
                        ? "bg-amber-100 text-amber-600"
                        : isFuture
                          ? "bg-warm-gray-50 text-warm-gray-200"
                          : "bg-warm-gray-100 text-warm-gray-300"
                  }`}
                >
                  {status === "paid" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : status === "pending" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-medium">—</span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${
                  isCurrentMonth ? "text-rosa-500" : status === "paid" ? "text-green-600" : "text-warm-gray-400"
                }`}>
                  {name}
                </span>
                {status === "paid" && monthAmount > 0 && (
                  <span className="text-[8px] text-green-500 font-medium -mt-0.5">{monthAmount}€</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setModal(null)} />
          <form
            onSubmit={handleModalSubmit}
            className="relative bg-white rounded-2xl border border-warm-gray-100 shadow-xl w-full max-w-sm p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-warm-dark">
                Pago — {MONTHS[modal.month]} {year}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-8 h-8 flex items-center justify-center text-warm-gray-300 hover:text-warm-dark transition-colors cursor-pointer rounded-lg hover:bg-warm-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <label htmlFor="pay-amount" className="block text-sm font-medium text-warm-dark mb-1.5">
                Importe (€) *
              </label>
              <input
                id="pay-amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="200.00"
                className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200 placeholder:text-warm-gray-300"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-dark mb-1.5">
                Comprobante <span className="text-warm-gray-300 font-normal">(opcional)</span>
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200/50">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="text-sm text-green-700 truncate flex-1">{file.name}</span>
                  <button type="button" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="text-green-400 hover:text-red-400 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-warm-gray-200 text-warm-gray-300 hover:border-rosa-200 hover:text-rosa-400 transition-all text-sm cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  Subir comprobante
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={saving || !amount}
              className="w-full px-6 py-3 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Guardando..." : `Marcar como pagado — ${amount ? `${amount}€` : "..."}`}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
