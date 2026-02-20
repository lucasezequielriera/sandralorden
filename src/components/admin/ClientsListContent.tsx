"use client";

import { useState } from "react";
import Link from "next/link";
import type { Client } from "@/lib/supabase/types";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  lead: "bg-amber-100 text-amber-700",
  inactive: "bg-warm-gray-100 text-warm-gray-500",
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  lead: "Lead",
  inactive: "Inactivo",
};

const modalityColors: Record<string, string> = {
  presencial: "bg-blue-100 text-blue-700",
  virtual: "bg-purple-100 text-purple-700",
};

const modalityLabels: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
};

export default function ClientsListContent({ clients, paymentMap = {} }: { clients: Client[]; paymentMap?: Record<string, Record<number, string>> }) {
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
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setModalityFilter(modalityFilter === "presencial" ? "all" : "presencial")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer border ${
            modalityFilter === "presencial" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-warm-gray-100 text-warm-gray-400 hover:border-blue-200"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          Presencial <span className="font-medium">{presencialCount}</span>
        </button>
        <button
          onClick={() => setModalityFilter(modalityFilter === "virtual" ? "all" : "virtual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer border ${
            modalityFilter === "virtual" ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-white border-warm-gray-100 text-warm-gray-400 hover:border-purple-200"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          Virtual <span className="font-medium">{virtualCount}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-warm-gray-100 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-warm-gray-100 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200"
        >
          <option value="all">Todos los estados</option>
          <option value="lead">Leads</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        {(statusFilter !== "all" || modalityFilter !== "all") && (
          <button
            onClick={() => { setStatusFilter("all"); setModalityFilter("all"); }}
            className="px-3 py-2.5 text-xs text-rosa-400 hover:text-rosa-500 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Client List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-warm-gray-100">
          <p className="text-warm-gray-300 text-sm">No se encontraron clientes</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-warm-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-gray-100 bg-warm-gray-100/30">
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">Servicio</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">Modalidad</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden lg:table-cell">Pagos</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden xl:table-cell">Fecha</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id} className="border-b border-warm-gray-100/50 hover:bg-warm-gray-100/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-warm-dark">{client.name}</p>
                        <p className="text-xs text-warm-gray-300 sm:hidden">{client.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-warm-gray-400 hidden sm:table-cell">{client.email}</td>
                    <td className="px-4 py-3 text-warm-gray-400 hidden md:table-cell">{client.service_type || "—"}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${modalityColors[client.modality] ?? "bg-warm-gray-100 text-warm-gray-500"}`}>
                        {modalityLabels[client.modality] ?? client.modality ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[client.status] ?? ""}`}>
                        {statusLabels[client.status] ?? client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <PaymentDots payments={paymentMap[client.id] ?? {}} />
                    </td>
                    <td className="px-4 py-3 text-warm-gray-300 text-xs hidden xl:table-cell">
                      {new Date(client.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/clientes/${client.id}`}
                        className="text-rosa-400 hover:text-rosa-500 text-xs font-medium transition-colors"
                      >
                        Ver
                      </Link>
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
    <div className="flex items-center gap-0.5" title="Pagos del año (E-D)">
      {MONTH_SHORT.map((label, i) => {
        const status = payments[i];
        const isCurrent = i === currentMonth;
        return (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm flex items-center justify-center text-[7px] font-bold leading-none ${
              status === "paid"
                ? "bg-green-400 text-white"
                : status === "pending"
                  ? "bg-amber-400 text-white"
                  : i > currentMonth
                    ? "bg-warm-gray-50 text-warm-gray-200"
                    : "bg-warm-gray-100 text-warm-gray-300"
            } ${isCurrent ? "ring-1 ring-rosa-300" : ""}`}
            title={`${["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][i]}: ${status === "paid" ? "Pagado" : status === "pending" ? "Pendiente" : "Sin factura"}`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
