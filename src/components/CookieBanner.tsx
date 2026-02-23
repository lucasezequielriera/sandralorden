"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function setCookieConsent(value: string) {
  localStorage.setItem("cookie-consent", value);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `cookie-consent=${value}; max-age=31536000; path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: value }));
}

export function getCookieConsent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cookie-consent");
}

export default function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => setVisible(true), []);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("open-cookie-settings", show);
    return () => window.removeEventListener("open-cookie-settings", show);
  }, [show]);

  const accept = () => {
    setCookieConsent("all");
    setVisible(false);
  };

  const reject = () => {
    setCookieConsent("essential");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={t("message")}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[60]"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-warm-gray-100/50 p-5 sm:p-6">
            <p className="text-sm text-warm-gray-500 leading-relaxed mb-4">
              {t("message")}{" "}
              <Link href="/cookies" className="text-rosa-400 underline underline-offset-2 hover:text-rosa-500 transition-colors">
                {t("moreInfo")}
              </Link>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={accept}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 transition-colors cursor-pointer"
              >
                {t("accept")}
              </button>
              <button
                onClick={reject}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-warm-gray-400 bg-warm-gray-100/50 rounded-xl hover:bg-warm-gray-100 transition-colors cursor-pointer"
              >
                {t("essentialOnly")}
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
