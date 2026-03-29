"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

export type VirtualPrefilled = {
  id: string;
  name: string;
  email: string;
  phone: string;
} | null;

export default function VirtualAppointmentBooking({ prefilled }: { prefilled: VirtualPrefilled }) {
  const t = useTranslations("VirtualAppointment");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const sessionIdFromStripe = searchParams.get("session_id");
  const [slots, setSlots] = useState<{ startsAt: string; endsAt: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [name, setName] = useState(prefilled?.name ?? "");
  const [email, setEmail] = useState(prefilled?.email ?? "");
  const [phone, setPhone] = useState(prefilled?.phone ?? "");
  const [reason, setReason] = useState("");
  const [redirectSeconds, setRedirectSeconds] = useState(10);

  const isSuccess = checkout === "success";

  useEffect(() => {
    if (checkout !== "success" || !sessionIdFromStripe) return;
    const dedupeKey = `va_confirm_done:${sessionIdFromStripe}`;
    let cancelled = false;

    void (async () => {
      try {
        const already =
          typeof sessionStorage !== "undefined" && sessionStorage.getItem(dedupeKey);
        if (!already) {
          if (typeof sessionStorage !== "undefined") sessionStorage.setItem(dedupeKey, "1");
          await fetch("/api/checkout/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: sessionIdFromStripe }),
          });
        }
      } catch {
        /* webhook o confirm pueden haberlo hecho ya */
      }
      if (!cancelled) {
        router.replace({ pathname: "/cita-virtual", query: { checkout: "success" } });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [checkout, sessionIdFromStripe, router]);

  useEffect(() => {
    if (checkout === "success") {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch("/api/virtual-appointments/slots")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setSlots(Array.isArray(d.slots) ? d.slots : []);
      })
      .catch(() => {
        if (!cancelled) setError(t("loadError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [checkout, t]);

  useEffect(() => {
    if (checkout !== "success") return;
    let s = 10;
    setRedirectSeconds(10);
    const id = setInterval(() => {
      s -= 1;
      setRedirectSeconds(s);
      if (s <= 0) {
        clearInterval(id);
        router.push("/");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [checkout, router]);

  const selected = slots.find((s) => `${s.startsAt}|${s.endsAt}` === selectedKey) ?? null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) {
      setError(t("pickSlotError"));
      return;
    }
    if (!reason.trim()) {
      setError(t("reasonRequired"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/virtual-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startsAt: selected.startsAt,
          endsAt: selected.endsAt,
          name,
          email,
          phone,
          reason,
          clientId: prefilled?.id,
          source: prefilled ? "client" : "home",
          locale,
        }),
      });
      const data = (await res.json()) as { error?: string; url?: string };
      if (!res.ok) throw new Error(data.error || t("error"));
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-crema py-12 sm:py-20 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto text-center">
          <div
            className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#A8D5BA]/25 border border-[#A8D5BA]/40"
            aria-hidden
          >
            <svg
              className="h-10 w-10 text-[#4A7C59]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-marron-400 font-medium mb-3">
            {t("eyebrow")}
          </p>
          <h1 className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-5 leading-tight">
            {t("successTitle")}
          </h1>
          <p className="text-base sm:text-lg text-warm-gray-600 leading-relaxed mb-6 px-1">
            {t("successBody")}
          </p>
          <p className="text-sm text-warm-gray-500 leading-relaxed mb-10 px-1 border-t border-rosa-100/80 pt-6">
            {t("policy24h")}
          </p>
          <p className="text-sm text-warm-gray-400 mb-6 tabular-nums" aria-live="polite">
            {t("successRedirect", { seconds: Math.max(0, redirectSeconds) })}
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto min-w-[200px] rounded-full bg-warm-dark px-8 py-3.5 text-sm font-medium text-white hover:bg-warm-gray-500 transition-colors cursor-pointer"
          >
            {t("successGoHome")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crema py-10 sm:py-14 px-4">
      <div className="mx-auto max-w-lg">
        <p className="text-xs uppercase tracking-[0.25em] text-marron-400 font-medium mb-2 text-center">
          {t("eyebrow")}
        </p>
        <h1 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark text-center mb-3">
          {t("title")}
        </h1>
        <p className="text-sm text-warm-gray-500 text-center mb-8 leading-relaxed">{t("subtitle")}</p>

        {checkout === "cancelled" && (
          <p className="mb-6 rounded-2xl border border-warm-gray-200 bg-white px-4 py-3 text-sm text-warm-gray-500 text-center">
            {t("cancelled")}
          </p>
        )}

        {loading ? (
          <p className="text-center text-sm text-warm-gray-400">{t("loadingSlots")}</p>
        ) : slots.length === 0 ? (
          <p className="text-center text-sm text-warm-gray-500">{t("noSlots")}</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 bg-white rounded-3xl border border-warm-gray-100 p-5 sm:p-6 shadow-sm">
            <div>
              <label htmlFor="va-slot" className="block text-xs font-medium text-warm-gray-500 mb-1.5">
                {t("fieldSlot")}
              </label>
              <select
                id="va-slot"
                className="w-full rounded-xl border border-warm-gray-200 px-3 py-2.5 text-sm text-warm-dark bg-white"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                required
              >
                <option value="">{t("fieldSlotPlaceholder")}</option>
                {slots.map((s) => (
                  <option key={`${s.startsAt}|${s.endsAt}`} value={`${s.startsAt}|${s.endsAt}`}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="va-name" className="block text-xs font-medium text-warm-gray-500 mb-1.5">
                {t("fieldName")}
              </label>
              <input
                id="va-name"
                className="w-full rounded-xl border border-warm-gray-200 px-3 py-2.5 text-sm text-warm-dark"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="va-email" className="block text-xs font-medium text-warm-gray-500 mb-1.5">
                {t("fieldEmail")}
              </label>
              <input
                id="va-email"
                type="email"
                className="w-full rounded-xl border border-warm-gray-200 px-3 py-2.5 text-sm text-warm-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="va-phone" className="block text-xs font-medium text-warm-gray-500 mb-1.5">
                {t("fieldPhone")}
              </label>
              <input
                id="va-phone"
                type="tel"
                className="w-full rounded-xl border border-warm-gray-200 px-3 py-2.5 text-sm text-warm-dark"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="va-reason" className="block text-xs font-medium text-warm-gray-500 mb-1.5">
                {t("fieldReason")}
              </label>
              <textarea
                id="va-reason"
                rows={4}
                className="w-full rounded-xl border border-warm-gray-200 px-3 py-2.5 text-sm text-warm-dark resize-y min-h-[100px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                maxLength={2000}
                placeholder={t("fieldReasonPlaceholder")}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-warm-dark py-3.5 text-sm font-medium text-white hover:bg-warm-gray-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
            <p className="text-[11px] text-warm-gray-400 text-center leading-relaxed">{t("payNote")}</p>
            <p className="text-[11px] text-warm-gray-500 text-center leading-relaxed border-t border-warm-gray-100 pt-3 mt-1">
              {t("policy24h")}
            </p>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-warm-gray-400 hover:text-warm-dark transition-colors">
            {t("backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
