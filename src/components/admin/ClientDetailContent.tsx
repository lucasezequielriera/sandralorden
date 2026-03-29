"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import type { Client, Session, FileRecord, Invoice, IntakeForm } from "@/lib/supabase/types";
import PaymentGrid from "./PaymentGrid";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  lead: "bg-amber-100 text-amber-700",
  inactive: "bg-warm-gray-100 text-warm-gray-500",
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function getProgramBadge(notes: string) {
  const n = notes.toLowerCase();
  if (n.includes("premium 90")) {
    return { label: "Premium 90 días", className: "bg-amber-100 text-amber-700" };
  }
  if (n.includes("programa:")) {
    return { label: "Estándar", className: "bg-slate-100 text-slate-600" };
  }
  return null;
}

export default function ClientDetailContent({
  client: initialClient,
  sessions,
  files,
  invoices,
  intakeForms = [],
}: {
  client: Client;
  sessions: Session[];
  files: FileRecord[];
  invoices: Invoice[];
  intakeForms?: IntakeForm[];
}) {
  const router = useRouter();
  const [client, setClient] = useState(initialClient);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ ...initialClient });
  const [showIntake, setShowIntake] = useState(false);
  const [uploadingPlan, setUploadingPlan] = useState<"training" | "nutrition" | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ training: number; nutrition: number }>({
    training: 0,
    nutrition: 0,
  });
  const [resendAccessLoading, setResendAccessLoading] = useState(false);
  const programBadge = getProgramBadge(client.notes || "");

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
        toast.success("Cambios guardados");
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Error al guardar los cambios");
      }
    } catch {
      toast.error("Error de red al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleResendAccessEmail = async () => {
    if (!client.email?.trim()) {
      toast.error("Este cliente no tiene email");
      return;
    }
    setResendAccessLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/resend-access-email`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success("Correo de acceso enviado");
      } else {
        toast.error(data?.error || "No se pudo enviar el correo");
      }
    } catch {
      toast.error("Error de red al enviar el correo");
    } finally {
      setResendAccessLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este cliente? Se borrarán todos sus datos.")) return;
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "Error al eliminar el cliente");
        return;
      }
      router.push("/admin/clientes");
      router.refresh();
    } catch {
      toast.error("Error de red al eliminar el cliente");
    }
  };

  const uploadPlan = async (file: File, purpose: "training_plan" | "nutrition_plan") => {
    const target = purpose === "training_plan" ? "training" : "nutrition";
    const MAX_SIZE = 10 * 1024 * 1024;
    const ALLOWED_TYPES = new Set([
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
    ]);

    if (!ALLOWED_TYPES.has(file.type)) {
      toast.error("Tipo de archivo no permitido. Usa PDF, imagen, DOCX, XLSX o CSV.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("El archivo excede 10 MB.");
      return;
    }

    setUploadingPlan(target);
    setUploadProgress((prev) => ({ ...prev, [target]: 0 }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("client_id", client.id);
      formData.append("file_purpose", purpose);

      const res = await new Promise<{ ok: boolean; status: number; body: unknown }>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/files");
        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const pct = Math.max(1, Math.min(100, Math.round((event.loaded / event.total) * 100)));
          setUploadProgress((prev) => ({ ...prev, [target]: pct }));
        };
        xhr.onload = () => {
          let body: unknown = null;
          try {
            body = JSON.parse(xhr.responseText);
          } catch {
            body = null;
          }
          resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, body });
        };
        xhr.onerror = () => resolve({ ok: false, status: 0, body: null });
        xhr.send(formData);
      });

      if (!res.ok) {
        const maybeError =
          typeof res.body === "object" && res.body !== null && "error" in res.body
            ? (res.body as { error?: string }).error
            : null;
        toast.error(maybeError || "No se pudo subir el plan");
        return;
      }

      setUploadProgress((prev) => ({ ...prev, [target]: 100 }));
      router.refresh();
      toast.success(
        purpose === "training_plan"
          ? "Plan de entrenamiento subido correctamente"
          : "Plan de alimentación subido correctamente"
      );
    } catch {
      toast.error("Error de red al subir el plan");
    } finally {
      setUploadingPlan(null);
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [target]: 0 }));
      }, 500);
    }
  };

  const latestTrainingPlan = files
    .filter((f) => f.file_name.startsWith("PLAN_TRAINING__"))
    .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())[0];
  const latestNutritionPlan = files
    .filter((f) => f.file_name.startsWith("PLAN_NUTRITION__"))
    .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())[0];
  const hasPaidInvoice = invoices.some((inv) => inv.status === "paid");
  const trainingStatus = latestTrainingPlan ? "Listo" : hasPaidInvoice ? "En elaboración" : "Pendiente de pago";
  const nutritionStatus = latestNutritionPlan ? "Listo" : hasPaidInvoice ? "En elaboración" : "Pendiente de pago";

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
            {programBadge && (
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${programBadge.className}`}>
                {programBadge.label}
              </span>
            )}
          </div>
          <p className="text-sm text-warm-gray-400 mt-1">{client.email} · {client.phone}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 0 0 .917.917l4.458-1.495A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0Zm0 22a9.94 9.94 0 0 1-5.39-1.584l-.386-.242-2.646.887.887-2.646-.242-.386A9.94 9.94 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10Z"/></svg>
            WhatsApp
          </a>
          <button
            type="button"
            onClick={handleResendAccessEmail}
            disabled={resendAccessLoading || !client.email?.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-warm-dark bg-rosa-50 border border-rosa-200/60 rounded-xl hover:bg-rosa-100/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            {resendAccessLoading ? "Enviando…" : "Reenviar acceso"}
          </button>
          <button
            type="button"
            onClick={() => setShowIntake((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-warm-dark bg-warm-gray-100 rounded-xl hover:bg-warm-gray-200 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5M3.75 9.75h16.5M3.75 15h8.25" />
            </svg>
            Datos del cliente
          </button>
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
            <FormField id="cd-name" label="Nombre" value={editForm.name} onChange={(v) => setEditForm({ ...editForm, name: v })} />
            <FormField id="cd-email" label="Email" value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} />
            <FormField id="cd-phone" label="Teléfono" value={editForm.phone} onChange={(v) => setEditForm({ ...editForm, phone: v })} />
            <div>
              <label htmlFor="cd-status" className="block text-sm font-medium text-warm-dark mb-1.5">Estado</label>
              <select id="cd-status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Client["status"] })}
                className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
                <option value="lead">Lead</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>
          <FormField id="cd-service" label="Servicio" value={editForm.service_type} onChange={(v) => setEditForm({ ...editForm, service_type: v })} />
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
          <FormField id="cd-goal" label="Objetivo" value={editForm.goal} onChange={(v) => setEditForm({ ...editForm, goal: v })} />
          <div>
            <label htmlFor="cd-notes" className="block text-sm font-medium text-warm-dark mb-1.5">Notas</label>
            <textarea id="cd-notes" rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
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

      {showIntake && intakeForms.length > 0 && (
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6 mb-6">
          <h3 className="font-medium text-warm-dark mb-3 text-sm">Datos del formulario detallado</h3>
          <p className="text-xs text-warm-gray-300 mb-3">
            Mostrando el último formulario completado por este cliente.
          </p>
          {(() => {
            const latest = [...intakeForms].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];
            const entries = Object.entries(latest.payload || {});
            return (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {entries.map(([key, value]) => (
                  <div key={key} className="bg-warm-gray-50 rounded-xl p-3 border border-warm-gray-100">
                    <dt className="text-[11px] uppercase tracking-wide text-warm-gray-400 mb-1">
                      {key}
                    </dt>
                    <dd className="text-warm-dark whitespace-pre-wrap break-words text-xs">
                      {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                    </dd>
                  </div>
                ))}
              </dl>
            );
          })()}
        </div>
      )}

      {client.notes && (
        <div className="bg-white rounded-2xl border border-warm-gray-100 p-6 mb-6">
          <h3 className="font-medium text-warm-dark mb-2 text-sm">Notas</h3>
          <p className="text-sm text-warm-gray-400 whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}

      {/* Payment Grid */}
      <div className="mb-6">
        <PaymentGrid clientId={client.id} />
      </div>

      {/* Planes del cliente */}
      <div className="bg-white rounded-2xl border border-warm-gray-100 p-6 mb-6">
        <h3 className="font-medium text-warm-dark mb-4">Planes del cliente</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-warm-gray-100 bg-warm-gray-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-warm-gray-400 mb-1">Entrenamiento</p>
            <p className="text-sm text-warm-dark">{trainingStatus}</p>
          </div>
          <div className="rounded-xl border border-warm-gray-100 bg-warm-gray-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-warm-gray-400 mb-1">Alimentación</p>
            <p className="text-sm text-warm-dark">{nutritionStatus}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PlanUploaderCard
            title="Plan de entrenamiento"
            latestFile={latestTrainingPlan}
            loading={uploadingPlan === "training"}
            progress={uploadProgress.training}
            onUpload={(file) => uploadPlan(file, "training_plan")}
            stripPrefix="PLAN_TRAINING__"
          />
          <PlanUploaderCard
            title="Plan de alimentación"
            latestFile={latestNutritionPlan}
            loading={uploadingPlan === "nutrition"}
            progress={uploadProgress.nutrition}
            onUpload={(file) => uploadPlan(file, "nutrition_plan")}
            stripPrefix="PLAN_NUTRITION__"
          />
        </div>
        <p className="text-xs text-warm-gray-300 mt-3">
          Al subir un plan, el cliente lo verá en su panel y recibirá email automático.
        </p>
      </div>

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

function FormField({ label, value, onChange, id }: { label: string; value: string; onChange: (v: string) => void; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-warm-dark mb-1.5">{label}</label>
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200" />
    </div>
  );
}

function PlanUploaderCard({
  title,
  latestFile,
  loading,
  progress,
  onUpload,
  stripPrefix,
}: {
  title: string;
  latestFile?: FileRecord;
  loading: boolean;
  progress: number;
  onUpload: (file: File) => void;
  stripPrefix: string;
}) {
  return (
    <div className="rounded-xl border border-warm-gray-100 bg-warm-gray-50 p-4">
      <p className="text-sm font-medium text-warm-dark mb-3">{title}</p>
      {latestFile ? (
        <a
          href={latestFile.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border border-warm-gray-100 bg-white p-3 mb-3 hover:bg-warm-gray-50 transition-colors"
        >
          <p className="text-sm text-warm-dark truncate">{latestFile.file_name.replace(stripPrefix, "")}</p>
          <p className="text-[11px] text-warm-gray-300 mt-1">
            Último: {new Date(latestFile.uploaded_at).toLocaleDateString("es-ES")}
          </p>
        </a>
      ) : (
        <p className="text-xs text-warm-gray-300 mb-3">Todavía no hay plan subido.</p>
      )}
      <label
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
          loading ? "bg-warm-gray-200 text-warm-gray-400" : "bg-warm-dark text-white hover:bg-warm-gray-500"
        }`}
      >
        {loading ? `Subiendo... ${progress}%` : "Subir plan"}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.xlsx,.csv"
          className="hidden"
          disabled={loading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.currentTarget.value = "";
          }}
        />
      </label>
      <p className="text-[11px] text-warm-gray-300 mt-2">Máximo 10 MB · PDF, imagen, DOCX, XLSX o CSV</p>
      {loading && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-warm-gray-200 overflow-hidden">
          <div
            className="h-full bg-warm-dark transition-all duration-150"
            style={{ width: `${Math.max(4, progress)}%` }}
          />
        </div>
      )}
    </div>
  );
}
