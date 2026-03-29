"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function ToastProvider() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <Toaster
      position={isMobile ? "bottom-center" : "top-right"}
      theme="light"
      closeButton
      visibleToasts={4}
      offset={16}
      mobileOffset={12}
      toastOptions={{
        className: "sandra-toast",
        style: {
          fontSize: "14px",
          background: "var(--color-warm-white)",
          color: "var(--color-warm-dark)",
          border: "1px solid var(--color-warm-gray-200)",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(61, 44, 44, 0.12)",
        },
      }}
      icons={{
        success: "✓",
        error: "!",
        info: "i",
        warning: "!",
      }}
    />
  );
}

