"use client";

import { useLocale, useTranslations } from "next-intl";

export default function MediaKitDownloadButton({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("MediaKit");

  return (
    <a
      href={`/api/media-kit/pdf?locale=${locale}`}
      download
      className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-warm-dark border border-warm-gray-200 rounded-full hover:border-rosa-300 hover:text-rosa-500 transition-colors ${className}`}
    >
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      {t("ctaDownloadPdf")}
    </a>
  );
}
