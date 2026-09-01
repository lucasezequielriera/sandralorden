"use client";

import { useEffect, useCallback, useTransition } from "react";
import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { PREMIUM_90_TOTAL_EUR } from "@/lib/premium-90-invoices";
import {
  LANDING_COVERAGE_HIGHLIGHTS,
  LANDING_MEDIA_LOGOS,
  LANDING_TV_FEATURE,
  PRESS_TYPE_KEYS,
} from "@/lib/landing-media";

const FORM_LINK = {
  pathname: "/formulario" as const,
  query: { program: "premium-90-dias" },
};

function trackFunnel(eventName: string, locale: string) {
  void fetch("/api/funnel-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      stage: "landing_premium",
      planType: "premium_90d",
      locale,
    }),
    keepalive: true,
  });
}

export default function PremiumLanding() {
  const t = useTranslations("Landing");
  const tNav = useTranslations("Navigation");
  const tPress = useTranslations("Press");
  const tAbout = useTranslations("About");
  const tTestimonials = useTranslations("Testimonials");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isLocalePending, startLocaleTransition] = useTransition();
  const reduceMotion = useReducedMotion();
  const perMonth = Math.round(PREMIUM_90_TOTAL_EUR / 3);
  const otherLocale = locale === "es" ? "en" : "es";

  const switchLocale = useCallback(() => {
    startLocaleTransition(() => {
      router.replace(pathname, { locale: otherLocale });
    });
  }, [pathname, router, otherLocale]);

  useEffect(() => {
    trackFunnel("landing_premium_view", locale);
  }, [locale]);

  const onCta = useCallback(() => {
    trackFunnel("landing_premium_cta", locale);
  }, [locale]);

  const fade = reduceMotion
    ? { initial: false, animate: {} }
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" } };

  const includes = [t("include1"), t("include2"), t("include3"), t("include4"), t("include5"), t("include6")];

  const studyCards = [
    { title: tAbout("credTitle1"), desc: tAbout("credDesc1") },
    { title: tAbout("credTitle2"), desc: tAbout("credDesc2") },
    { title: tAbout("credTitle3"), desc: tAbout("credDesc3") },
    { title: tAbout("credTitle4"), desc: tAbout("credDesc4") },
  ];

  return (
    <div className="min-h-screen bg-crema text-warm-dark pb-28 sm:pb-8">
      <header className="sticky top-0 z-50 border-b border-warm-gray-200/60 bg-crema/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="text-left min-w-0">
            <p className="font-[family-name:var(--font-display)] text-lg italic text-warm-dark leading-tight">{t("headerBrand")}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-marron-400">{t("headerSubtitle")}</p>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={switchLocale}
              disabled={isLocalePending}
              className="text-xs font-medium text-warm-gray-400 hover:text-warm-dark px-2 py-1.5 rounded-lg border border-transparent hover:border-warm-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
              aria-label={tNav("ariaLangSwitch")}
            >
              {t("navLang")}
            </button>
            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-medium text-warm-gray-500 hover:text-warm-dark px-3 py-1.5 rounded-full border border-warm-gray-200/80 hover:bg-white transition-colors"
            >
              {t("navFullSite")}
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden px-4 pt-10 pb-14 sm:px-6 sm:pt-14 sm:pb-20">
          <div
            className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-rosa-200/35 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-marron-200/25 blur-3xl"
            aria-hidden
          />

          <div className="mx-auto max-w-5xl">
            <m.p
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs uppercase tracking-[0.28em] text-marron-400 font-medium mb-4"
            >
              {t("heroEyebrow")}
            </m.p>
            <m.h1
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-[family-name:var(--font-display)] text-center text-3xl sm:text-5xl md:text-[3.25rem] font-light italic leading-[1.12] text-warm-dark max-w-3xl mx-auto"
            >
              {t("heroTitleBefore")}{" "}
              <span className="text-rosa-500">{t("heroTitleHighlight")}</span>{" "}
              {t("heroTitleAfter")}
            </m.h1>
            <m.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-6 text-center text-base sm:text-lg text-warm-gray-500 max-w-2xl mx-auto leading-relaxed"
            >
              {t("heroSub")}
            </m.p>

            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                href={FORM_LINK}
                onClick={onCta}
                className="inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center rounded-full bg-warm-dark px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-warm-dark/15 hover:bg-warm-gray-500 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                {t("ctaPrimary")}
              </Link>
            </m.div>

            <m.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto"
            >
              {[
                { v: t("statClients"), l: t("statClientsLabel") },
                { v: t("statYears"), l: t("statYearsLabel") },
                { v: t("statFormat"), l: t("statFormatLabel") },
              ].map((s) => (
                <div key={s.l} className="text-center rounded-2xl bg-white/70 border border-warm-gray-100 px-2 py-4 sm:py-5">
                  <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl italic text-warm-dark">{s.v}</p>
                  <p className="text-[10px] sm:text-xs text-warm-gray-400 mt-1 leading-snug">{s.l}</p>
                </div>
              ))}
            </m.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 sm:py-16 bg-white border-b border-warm-gray-100" aria-labelledby="landing-authority">
          <div className="mx-auto max-w-5xl">
            <m.div {...fade} transition={{ duration: 0.45 }} className="text-center max-w-3xl mx-auto mb-10">
              <h2 id="landing-authority" className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-light italic text-warm-dark mb-4 leading-tight">
                {t("authorityTitle")}
              </h2>
              <p className="text-warm-gray-500 text-sm sm:text-base leading-relaxed">{t("authoritySub")}</p>
              <p className="mt-6 text-sm sm:text-base font-medium text-rosa-500 tracking-wide">{t("resultsLine")}</p>
            </m.div>
            <m.div {...fade} transition={{ duration: 0.5, delay: 0.05 }}>
              <p className="text-center text-xs uppercase tracking-[0.25em] text-marron-400 font-medium mb-2">
                {t("mediaSectionTitle")}
              </p>
              <p className="text-center text-sm text-warm-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                {t("mediaSectionSub")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14 sm:gap-y-10">
                {LANDING_MEDIA_LOGOS.map((logo) => (
                  <div
                    key={logo.name}
                    className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={120}
                      height={44}
                      className="h-7 sm:h-9 w-auto max-w-[6.5rem] sm:max-w-[7.5rem] object-contain"
                    />
                  </div>
                ))}
              </div>
            </m.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 sm:py-20 bg-gradient-to-b from-rosa-50/40 to-crema border-b border-warm-gray-100/80" aria-labelledby="landing-studies">
          <div className="mx-auto max-w-5xl">
            <m.div {...fade} className="text-center max-w-2xl mx-auto mb-10">
              <h2 id="landing-studies" className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-light italic text-warm-dark mb-3">
                {t("studiesSectionTitle")}
              </h2>
              <p className="text-sm sm:text-base text-warm-gray-500 leading-relaxed">{t("studiesSectionSub")}</p>
            </m.div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              {studyCards.map((card, i) => (
                <m.div
                  key={card.title}
                  {...fade}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-2xl border border-warm-gray-100 bg-white/90 p-5 sm:p-6 shadow-sm"
                >
                  <p className="font-[family-name:var(--font-display)] text-lg italic text-warm-dark mb-1">{card.title}</p>
                  <p className="text-sm text-warm-gray-500 leading-relaxed">{card.desc}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 sm:py-20 bg-gradient-to-b from-white/40 to-crema border-y border-warm-gray-100/80">
          <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <m.div {...fade} transition={{ duration: 0.5 }} className="order-2 md:order-1">
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-light italic text-warm-dark mb-4">
                {t("sectionTransformTitle")}
              </h2>
              <p className="text-warm-gray-500 leading-relaxed text-sm sm:text-base">{t("sectionTransformBody")}</p>
            </m.div>
            <m.div
              {...fade}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="order-1 md:order-2 relative aspect-[4/5] max-h-[440px] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl shadow-rosa-200/20 border border-warm-gray-100"
            >
              <Image
                src="/images/IMG_1902.jpg"
                alt={t("imageAlt")}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </m.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <m.h2
              {...fade}
              transition={{ duration: 0.45 }}
              className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-light italic text-center text-warm-dark mb-10"
            >
              {t("sectionIncludesTitle")}
            </m.h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {includes.map((text, i) => (
                <m.div
                  key={i}
                  {...fade}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="flex gap-3 rounded-2xl border border-warm-gray-100 bg-white/80 p-4 sm:p-5"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rosa-100 text-rosa-500 text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-warm-gray-500 leading-relaxed">{text}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 sm:py-20 bg-warm-dark text-white" aria-labelledby="landing-spotlight">
          <div className="mx-auto max-w-5xl">
            <m.div {...fade} className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-xs uppercase tracking-[0.28em] text-white/50 font-medium mb-3">{t("spotlightKicker")}</p>
              <h2 id="landing-spotlight" className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-light italic text-white mb-3">
                {t("spotlightSectionTitle")}
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">{t("spotlightSectionSub")}</p>
            </m.div>

            <m.a
              href={LANDING_TV_FEATURE.url}
              target="_blank"
              rel="noopener noreferrer"
              {...fade}
              className="mb-10 block rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8 hover:bg-white/10 hover:border-rosa-300/40 transition-all group"
            >
              <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-rosa-300 font-semibold mb-2">
                {t("tvBadge")}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl italic text-white mb-2 group-hover:text-rosa-100 transition-colors">
                {t("tvTitle")}
              </h3>
              <p className="text-sm text-white/75 leading-relaxed mb-4">{t("tvBody")}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-rosa-300">
                {t("coverageRead")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </span>
            </m.a>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {LANDING_COVERAGE_HIGHLIGHTS.map((item, i) => (
                <m.a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...fade}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 hover:bg-white/10 hover:border-white/20 transition-all group h-full flex flex-col"
                >
                  <span className="text-[10px] uppercase tracking-widest text-rosa-300/90 font-medium mb-2">
                    {tPress(PRESS_TYPE_KEYS[item.type])}
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] italic text-base text-white mb-3">{item.outlet}</h3>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-white/80 group-hover:text-rosa-200">
                    {t("coverageRead")}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </span>
                </m.a>
              ))}
            </div>

            <m.div {...fade} className="mt-10 text-center">
              <Link
                href={{ pathname: "/", hash: "prensa" }}
                className="inline-flex text-sm font-medium text-rosa-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                {t("morePressCta")}
              </Link>
            </m.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 sm:py-20 bg-white border-b border-warm-gray-100">
          <div className="mx-auto max-w-3xl">
            <m.p {...fade} className="text-center text-xs uppercase tracking-[0.25em] text-marron-400 font-medium mb-4">
              {t("testimonialEyebrow")}
            </m.p>
            <m.blockquote {...fade} className="text-center">
              <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl md:text-[1.65rem] font-light italic text-warm-dark leading-snug mb-6">
                &ldquo;{tTestimonials("t1Text")}&rdquo;
              </p>
              <footer className="text-sm text-warm-gray-500">
                <cite className="not-italic font-medium text-warm-dark">{tTestimonials("t1Name")}</cite>
                <span className="text-warm-gray-400"> · {tTestimonials("t1Service")}</span>
              </footer>
            </m.blockquote>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 sm:py-20 bg-marron-50/50 border-y border-marron-100/60">
          <div className="mx-auto max-w-5xl">
            <m.h2
              {...fade}
              className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-light italic text-center text-warm-dark mb-12"
            >
              {t("sectionStepsTitle")}
            </m.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: t("step1Title"), desc: t("step1Desc") },
                { title: t("step2Title"), desc: t("step2Desc") },
                { title: t("step3Title"), desc: t("step3Desc") },
              ].map((step, i) => (
                <m.div key={step.title} {...fade} transition={{ duration: 0.45, delay: i * 0.06 }} className="text-center md:text-left">
                  <div className="mx-auto md:mx-0 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-warm-dark text-white font-[family-name:var(--font-display)] text-xl italic">
                    {i + 1}
                  </div>
                  <h3 className="font-medium text-warm-dark mb-2">{step.title}</h3>
                  <p className="text-sm text-warm-gray-500 leading-relaxed">{step.desc}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 sm:py-20">
          <div className="mx-auto max-w-lg">
            <m.div
              {...fade}
              className="rounded-3xl border-2 border-rosa-200 bg-gradient-to-br from-white to-rosa-50/80 p-8 sm:p-10 text-center shadow-lg shadow-rosa-100/40"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-rosa-400 font-medium mb-2">{t("priceBadge")}</p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl italic text-warm-dark mb-4">{t("priceTitle")}</h2>
              <p className="text-4xl sm:text-5xl font-light text-warm-dark mb-2">
                {PREMIUM_90_TOTAL_EUR} €
              </p>
              <p className="text-sm text-warm-gray-500 leading-relaxed mb-8">
                {t("priceNote", { total: PREMIUM_90_TOTAL_EUR, perMonth })}
              </p>
              <Link
                href={FORM_LINK}
                onClick={onCta}
                className="inline-flex w-full min-h-[52px] items-center justify-center rounded-full bg-warm-dark px-6 py-3.5 text-sm font-semibold text-white hover:bg-warm-gray-500 transition-colors shadow-md"
              >
                {t("priceCta")}
              </Link>
            </m.div>

            <m.div {...fade} className="mt-10 text-center px-2">
              <h3 className="font-medium text-warm-dark mb-2">{t("trustTitle")}</h3>
              <p className="text-sm text-warm-gray-500 leading-relaxed max-w-md mx-auto">{t("trustBody")}</p>
            </m.div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-16 sm:py-24 bg-warm-dark text-white">
          <div className="mx-auto max-w-2xl text-center">
            <m.h2 {...fade} className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-light italic mb-4">
              {t("finalTitle")}
            </m.h2>
            <m.p {...fade} className="text-white/75 text-sm sm:text-base leading-relaxed mb-8">
              {t("finalSub")}
            </m.p>
            <m.div {...fade}>
              <Link
                href={FORM_LINK}
                onClick={onCta}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-warm-dark hover:bg-rosa-50 transition-colors"
              >
                {t("ctaPrimary")}
              </Link>
            </m.div>
          </div>
        </section>

        <footer className="border-t border-warm-gray-200 bg-crema px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-gray-400">
            <Link href="/" className="hover:text-warm-dark transition-colors">
              {t("footerHome")}
            </Link>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacidad" className="hover:text-warm-dark transition-colors">
                {t("footerPrivacy")}
              </Link>
              <Link href="/cookies" className="hover:text-warm-dark transition-colors">
                {t("footerCookies")}
              </Link>
              <Link href="/aviso-legal" className="hover:text-warm-dark transition-colors">
                {t("footerLegal")}
              </Link>
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-warm-gray-200/80 bg-crema/95 backdrop-blur-md p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <Link
          href={FORM_LINK}
          onClick={onCta}
          className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-warm-dark text-sm font-semibold text-white"
        >
          {t("ctaSticky")}
        </Link>
      </div>
    </div>
  );
}
