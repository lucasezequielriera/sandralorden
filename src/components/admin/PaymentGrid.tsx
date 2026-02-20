"use client";

import { useState, useEffect, useCallback } from "react";

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
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [invoices, setInvoices] = useState<InvoiceMonth[]>([]);
  const [toggling, setToggling] = useState<number | null>(null);

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

  const handleToggle = async (month: number) => {
    setToggling(month);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year, action: "toggle" }),
      });
      if (res.ok) await fetchPayments();
    } finally {
      setToggling(null);
    }
  };

  const paidCount = MONTHS.filter((_, i) => getMonthStatus(i) === "paid").length;
  const pendingCount = MONTHS.filter((_, i) => getMonthStatus(i) === "pending").length;

  return (
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
          const isCurrentMonth = i === currentMonth;
          const isFuture = i > currentMonth;
          const isToggling = toggling === i;

          return (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              disabled={isToggling}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
                isToggling ? "opacity-50" : "hover:scale-105"
              } ${isCurrentMonth ? "ring-2 ring-rosa-200" : ""}`}
              title={`${name} ${year} — ${status === "paid" ? "Pagado" : status === "pending" ? "Pendiente" : "Sin factura"} (clic para cambiar)`}
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
