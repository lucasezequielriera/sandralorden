"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type {
  MediaKitSettings,
  MediaKitLocaleBlock,
  MediaKitCollabItem,
  MediaKitPricingItem,
} from "@/lib/media-kit-settings";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200";
const labelClass = "block text-sm font-medium text-warm-dark mb-1.5";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-warm-gray-100 p-6 space-y-4">
      <h3 className="font-[family-name:var(--font-display)] italic text-xl text-warm-dark">{title}</h3>
      {children}
    </section>
  );
}

function ListField({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="px-3 text-warm-gray-400 hover:text-red-500 cursor-pointer"
              aria-label="Eliminar"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="text-sm text-rosa-500 hover:text-rosa-600 cursor-pointer"
        >
          + Añadir línea
        </button>
      </div>
    </div>
  );
}

export default function MediaKitSettingsContent({ initialSettings }: { initialSettings: MediaKitSettings }) {
  const [settings, setSettings] = useState<MediaKitSettings>(initialSettings);
  const [localeTab, setLocaleTab] = useState<"es" | "en">("es");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const localeBlock = localeTab === "es" ? settings.es : settings.en;

  const updateLocale = (patch: Partial<MediaKitLocaleBlock>) => {
    setSettings((prev) => ({
      ...prev,
      [localeTab]: { ...prev[localeTab], ...patch },
    }));
  };

  const updateCollab = (items: MediaKitCollabItem[]) => updateLocale({ collabItems: items });
  const updatePricing = (items: MediaKitPricingItem[]) => updateLocale({ pricingItems: items });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/media-kit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hint ? `${data.error}\n\n${data.hint}` : data.error || "Error al guardar");
      setSettings(data.settings);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">
            Media Kit
          </h2>
          <p className="text-sm text-warm-gray-400 mt-1">
            Edita métricas, tarifas, bio y contenido visible en{" "}
            <Link href="/media-kit" className="text-rosa-500 hover:underline">/media-kit</Link>
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/media-kit/pdf?locale=es"
            download
            className="px-4 py-2 text-sm border border-warm-gray-200 rounded-full text-warm-gray-500 hover:border-rosa-200"
          >
            PDF ES
          </a>
          <a
            href="/api/media-kit/pdf?locale=en"
            download
            className="px-4 py-2 text-sm border border-warm-gray-200 rounded-full text-warm-gray-500 hover:border-rosa-200"
          >
            PDF EN
          </a>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl whitespace-pre-wrap">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-xl">Media kit guardado correctamente.</p>}

      <Section title="Contacto">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={settings.contact.email}
              onChange={(e) => setSettings((s) => ({ ...s, contact: { ...s.contact, email: e.target.value } }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input
              type="text"
              value={settings.contact.phone}
              onChange={(e) => setSettings((s) => ({ ...s, contact: { ...s.contact, phone: e.target.value } }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Instagram profesional (URL)</label>
            <input
              type="url"
              value={settings.contact.instagramPro}
              onChange={(e) => setSettings((s) => ({ ...s, contact: { ...s.contact, instagramPro: e.target.value } }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Instagram personal (URL)</label>
            <input
              type="url"
              value={settings.contact.instagramPersonal}
              onChange={(e) => setSettings((s) => ({ ...s, contact: { ...s.contact, instagramPersonal: e.target.value } }))}
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      <Section title="Cifras clave">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Clientes (ej. +1000)</label>
            <input
              type="text"
              value={settings.stats.clients}
              onChange={(e) => setSettings((s) => ({ ...s, stats: { ...s.stats, clients: e.target.value } }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Años de experiencia (ej. 10+)</label>
            <input
              type="text"
              value={settings.stats.years}
              onChange={(e) => setSettings((s) => ({ ...s, stats: { ...s.stats, years: e.target.value } }))}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs text-warm-gray-400">Prensa y medios se calculan automáticamente desde la sección Prensa del sitio.</p>
      </Section>

      <Section title="Métricas de redes">
        <div className="grid sm:grid-cols-2 gap-4">
          {(
            [
              ["igFitFollowers", "IG @sandralordenfit — seguidores"],
              ["igPersonalFollowers", "IG @sandralorden — seguidores"],
              ["igEngagement", "Engagement (ej. 3,2%)"],
              ["igReach", "Alcance mensual"],
              ["igImpressions", "Impresiones"],
              ["tiktokFollowers", "TikTok"],
              ["linkedinFollowers", "LinkedIn"],
              ["youtubeSubscribers", "YouTube"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="text"
                value={settings.metrics[key]}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    metrics: { ...s.metrics, [key]: e.target.value },
                  }))
                }
                className={inputClass}
                placeholder="Vacío = «bajo solicitud» en la web"
              />
            </div>
          ))}
        </div>
      </Section>

      <div className="flex gap-2">
        {(["es", "en"] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setLocaleTab(loc)}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
              localeTab === loc ? "bg-rosa-50 text-rosa-500" : "bg-white border border-warm-gray-100 text-warm-gray-400"
            }`}
          >
            {loc === "es" ? "Contenido ES" : "Contenido EN"}
          </button>
        ))}
      </div>

      <Section title={`Bio (${localeTab.toUpperCase()})`}>
        <div>
          <label className={labelClass}>Párrafo 1</label>
          <textarea
            rows={4}
            value={localeBlock.bioParagraph1}
            onChange={(e) => updateLocale({ bioParagraph1: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Párrafo 2</label>
          <textarea
            rows={4}
            value={localeBlock.bioParagraph2}
            onChange={(e) => updateLocale({ bioParagraph2: e.target.value })}
            className={inputClass}
          />
        </div>
      </Section>

      <Section title={`Audiencia (${localeTab.toUpperCase()})`}>
        <ListField
          label="Puntos de audiencia"
          items={localeBlock.audienceBullets}
          onChange={(items) => updateLocale({ audienceBullets: items })}
        />
      </Section>

      <Section title={`Expertise (${localeTab.toUpperCase()})`}>
        <ListField
          label="Temas"
          items={localeBlock.expertiseItems}
          onChange={(items) => updateLocale({ expertiseItems: items })}
        />
      </Section>

      <Section title={`Tarifas de colaboración (${localeTab.toUpperCase()})`}>
        <label className="flex items-center gap-2 text-sm text-warm-dark mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showPricing}
            onChange={(e) => setSettings((s) => ({ ...s, showPricing: e.target.checked }))}
            className="rounded border-warm-gray-300"
          />
          Mostrar sección de tarifas en la web y PDF
        </label>
        <div className="space-y-3">
          {localeBlock.pricingItems.map((item, i) => (
            <div key={i} className="grid sm:grid-cols-[1fr_120px_1fr_auto] gap-2 items-start">
              <input
                type="text"
                value={item.format}
                placeholder="Formato"
                onChange={(e) => {
                  const next = [...localeBlock.pricingItems];
                  next[i] = { ...next[i], format: e.target.value };
                  updatePricing(next);
                }}
                className={inputClass}
              />
              <input
                type="text"
                value={item.price}
                placeholder="Tarifa"
                onChange={(e) => {
                  const next = [...localeBlock.pricingItems];
                  next[i] = { ...next[i], price: e.target.value };
                  updatePricing(next);
                }}
                className={inputClass}
              />
              <input
                type="text"
                value={item.notes}
                placeholder="Notas"
                onChange={(e) => {
                  const next = [...localeBlock.pricingItems];
                  next[i] = { ...next[i], notes: e.target.value };
                  updatePricing(next);
                }}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => updatePricing(localeBlock.pricingItems.filter((_, idx) => idx !== i))}
                className="px-2 text-warm-gray-400 hover:text-red-500 cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => updatePricing([...localeBlock.pricingItems, { format: "", price: "", notes: "" }])}
            className="text-sm text-rosa-500 hover:text-rosa-600 cursor-pointer"
          >
            + Añadir tarifa
          </button>
        </div>
        <div>
          <label className={labelClass}>Nota sobre tarifas</label>
          <textarea
            rows={2}
            value={localeBlock.pricingNote}
            onChange={(e) => updateLocale({ pricingNote: e.target.value })}
            className={inputClass}
          />
        </div>
      </Section>

      <Section title={`Colaboraciones (${localeTab.toUpperCase()})`}>
        <div className="space-y-4">
          {localeBlock.collabItems.map((item, i) => (
            <div key={i} className="border border-warm-gray-100 rounded-xl p-4 space-y-2">
              <input
                type="text"
                value={item.title}
                placeholder="Título"
                onChange={(e) => {
                  const next = [...localeBlock.collabItems];
                  next[i] = { ...next[i], title: e.target.value };
                  updateCollab(next);
                }}
                className={inputClass}
              />
              <textarea
                rows={2}
                value={item.description}
                placeholder="Descripción"
                onChange={(e) => {
                  const next = [...localeBlock.collabItems];
                  next[i] = { ...next[i], description: e.target.value };
                  updateCollab(next);
                }}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => updateCollab(localeBlock.collabItems.filter((_, idx) => idx !== i))}
                className="text-sm text-red-500 cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => updateCollab([...localeBlock.collabItems, { title: "", description: "" }])}
            className="text-sm text-rosa-500 hover:text-rosa-600 cursor-pointer"
          >
            + Añadir formato
          </button>
        </div>
        <div>
          <label className={labelClass}>Nota de colaboraciones</label>
          <textarea
            rows={2}
            value={localeBlock.collabNote}
            onChange={(e) => updateLocale({ collabNote: e.target.value })}
            className={inputClass}
          />
        </div>
      </Section>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-3 text-sm font-medium text-white bg-warm-dark rounded-full hover:bg-warm-gray-500 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Guardando…" : "Guardar media kit"}
        </button>
      </div>
    </div>
  );
}
