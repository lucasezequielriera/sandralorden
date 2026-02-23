"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getCookieConsent } from "./CookieBanner";

export default function ConditionalAnalytics() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(getCookieConsent());

    const handler = (e: Event) => {
      setConsent((e as CustomEvent).detail as string);
    };
    window.addEventListener("cookie-consent-change", handler);
    return () => window.removeEventListener("cookie-consent-change", handler);
  }, []);

  if (consent !== "all") return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
