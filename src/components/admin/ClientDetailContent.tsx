"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Client, Session, FileRecord, Invoice } from "@/lib/supabase/types";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  lead: "bg-amber-100 text-amber-700",
  inactive: "bg-warm-gray-100 text-warm-gray-500",
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ClientDetailContent({
  client: initialClient,
  sessions,
  files,
  invoices,
}: {
  client: Client;
  sessions: Session[];
  files: FileRecord[];
  invoices: Invoice[];
}) {
  const router = useRouter();
  const [client, setClient] = useState(initialClient);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ ...initialClient });

  const cleanPhone = client.phone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("34") ? cleanPhone : `34${cleanPhone}`;
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Hola ${client.name}! Soy Sandra Lorden.`)}`;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          service_type: editForm.service_type,
          modality: editForm.modality,
          goal: editForm.goal,
          status: editForm.status,
          notes: editForm.notes,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setClient(updated);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este cliente? Se borrarán todos sus datos.")) return;
    await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
    router.push("/admin/clientes");
    router.refresh();
  };

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-warm-gray-400 hover:text-warm-dark transition-colors mb-4 flex items-center gap-1 cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        Volver
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">
              {client.name}
            </h2>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColors[client.status] ?? ""}`}>
              {client.status === "active" ? "Activo" : client.status === "lead" ? "Lead" : "Inactivo"}
            </span>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
              client.modality === "presencial" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            }`}>
              {client.modality === "presencial" ? "Presencial" : "Virtual"}
            </span>
          </div>
          <p className="text-sm text-warm-gray-400 mt-1">{client.email} · {client.phone}</p>
        </div>
        <div className="flex gap-2">
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 0 0 .917.917l4.458-1.495A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0Zm0 22a9.94 9.94 0 0 1-5.39-1.584l-.386-.242-2.646.887.887-2.646-.242-.386A9.94 9.94 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10Z"/></svg>
            WhatsApp
          </a>
          <button onClick={() => { setEditForm({ ...client }); setEditing(!editing); }}
            className="px-4 py-2 text-sm font-medium text-warm-dark bg-warm-gray-100 rounded-xl hover:bg-warm-gray-200 transition-all cursor-pointer">
            {editing ? "Cancelar" : "Editar"}
          </button>
          <button onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all cursor-pointer">
            Eliminar
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nombre" value={editForm.name} onChange={(v) => setEditForm({ ...editForm, name: v })} />
            <FormField label="Email" value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} />
            <FormField label="Teléfono" value={editForm.phone} onChange={(v) => setEditForm({ ...editForm, phone: v })} />
            <div>
              <label className="block text-sm font-medium text-warm-dark mb-1.5">Estado</label>
              <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Client["status"] })}
                className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
                <option value="lead">Lead</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>
          <FormField label="Servicio" value={editForm.service_type} onChange={(v) => setEditForm({ ...editForm, service_type: v })} />
          <div>
            <label className="block text-sm font-medium text-warm-dark mb-2">Modalidad</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditForm({ ...editForm, modality: "virtual" })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                  editForm.modality === "virtual" ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-warm-gray-100/50 border-warm-gray-200/50 text-warm-gray-400 hover:border-purple-200"
                }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Virtual
              </button>
              <button type="button" onClick={() => setEditForm({ ...editForm, modality: "presencial" })}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                  editForm.modality === "presencial" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-warm-gray-100/50 border-warm-gray-200/50 text-warm-gray-400 hover:border-blue-200"
                }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Presencial
              </button>
            </div>
          </div>
          <FormField label="Objetivo" value={editForm.goal} onChange={(v) => setEditForm({ ...editForm, goal: v })} />
          <div>
            <label className="block text-sm font-medium text-warm-dark mb-1.5">Notas</label>
            <textarea rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200 resize-none" />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 transition-all disabled:opacity-50 cursor-pointer">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InfoCard label="Servicio" value={client.service_type || "Sin especificar"} />
        <InfoCard label="Objetivo" value={client.goal || "Sin especificar"} />
        <InfoCard label="Fecha de registro" value={new Date(client.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })} />
      </div>

      {client.notes && (
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6 mb-6">
          <h3 className="font-medium text-warm-dark mb-2 text-sm">Notas</h3>
          <p className="text-sm text-warm-gray-400 whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}

      {/* Tabs: Sessions, Files, Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions */}
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6">
          <h3 className="font-medium text-warm-dark mb-4">Sesiones ({sessions.length})</h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-warm-gray-300 text-center py-4">Sin sesiones</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-warm-gray-100/30 text-sm">
                  <p className="font-medium text-warm-dark">{new Date(s.date).toLocaleDateString("es-ES")}</p>
                  <p className="text-xs text-warm-gray-400">{s.type} · {s.duration_minutes} min</p>
                  {s.notes && <p className="text-xs text-warm-gray-300 mt-1">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files */}
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6">
          <h3 className="font-medium text-warm-dark mb-4">Archivos ({files.length})</h3>
          {files.length === 0 ? (
            <p className="text-sm text-warm-gray-300 text-center py-4">Sin archivos</p>
          ) : (
            <div className="space-y-2">
              {files.map((f) => (
                <a key={f.id} href={f.file_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-warm-gray-100/30 hover:bg-warm-gray-100/50 transition-colors">
                  <svg className="w-5 h-5 text-warm-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-warm-dark truncate">{f.file_name}</p>
                    <p className="text-[10px] text-warm-gray-300">{new Date(f.uploaded_at).toLocaleDateString("es-ES")}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6">
          <h3 className="font-medium text-warm-dark mb-4">Facturas ({invoices.length})</h3>
          {invoices.length === 0 ? (
            <p className="text-sm text-warm-gray-300 text-center py-4">Sin facturas</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-3 rounded-xl bg-warm-gray-100/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-warm-dark">{inv.concept}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[inv.status] ?? ""}`}>
                      {inv.status === "paid" ? "Pagado" : inv.status === "pending" ? "Pendiente" : "Cancelado"}
                    </span>
                  </div>
                  <p className="text-xs text-warm-gray-400 mt-1">{inv.amount}€ · {inv.due_date ? new Date(inv.due_date).toLocaleDateString("es-ES") : "Sin fecha"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-gray-100 p-5">
      <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-warm-dark">{value}</p>
    </div>
  );
}

function FormField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-warm-dark mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
    </div>
  );
}
