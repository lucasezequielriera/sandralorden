"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import AnimatedSection from "./AnimatedSection";

export default function FAQ() {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const faqs = [
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: t("a2") },
    { question: t("q3"), answer: t("a3") },
    { question: t("q4"), answer: t("a4") },
    { question: t("q5"), answer: t("a5") },
    { question: t("q6"), answer: t("a6") },
  ];

  return (
    <section className="py-20 sm:py-28 md:py-36 bg-crema" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <AnimatedSection>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              {t("sectionLabel")}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 id="faq-heading" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              {t("titleStart")}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">{t("titleHighlight")}</span>
            </h2>
          </AnimatedSection>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="bg-white rounded-xl sm:rounded-2xl border border-warm-gray-100/50 overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-medium text-sm sm:text-base text-warm-dark pr-2">
                    {faq.question}
                  </span>
                  <m.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-full bg-rosa-50 flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5 text-rosa-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </m.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-warm-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
