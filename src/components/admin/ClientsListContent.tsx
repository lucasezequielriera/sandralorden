"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import type { Client } from "@/lib/supabase/types";

const modalityColors: Record<string, string> = {
  presencial: "bg-[#D4E8F0] text-[#3A6B7E]",
  virtual: "bg-[#E8D5F0] text-[#6B3A7E]",
};

const modalityLabels: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
};

export default function ClientsListContent({ clients, paymentMap = {} }: { clients: Client[]; paymentMap?: Record<string, Record<number, string>> }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalityFilter, setModalityFilter] = useState<string>("all");

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchModality = modalityFilter === "all" || c.modality === modalityFilter;
    return matchSearch && matchStatus && matchModality;
  });

  const presencialCount = clients.filter((c) => c.modality === "presencial").length;
  const virtualCount = clients.filter((c) => c.modality === "virtual").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">
            Clientes
          </h2>
          <p className="text-sm text-warm-gray-400 mt-1">{clients.length} clientes en total</p>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo cliente
        </Link>
      </div>

      {/* Quick counts */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setModalityFilter(modalityFilter === "presencial" ? "all" : "presencial")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            modalityFilter === "presencial" ? "bg-marron-200 text-marron-500" : "bg-crema text-warm-gray-400 hover:bg-marron-100"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-marron-400" />
          Presencial · {presencialCount}
        </button>
        <button
          onClick={() => setModalityFilter(modalityFilter === "virtual" ? "all" : "virtual")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
            modalityFilter === "virtual" ? "bg-rosa-200 text-rosa-500" : "bg-crema text-warm-gray-400 hover:bg-rosa-100"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rosa-400" />
          Virtual · {virtualCount}
        </button>
        {(statusFilter !== "all" || modalityFilter !== "all") && (
          <button
            onClick={() => { setStatusFilter("all"); setModalityFilter("all"); }}
            className="px-3 py-2 text-[10px] text-rosa-400 hover:text-rosa-500 transition-colors cursor-pointer uppercase tracking-wider"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono..."
          aria-label="Buscar clientes"
          className="flex-1 px-4 py-2.5 rounded-2xl bg-crema text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-crema text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200"
        >
          <option value="all">Todos los estados</option>
          <option value="lead">Leads</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      {/* Client List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-crema rounded-3xl">
          <p className="text-warm-gray-300 text-sm">No se encontraron clientes</p>
        </div>
      ) : (
        <div className="bg-crema rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th scope="col" className="text-left pl-6 pr-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em] w-[200px]">Nombre</th>
                  <th scope="col" className="text-left px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em] hidden sm:table-cell w-[100px]">Tipo</th>
                  <th scope="col" className="text-left px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Pagos {new Date().getFullYear()}</th>
                  <th scope="col" className="text-left px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em] hidden lg:table-cell w-[100px]">Desde</th>
                  <th scope="col" className="w-12 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id} className="group hover:bg-warm-white transition-all duration-200 cursor-pointer" tabIndex={0} role="link" onClick={() => router.push(`/admin/clientes/${client.id}`)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/admin/clientes/${client.id}`); } }}>
                    <td className="pl-6 pr-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rosa-100/60 flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-medium text-rosa-400">{client.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-warm-dark group-hover:text-rosa-500 transition-colors truncate">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${modalityColors[client.modality] ?? "bg-warm-gray-100 text-warm-gray-400"}`}>
                        {modalityLabels[client.modality] ?? "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <PaymentDots payments={paymentMap[client.id] ?? {}} />
                    </td>
                    <td className="px-3 py-3.5 hidden lg:table-cell">
                      <span className="text-[11px] text-warm-gray-300 tabular-nums">
                        {new Date(client.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </span>
                    </td>
                    <td className="pr-4 py-3.5 text-right">
                      <svg className="w-4 h-4 text-warm-gray-200 group-hover:text-rosa-400 transition-colors inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
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

const MONTH_SHORT = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function PaymentDots({ payments }: { payments: Record<number, string> }) {
  const currentMonth = new Date().getMonth();
  return (
    <div className="flex items-center gap-[3px]" title="Pagos del año (E-D)">
      {MONTH_SHORT.map((label, i) => {
        const status = payments[i];
        const isCurrent = i === currentMonth;
        return (
          <div
            key={i}
            className={`w-[18px] h-[18px] rounded-md flex items-center justify-center text-[7px] font-semibold leading-none transition-colors ${
              status === "paid"
                ? "bg-[#A8D5BA] text-[#3D6B4F]"
                : status === "pending"
                  ? "bg-[#F2B8B5] text-[#8C4A47]"
                  : i > currentMonth
                    ? "bg-warm-gray-100/40 text-warm-gray-200"
                    : "bg-warm-gray-200/50 text-warm-gray-300"
            } ${isCurrent ? "ring-1 ring-rosa-400 ring-offset-1" : ""}`}
            title={`${["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][i]}: ${status === "paid" ? "Pagado" : status === "pending" ? "Pendiente" : "Sin factura"}`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
