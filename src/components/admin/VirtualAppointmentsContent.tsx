"use client";

import { useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";

type Row = {
  id: string;
  starts_at: string;
  ends_at: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  status: string;
  source: string;
  meet_link: string | null;
  created_at: string;
};

type SlotOption = { startsAt: string; endsAt: string; label: string };

function canReschedule(a: Row): boolean {
  if (a.status !== "paid" && a.status !== "pending") return false;
  return new Date(a.starts_at).getTime() > Date.now();
}

export default function VirtualAppointmentsContent({ appointments }: { appointments: Row[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modalId, setModalId] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotOption[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [emailLocale, setEmailLocale] = useState<"es" | "en">("es");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        (a.reason || "").toLowerCase().includes(q),
    );
  }, [appointments, query]);

  const modalRow = modalId ? appointments.find((a) => a.id === modalId) : undefined;

  async function openModal(id: string) {
    setModalId(id);
    setSlots(null);
    setSlotsError(null);
    setSaveError(null);
    setSelectedKey("");
    setEmailLocale("es");
    setSlotsLoading(true);
    try {
      const res = await fetch(`/api/admin/virtual-appointments/available-slots?excludeId=${encodeURIComponent(id)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSlotsError(typeof data.error === "string" ? data.error : "No se pudieron cargar los huecos.");
        return;
      }
      const list = (data.slots as SlotOption[]) ?? [];
      setSlots(list);
      if (list.length > 0) {
        setSelectedKey(`${list[0].startsAt}\t${list[0].endsAt}`);
      }
    } catch {
      setSlotsError("Error de red al cargar huecos.");
    } finally {
      setSlotsLoading(false);
    }
  }

  function closeModal() {
    if (saving) return;
    setModalId(null);
    setSlots(null);
    setSlotsError(null);
    setSaveError(null);
  }

  async function submitReschedule() {
    if (!modalId || !selectedKey) return;
    const [startsAt, endsAt] = selectedKey.split("\t");
    if (!startsAt || !endsAt) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/virtual-appointments/${encodeURIComponent(modalId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startsAt, endsAt, emailLocale }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(typeof data.error === "string" ? data.error : "No se pudo reprogramar.");
        return;
      }
      setModalId(null);
      setSlots(null);
      router.refresh();
    } catch {
      setSaveError("Error de red.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] italic text-2xl font-light text-warm-dark">
            Citas virtuales
          </h1>
          <p className="text-sm text-warm-gray-400 mt-1">
            Reservas pagadas desde la web o el área de cliente. Si configuras Google Calendar API, cada cita tiene su
            propio Meet; si no, se usa el enlace fijo de entorno. Puedes reprogramar citas futuras (pendiente o pagada)
            desde aquí; se envía correo al cliente y a Sandra con la nueva hora y un .ics actualizado.
          </p>
        </div>
        <input
          type="search"
          placeholder="Buscar por nombre, email o teléfono…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-72 rounded-xl border border-warm-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-warm-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-gray-100 text-left text-[10px] uppercase tracking-wider text-warm-gray-400">
                <th className="px-4 py-3 font-medium">Fecha y hora</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium min-w-[12rem]">Motivo</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Origen</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Meet</th>
                <th className="px-4 py-3 font-medium w-[7rem]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-warm-gray-400">
                    No hay citas.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-warm-gray-50 hover:bg-warm-gray-50/50">
                    <td className="px-4 py-3 text-warm-dark whitespace-nowrap">{formatLocal(a.starts_at)}</td>
                    <td className="px-4 py-3 text-warm-dark">{a.name}</td>
                    <td className="px-4 py-3 text-warm-gray-600 text-xs max-w-xs align-top">
                      <span className="line-clamp-3" title={a.reason || undefined}>
                        {a.reason?.trim() || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-warm-gray-500">
                      <div>{a.email}</div>
                      <div className="text-xs">{a.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-warm-gray-500">
                      {a.source === "client" ? "Área cliente" : "Web"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                          a.status === "paid"
                            ? "bg-green-50 text-green-700"
                            : a.status === "pending"
                              ? "bg-amber-50 text-amber-800"
                              : "bg-warm-gray-100 text-warm-gray-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.meet_link ? (
                        <a
                          href={a.meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rosa-400 hover:text-rosa-500 text-xs font-medium"
                        >
                          Abrir Meet
                        </a>
                      ) : (
                        <span className="text-warm-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {canReschedule(a) ? (
                        <button
                          type="button"
                          onClick={() => openModal(a.id)}
                          className="text-xs font-medium text-rosa-400 hover:text-rosa-500 underline-offset-2 hover:underline"
                        >
                          Reprogramar
                        </button>
                      ) : (
                        <span className="text-warm-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalId && modalRow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl border border-warm-gray-100 shadow-xl max-w-md w-full p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg text-warm-dark mb-1">Reprogramar cita</h2>
            <p className="text-sm text-warm-gray-500 mb-4">
              {modalRow.name} · {formatLocal(modalRow.starts_at)}
            </p>

            {slotsLoading ? (
              <p className="text-sm text-warm-gray-400">Cargando huecos…</p>
            ) : slotsError ? (
              <p className="text-sm text-red-600">{slotsError}</p>
            ) : slots && slots.length === 0 ? (
              <p className="text-sm text-warm-gray-500">No hay huecos libres en el horizonte configurado.</p>
            ) : slots && slots.length > 0 ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-warm-gray-400">Nuevo horario</span>
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-warm-gray-200 px-3 py-2 text-sm"
                  >
                    {slots.map((s) => (
                      <option key={`${s.startsAt}-${s.endsAt}`} value={`${s.startsAt}\t${s.endsAt}`}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-warm-gray-400">Idioma del correo al cliente</span>
                  <select
                    value={emailLocale}
                    onChange={(e) => setEmailLocale(e.target.value === "en" ? "en" : "es")}
                    className="mt-1 w-full rounded-xl border border-warm-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </div>
            ) : null}

            {saveError ? <p className="text-sm text-red-600 mt-3">{saveError}</p> : null}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-warm-gray-200 px-4 py-2 text-sm text-warm-dark hover:bg-warm-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={submitReschedule}
                disabled={saving || !selectedKey || !!slotsError || !slots?.length}
                className="rounded-xl bg-warm-dark text-white px-4 py-2 text-sm disabled:opacity-50"
              >
                {saving ? "Guardando…" : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatLocal(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Madrid",
    });
  } catch {
    return iso;
  }
}
