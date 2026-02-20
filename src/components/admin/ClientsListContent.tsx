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

export default function ClientsListContent({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden lg:table-cell">Fecha</th>
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
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[client.status] ?? ""}`}>
                        {statusLabels[client.status] ?? client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-warm-gray-300 text-xs hidden lg:table-cell">
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
