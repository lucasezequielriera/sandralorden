"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import AnimatedSection from "./AnimatedSection";

type ServiceTab = "presencial" | "online";

export default function Services() {
  const t = useTranslations("Services");
  const [activeTab, setActiveTab] = useState<ServiceTab>("presencial");

  return (
    <section id="servicios" className="py-20 sm:py-28 md:py-36 bg-crema" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <AnimatedSection>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              {t("sectionLabel")}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 id="services-heading" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              {t("titleStart")}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">{t("titleHighlight")}</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-warm-gray-400 leading-relaxed">
              {t("description")}
            </p>
          </AnimatedSection>
        </div>

        {/* Tab selector */}
        <AnimatedSection delay={0.25}>
          <div className="flex justify-center mb-10 sm:mb-14">
            <div className="inline-flex bg-white rounded-full p-1.5 border border-warm-gray-100/50 shadow-sm">
              <button
                onClick={() => setActiveTab("presencial")}
                className={`relative px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "presencial"
                    ? "text-white"
                    : "text-warm-gray-400 hover:text-warm-dark"
                }`}
              >
                {activeTab === "presencial" && (
                  <m.div
                    layoutId="serviceTabs"
                    className="absolute inset-0 bg-warm-dark rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Presencial</span>
              </button>
              <button
                onClick={() => setActiveTab("online")}
                className={`relative px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "online"
                    ? "text-white"
                    : "text-warm-gray-400 hover:text-warm-dark"
                }`}
              >
                {activeTab === "online" && (
                  <m.div
                    layoutId="serviceTabs"
                    className="absolute inset-0 bg-warm-dark rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Asesoría Online</span>
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "presencial" ? (
            <m.div
              key="presencial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
                {/* Description card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-warm-gray-100/50 h-full">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-rosa-50 text-rosa-400 flex items-center justify-center mb-5">
                    <svg className="w-6 sm:w-7 h-6 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark mb-4">
                    Entrenamiento personal presencial
                  </h3>
                  <p className="text-sm sm:text-base text-warm-gray-400 leading-relaxed mb-4">
                    Si lo que te gusta es el trato personal y lo que necesitas es una persona que te corrija,
                    te motive y esté cerca tuyo, esta es tu opción de entrenamiento.
                  </p>
                  <p className="text-sm sm:text-base text-warm-gray-400 leading-relaxed mb-6">
                    A domicilio o al aire libre, solo o acompañado. No necesitas disponer de ningún tipo de material,
                    ya que dispongo de una gran variedad de material portátil que no tiene nada que envidiar a cualquier gimnasio.
                    Esta es sin duda la opción más completa para llegar al máximo rendimiento y la mejor opción para
                    quienes se están iniciando en el mundo del entrenamiento.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Corrección postural en tiempo real",
                      "Material portátil profesional incluido",
                      "A domicilio o al aire libre",
                      "Ideal para principiantes y avanzados",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs sm:text-sm text-warm-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-rosa-300 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-warm-gray-100/50 h-full">
                  <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-marron-400 font-medium mb-6">
                    {t("tarifas")}
                  </p>
                  <div className="space-y-6">
                    {/* Individual */}
                    <div>
                      <h4 className="font-medium text-warm-dark text-base sm:text-lg mb-3">{t("individual")}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-rosa-50/50 rounded-xl px-4 py-3">
                          <span className="text-sm text-warm-gray-500">{t("sesion1h")}</span>
                          <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-warm-dark">50 €</span>
                        </div>
                        <div className="flex items-center justify-between bg-rosa-50/50 rounded-xl px-4 py-3">
                          <span className="text-sm text-warm-gray-500">{t("bono10")}</span>
                          <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-warm-dark">450 €</span>
                        </div>
                      </div>
                    </div>

                    {/* Pareja */}
                    <div>
                      <h4 className="font-medium text-warm-dark text-base sm:text-lg mb-3">{t("pareja")}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-marron-50/50 rounded-xl px-4 py-3">
                          <span className="text-sm text-warm-gray-500">{t("sesion1h")}</span>
                          <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-warm-dark">60 €</span>
                        </div>
                        <div className="flex items-center justify-between bg-marron-50/50 rounded-xl px-4 py-3">
                          <span className="text-sm text-warm-gray-500">{t("bono10")}</span>
                          <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-warm-dark">550 €</span>
                        </div>
                      </div>
                    </div>

                    {/* Grupos */}
                    <div>
                      <h4 className="font-medium text-warm-dark text-base sm:text-lg mb-3">{t("gruposReducidos")}</h4>
                      <div className="flex items-center justify-between bg-rosa-50/30 rounded-xl px-4 py-3">
                        <span className="text-sm text-warm-gray-500">{t("porPersonaHora")}</span>
                        <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-warm-dark">{t("desde10")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          ) : (
            <m.div
              key="online"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* How it works */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-warm-gray-100/50 mb-6 sm:mb-8">
                <h3 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark mb-4">
                  Asesoría online
                </h3>
                <p className="text-sm sm:text-base text-warm-gray-400 leading-relaxed mb-6">
                  Las asesorías online son la mejor alternativa para que un profesional realice programas
                  de entrenamiento y nutrición específicos para tus necesidades, a distancia.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      step: "1",
                      title: "Cuestionario inicial",
                      desc: "Rellenas un cuestionario sobre tu estado físico, alimentación, objetivos y lesiones. Con tus respuestas elaboro tu plan a medida.",
                    },
                    {
                      step: "2",
                      title: "Seguimiento continuo",
                      desc: "Nos comunicamos por email, WhatsApp o videollamada para resolver dudas y motivarte. El contacto es diario si lo necesitas.",
                    },
                    {
                      step: "3",
                      title: "Checking mensual",
                      desc: "Cada 4 semanas renovamos el plan en base a tu progreso, para seguir avanzando sin estancarnos. Sin compromiso de permanencia.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="text-center sm:text-left">
                      <div className="w-10 h-10 mx-auto sm:mx-0 rounded-full bg-rosa-100 text-rosa-500 flex items-center justify-center font-[family-name:var(--font-script)] text-lg mb-3">
                        {item.step}
                      </div>
                      <h4 className="font-medium text-warm-dark text-sm sm:text-base mb-1.5">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-warm-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Nutricion */}
                <div className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-warm-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-rosa-50 text-rosa-400 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                    </svg>
                  </div>
                  <h4 className="font-[family-name:var(--font-display)] italic text-xl sm:text-2xl font-light text-warm-dark mb-2">
                    Nutrición
                  </h4>
                  <p className="text-sm text-warm-gray-400 leading-relaxed mb-5">
                    Por mucho que entrenes, sin una nutrición adecuada no conseguirás los resultados deseados.
                    Plan nutricional personalizado adaptado a tus gustos, horarios y objetivos, con fotos de los alimentos.
                  </p>
                  <div className="mt-auto pt-4 border-t border-warm-gray-100">
                    <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-warm-dark">59 €</span>
                    <span className="text-sm text-warm-gray-400"> / mes</span>
                  </div>
                </div>

                {/* Entrenamiento */}
                <div className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-warm-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-marron-50 text-marron-400 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                  </div>
                  <h4 className="font-[family-name:var(--font-display)] italic text-xl sm:text-2xl font-light text-warm-dark mb-2">
                    Entrenamiento
                  </h4>
                  <p className="text-sm text-warm-gray-400 leading-relaxed mb-2">
                    Plan individualizado para gimnasio o para casa, con información detallada, fotos de ejecución y anotaciones.
                    Si necesitas vídeos de algún ejercicio, solo tienes que pedirlo.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-xs bg-marron-50 text-marron-500 px-2.5 py-1 rounded-full">En gimnasio</span>
                    <span className="text-xs bg-marron-50 text-marron-500 px-2.5 py-1 rounded-full">En casa</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-warm-gray-100">
                    <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-warm-dark">59 €</span>
                    <span className="text-sm text-warm-gray-400"> / mes</span>
                  </div>
                </div>

                {/* Pack */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-rosa-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 sm:col-span-2 lg:col-span-1">
                  <div className="absolute -top-3 left-6 sm:left-8">
                    <span className="bg-rosa-400 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Más popular
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-rosa-100 text-rosa-500 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                    </svg>
                  </div>
                  <h4 className="font-[family-name:var(--font-display)] italic text-xl sm:text-2xl font-light text-warm-dark mb-2">
                    Pack Completo
                  </h4>
                  <p className="text-sm text-warm-gray-400 leading-relaxed mb-5">
                    Entrenamiento + nutrición juntos. La combinación perfecta para maximizar tus resultados
                    con un plan integral totalmente personalizado.
                  </p>
                  <ul className="space-y-2 mb-5">
                    {[
                      "Plan de entrenamiento (gym o casa)",
                      "Plan nutricional personalizado",
                      "Seguimiento diario por WhatsApp",
                      "Checking mensual con ajustes",
                      "Formato PDF con fotos y anotaciones",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-warm-gray-500">
                        <svg className="w-4 h-4 text-rosa-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-4 border-t border-rosa-100">
                    <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-warm-dark">79 €</span>
                    <span className="text-sm text-warm-gray-400"> / mes</span>
                    <p className="text-xs text-rosa-400 mt-1">Ahorras 39 € respecto a contratar por separado</p>
                  </div>
                </div>
              </div>

              {/* Extra info */}
              <div className="mt-6 sm:mt-8 bg-rosa-50/50 rounded-2xl p-5 sm:p-6 text-center">
                <p className="text-sm text-warm-gray-500 leading-relaxed">
                  Todos los planes están en formato PDF e incluyen información detallada, fotografías de ejercicios y alimentos.
                  <br className="hidden sm:block" />
                  Planes de 4 semanas renovables sin compromiso. <strong className="text-warm-dark">Tú decides si quieres seguir.</strong>
                </p>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
