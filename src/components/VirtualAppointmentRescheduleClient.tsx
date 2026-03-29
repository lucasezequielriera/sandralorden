"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type SessionOk = {
  name: string;
  startsAt: string;
  endsAt: string;
  locale: "es" | "en";
  policyOk: boolean;
};

export default function VirtualAppointmentRescheduleClient() {
  const t = useTranslations("VirtualAppointmentReschedule");
  const searchParams = useSearchParams();
  const token = searchParams.get("t")?.trim() ?? "";

  const [session, setSession] = useState<SessionOk | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ startsAt: string; endsAt: string; label: string }[]>([]);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setLoadError(t("invalidLink"));
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/virtual-appointments/reschedule/session?t=${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (!cancelled) setLoadError(typeof data.error === "string" ? data.error : t("loadError"));
          return;
        }
        if (!cancelled) {
          setSession({
            name: data.name,
            startsAt: data.startsAt,
            endsAt: data.endsAt,
            locale: data.locale === "en" ? "en" : "es",
            policyOk: Boolean(data.policyOk),
          });
        }

        if (!cancelled && data.policyOk) {
          const sr = await fetch(`/api/virtual-appointments/reschedule/slots?t=${encodeURIComponent(token)}`);
          const sd = await sr.json().catch(() => ({}));
          if (!sr.ok) {
            setSlotsError(typeof sd.error === "string" ? sd.error : t("slotsError"));
          } else {
            const list = Array.isArray(sd.slots) ? sd.slots : [];
            setSlots(list);
            if (list.length > 0) {
              setSelectedKey(`${list[0].startsAt}\t${list[0].endsAt}`);
            }
          }
        }
      } catch {
        if (!cancelled) setLoadError(t("loadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, t]);

  async function submit() {
    if (!token || !selectedKey) return;
    const [startsAt, endsAt] = selectedKey.split("\t");
    if (!startsAt || !endsAt) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/virtual-appointments/reschedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, startsAt, endsAt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(typeof data.error === "string" ? data.error : t("saveError"));
        return;
      }
      setDone(true);
    } catch {
      setSaveError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-warm-gray-500">{t("loading")}</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-warm-dark mb-3">{t("titleError")}</h1>
        <p className="text-warm-gray-600">{loadError}</p>
        <Link href="/" className="inline-block mt-8 text-rosa-400 hover:text-rosa-500 font-medium">
          {t("backHome")}
        </Link>
      </div>
    );
  }

  if (session && !session.policyOk) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-warm-dark mb-3">{t("titleDeadline")}</h1>
        <p className="text-warm-gray-600">{t("deadlineBody")}</p>
        <Link href="/" className="inline-block mt-8 text-rosa-400 hover:text-rosa-500 font-medium">
          {t("backHome")}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-warm-dark mb-3">{t("successTitle")}</h1>
        <p className="text-warm-gray-600">{t("successBody")}</p>
        <Link href="/" className="inline-block mt-8 text-rosa-400 hover:text-rosa-500 font-medium">
          {t("backHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <p className="text-xs uppercase tracking-widest text-rosa-400 mb-2">{t("eyebrow")}</p>
      <h1 className="font-[family-name:var(--font-display)] italic text-3xl font-light text-warm-dark mb-2">
        {t("title")}
      </h1>
      {session && (
        <p className="text-warm-gray-600 text-sm mb-6">
          {t("greeting", { name: session.name })}
        </p>
      )}

      {slotsError ? (
        <p className="text-red-600 text-sm mb-4">{slotsError}</p>
      ) : slots.length === 0 ? (
        <p className="text-warm-gray-500 mb-6">{t("noSlots")}</p>
      ) : (
        <div className="space-y-4">
          <label className="block">
            <span className="text-warm-gray-500 text-sm">{t("fieldSlot")}</span>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="mt-1 w-full rounded-xl border border-warm-gray-200 px-3 py-3 text-warm-dark bg-white"
            >
              {slots.map((s) => (
                <option key={`${s.startsAt}-${s.endsAt}`} value={`${s.startsAt}\t${s.endsAt}`}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          {saveError ? <p className="text-red-600 text-sm">{saveError}</p> : null}
          <button
            type="button"
            onClick={submit}
            disabled={saving || !selectedKey}
            className="w-full rounded-full bg-warm-dark text-white py-3 text-sm font-medium disabled:opacity-50"
          >
            {saving ? t("saving") : t("submit")}
          </button>
        </div>
      )}

      <p className="text-xs text-warm-gray-400 mt-8">{t("policyNote")}</p>
    </div>
  );
}
