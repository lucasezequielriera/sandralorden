"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type Tab = "form" | "training" | "nutrition";

export default function ClientDashboardContent({
  clientName,
  intakePayload,
  trainingPlan,
  nutritionPlan,
  hasPaidInvoice,
}: {
  clientName: string;
  intakePayload: Record<string, unknown> | null;
  trainingPlan: { file_name: string; file_url: string; uploaded_at: string } | null;
  nutritionPlan: { file_name: string; file_url: string; uploaded_at: string } | null;
  hasPaidInvoice: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("form");
  const [pendingModal, setPendingModal] = useState<"training" | "nutrition" | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const entries = useMemo(() => Object.entries(intakePayload ?? {}), [intakePayload]);
  const trainingStatus = trainingPlan ? "listo" : hasPaidInvoice ? "en_elaboracion" : "pendiente_pago";
  const nutritionStatus = nutritionPlan ? "listo" : hasPaidInvoice ? "en_elaboracion" : "pendiente_pago";

  return (
    <main className="min-h-screen bg-[#FFFAF7] py-8 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] italic text-3xl font-light text-warm-dark">
              Hola, {clientName}
            </h1>
            <p className="text-sm text-warm-gray-400 mt-2">
              Este es tu panel personal para seguir tu proceso.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="shrink-0 self-start sm:self-auto inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-warm-gray-500 bg-white border border-warm-gray-200 rounded-xl hover:bg-warm-gray-50 hover:text-warm-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingOut ? "Cerrando…" : "Cerrar sesión"}
          </button>
        </div>

        <div className="inline-flex bg-white rounded-full p-1.5 border border-warm-gray-100 shadow-sm mb-6">
          <TabButton active={tab === "form"} onClick={() => setTab("form")} label="Formulario enviado" />
          <TabButton
            active={tab === "training"}
            onClick={() => {
              setTab("training");
              if (!trainingPlan) setPendingModal("training");
            }}
            label="Plan de entrenamiento"
          />
          <TabButton
            active={tab === "nutrition"}
            onClick={() => {
              setTab("nutrition");
              if (!nutritionPlan) setPendingModal("nutrition");
            }}
            label="Plan de nutrición"
          />
        </div>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <StatusCard
            title="Estado plan entrenamiento"
            status={trainingStatus}
            date={trainingPlan?.uploaded_at}
          />
          <StatusCard
            title="Estado plan nutrición"
            status={nutritionStatus}
            date={nutritionPlan?.uploaded_at}
          />
        </section>

        {tab === "form" && (
          <section className="bg-white rounded-3xl border border-warm-gray-100 p-5 sm:p-6">
            <h2 className="text-lg font-medium text-warm-dark mb-4">Tu formulario completo</h2>
            {entries.length === 0 ? (
              <p className="text-sm text-warm-gray-400">Aún no hay datos de formulario cargados.</p>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {entries.map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-warm-gray-100 bg-warm-gray-50 p-3">
                    <dt className="text-[11px] uppercase tracking-wide text-warm-gray-400 mb-1">{key}</dt>
                    <dd className="text-sm text-warm-dark whitespace-pre-wrap break-words">
                      {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        )}

        {tab === "training" && (
          <section className="bg-white rounded-3xl border border-warm-gray-100 p-5 sm:p-6">
            <h2 className="text-lg font-medium text-warm-dark mb-2">Plan de entrenamiento</h2>
            {trainingPlan ? (
              <a
                href={trainingPlan.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warm-dark text-white text-sm hover:bg-warm-gray-500 transition-colors"
              >
                Descargar {trainingPlan.file_name.replace(/^PLAN_TRAINING__/, "")}
              </a>
            ) : (
              <p className="text-sm text-warm-gray-400">
                Tu plan de entrenamiento estará disponible aquí en cuanto Sandra lo publique.
              </p>
            )}
          </section>
        )}

        {tab === "nutrition" && (
          <section className="bg-white rounded-3xl border border-warm-gray-100 p-5 sm:p-6">
            <h2 className="text-lg font-medium text-warm-dark mb-2">Plan de nutrición</h2>
            {nutritionPlan ? (
              <a
                href={nutritionPlan.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warm-dark text-white text-sm hover:bg-warm-gray-500 transition-colors"
              >
                Descargar {nutritionPlan.file_name.replace(/^PLAN_NUTRITION__/, "")}
              </a>
            ) : (
              <p className="text-sm text-warm-gray-400">
                Tu plan de nutrición estará disponible aquí en cuanto Sandra lo publique.
              </p>
            )}
          </section>
        )}
      </div>
      {pendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Plan en preparación">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => setPendingModal(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-warm-gray-100 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-medium text-warm-dark mb-2">
              Sandra está creando tu {pendingModal === "training" ? "plan de entrenamiento" : "plan de nutrición"}
            </h3>
            <p className="text-sm text-warm-gray-400 mb-5">
              Te avisaremos por email apenas esté listo para descargar en tu panel.
            </p>
            <button
              type="button"
              onClick={() => setPendingModal(null)}
              className="w-full rounded-xl bg-warm-dark px-4 py-2.5 text-sm font-medium text-white hover:bg-warm-gray-500 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function StatusCard({
  title,
  status,
  date,
}: {
  title: string;
  status: "listo" | "en_elaboracion" | "pendiente_pago";
  date?: string;
}) {
  const meta =
    status === "listo"
      ? { label: "Listo", className: "bg-green-100 text-green-700" }
      : status === "en_elaboracion"
      ? { label: "En elaboración", className: "bg-amber-100 text-amber-700" }
      : { label: "Pendiente de pago", className: "bg-warm-gray-100 text-warm-gray-500" };

  return (
    <div className="rounded-2xl border border-warm-gray-100 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-warm-gray-400 mb-2">{title}</p>
      <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${meta.className}`}>
        {meta.label}
      </span>
      {date && (
        <p className="text-xs text-warm-gray-400 mt-2">
          Actualizado: {new Date(date).toLocaleDateString("es-ES")}
        </p>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
        active ? "bg-warm-dark text-white" : "text-warm-gray-500 hover:text-warm-dark"
      }`}
    >
      {label}
    </button>
  );
}

