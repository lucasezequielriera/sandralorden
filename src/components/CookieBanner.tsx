"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "all");
    document.cookie = "cookie-consent=all; max-age=31536000; path=/; SameSite=Lax";
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie-consent", "essential");
    document.cookie = "cookie-consent=essential; max-age=31536000; path=/; SameSite=Lax";
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[60]"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-warm-gray-100/50 p-5 sm:p-6">
            <p className="text-sm text-warm-gray-500 leading-relaxed mb-4">
              Usamos cookies para mejorar tu experiencia.{" "}
              <a href="/cookies" className="text-rosa-400 underline underline-offset-2 hover:text-rosa-500 transition-colors">
                Más info
              </a>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={accept}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 transition-colors cursor-pointer"
              >
                Aceptar
              </button>
              <button
                onClick={reject}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-warm-gray-400 bg-warm-gray-100/50 rounded-xl hover:bg-warm-gray-100 transition-colors cursor-pointer"
              >
                Solo esenciales
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
