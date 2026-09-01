"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import AnimatedSection from "./AnimatedSection";
import { PRESS_ITEMS, PRESS_TYPE_I18N_KEYS, MEDIA_LOGOS } from "@/lib/press-items";

export default function Press() {
  const t = useTranslations("Press");
  const locale = useLocale();
  return (
    <section id="prensa" className="py-20 sm:py-28 md:py-36 bg-white" aria-labelledby="press-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
          <AnimatedSection>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              {t("sectionLabel")}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 id="press-heading" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              {t("titleStart")}{" "}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">{t("titleHighlight")}</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-warm-gray-400 leading-relaxed">
              {t("description")}
            </p>
          </AnimatedSection>
        </div>

        {/* Featured media logos */}
        <AnimatedSection delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 mb-12 sm:mb-16">
            {MEDIA_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={128}
                  height={48}
                  className="h-8 sm:h-10 md:h-12 w-auto max-w-[8rem] object-contain"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Press Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PRESS_ITEMS.map((item, i) => (
            <AnimatedSection key={item.url} delay={i * 0.06}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col bg-gradient-to-br from-rosa-50/50 to-marron-50/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 border border-warm-gray-100/30 h-full"
              >
                {/* Type badge + date */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="inline-block text-[10px] sm:text-xs uppercase tracking-widest text-marron-400 font-medium">
                    {t(PRESS_TYPE_I18N_KEYS[item.type])}
                  </span>
                  <span className="text-[10px] sm:text-xs text-warm-gray-300">
                    {new Date(item.date).toLocaleDateString(locale, { month: "short", year: "numeric" })}
                  </span>
                </div>

                {/* Magazine name */}
                <h3 className="font-[family-name:var(--font-display)] italic text-base sm:text-lg font-light text-warm-dark mb-2">
                  {item.name}
                </h3>

                {/* Article title */}
                <p className="text-warm-gray-400 text-xs sm:text-sm leading-relaxed flex-1">
                  {item.title}
                </p>

                {/* Read link */}
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-rosa-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {t("readArticle")}
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
