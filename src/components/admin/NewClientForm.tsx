"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service_type: "",
    goal: "",
    status: "lead" as const,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear el cliente");
      }
      router.push("/admin/clientes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el cliente");
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl">
      <button onClick={() => router.back()} className="text-sm text-warm-gray-400 hover:text-warm-dark transition-colors mb-4 flex items-center gap-1 cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        Volver
      </button>

      <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark mb-6">
        Nuevo cliente
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-warm-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nc-name" className="block text-sm font-medium text-warm-dark mb-1.5">Nombre *</label>
            <input id="nc-name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
          </div>
          <div>
            <label htmlFor="nc-email" className="block text-sm font-medium text-warm-dark mb-1.5">Email *</label>
            <input id="nc-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
          </div>
          <div>
            <label htmlFor="nc-phone" className="block text-sm font-medium text-warm-dark mb-1.5">Teléfono *</label>
            <input id="nc-phone" type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
          </div>
          <div>
            <label htmlFor="nc-service" className="block text-sm font-medium text-warm-dark mb-1.5">Servicio</label>
            <select id="nc-service" value={form.service_type} onChange={(e) => update("service_type", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
              <option value="">Sin especificar</option>
              <option value="Solo nutrición">Solo nutrición</option>
              <option value="Solo entrenamiento">Solo entrenamiento</option>
              <option value="Entrenamiento + nutrición">Entrenamiento + nutrición</option>
              <option value="Entrenamiento presencial">Entrenamiento presencial</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="nc-goal" className="block text-sm font-medium text-warm-dark mb-1.5">Objetivo</label>
          <input id="nc-goal" type="text" value={form.goal} onChange={(e) => update("goal", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
        </div>

        <div>
          <label htmlFor="nc-status" className="block text-sm font-medium text-warm-dark mb-1.5">Estado</label>
          <select id="nc-status" value={form.status} onChange={(e) => update("status", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
            <option value="lead">Lead</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <div>
          <label htmlFor="nc-notes" className="block text-sm font-medium text-warm-dark mb-1.5">Notas</label>
          <textarea id="nc-notes" rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200 resize-none" />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 transition-all disabled:opacity-50 cursor-pointer">
          {loading ? "Creando..." : "Crear cliente"}
        </button>
      </form>
    </div>
  );
}
