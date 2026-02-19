"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    question: "¿Ofreces entrenamiento online?",
    answer:
      "Sí, ofrezco asesorías online de entrenamiento y nutrición con seguimiento continuo por WhatsApp, email o videollamada. Los planes se entregan en formato PDF con fotos, anotaciones y toda la info que necesitas.",
  },
  {
    question: "¿Qué servicios ofreces?",
    answer:
      "Ofrezco entrenamiento personal presencial (a domicilio o al aire libre) y asesorías online de nutrición, entrenamiento (gym o casa) y pack completo. Todos los planes son 100% personalizados y adaptados a ti.",
  },
  {
    question: "¿Eres nutricionista certificada?",
    answer:
      "Sí, soy graduada en Ciencias del Deporte y la Actividad Física (CAFYD) con doble Máster en Nutrición Deportiva y Alto Rendimiento. Llevo 10 años ayudando a más de 1000 personas a alcanzar sus objetivos.",
  },
  {
    question: "¿Cómo empiezo contigo?",
    answer:
      "Rellena el cuestionario de transformación aquí en la web. Analizaré tus datos, te enviaré un análisis personalizado por email y te contactaré por WhatsApp para definir tu plan a medida.",
  },
  {
    question: "¿Necesito tener experiencia previa para entrenar contigo?",
    answer:
      "Para nada. Trabajo con todos los niveles, desde principiantes hasta avanzados. Adapto cada plan a tu nivel, tus objetivos y tu disponibilidad. Lo importante es dar el primer paso.",
  },
  {
    question: "¿Cuánto tiempo tardaré en ver resultados?",
    answer:
      "Depende de tu objetivo y tu punto de partida, pero la mayoría de mis clientas notan cambios en las primeras 3-4 semanas. Los resultados sólidos y sostenibles se ven a partir de los 3 meses con constancia.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-20 sm:py-28 md:py-36 bg-crema" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <AnimatedSection>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              FAQ
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 id="faq-heading" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              Preguntas{" "}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">frecuentes</span>
            </h2>
          </AnimatedSection>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={faq.question} delay={i * 0.05}>
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
