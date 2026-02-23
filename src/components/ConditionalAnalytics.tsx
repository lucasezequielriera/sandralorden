"use client";

import { useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getCookieConsent } from "./CookieBanner";

let currentConsent: string | null = null;

function subscribe(cb: () => void) {
  const handler = (e: Event) => {
    currentConsent = (e as CustomEvent).detail as string;
    cb();
  };
  window.addEventListener("cookie-consent-change", handler);
  return () => window.removeEventListener("cookie-consent-change", handler);
}

function getSnapshot() {
  if (currentConsent === null) currentConsent = getCookieConsent();
  return currentConsent;
}

function getServerSnapshot() {
  return null;
}

export default function ConditionalAnalytics() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (consent !== "all") return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
