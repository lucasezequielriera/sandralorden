"use client";

import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    name: "Elena B.",
    service: "Pack Entrenamiento + Nutrición",
    text: "Sandra no solo me ayudó a alcanzar mis objetivos físicos, sino que cambió mi relación con la comida y el ejercicio. Es una profesional increíble y, sobre todo, una persona que te acompaña de verdad.",
    instagram: "https://www.instagram.com/p/DRMYcFQjErz/",
  },
  {
    name: "Olga A.",
    service: "Asesoría Online",
    text: "Empecé sin tener ni idea de entrenar y Sandra me fue guiando paso a paso. Sus planes son súper claros, con fotos y explicaciones. Y lo mejor es que siempre está ahí para cualquier duda.",
    instagram: "https://www.instagram.com/p/DMpYy2ltDr4/",
  },
  {
    name: "Andrea M.",
    service: "Entrenamiento + Nutrición",
    text: "Llevaba años apuntada al gimnasio sin saber muy bien qué hacer. Desde que entreno con Sandra mis resultados se han disparado. Me ha enseñado a entrenar con cabeza y a comer bien sin pasar hambre.",
    instagram: "https://www.instagram.com/p/DLo9bq9tj0g/",
  },
  {
    name: "Isabel C.",
    service: "Nutrición Deportiva",
    text: "El plan nutricional que me hizo Sandra fue un antes y un después. Adaptado a mis gustos, mis horarios y con opciones para que no se hiciese monótono. Resultados reales y sostenibles.",
    instagram: "https://www.instagram.com/p/DKtyGmXNDWs/",
  },
  {
    name: "Iñigo L.",
    service: "Entrenamiento Presencial",
    text: "Sandra es una máquina motivando. Las sesiones se pasan volando y la corrección técnica que hace es brutal. En tres meses he notado un cambio enorme tanto físico como de energía.",
    instagram: "https://www.instagram.com/p/DJTV_A9NWA1/",
  },
  {
    name: "Irene M.",
    service: "Pack Completo Online",
    text: "Pensaba que el entrenamiento online no sería lo mismo, pero Sandra hace que cada semana sea intensa y personalizada. Siempre atenta por WhatsApp y los checkings mensuales marcan la diferencia.",
    instagram: "https://www.instagram.com/p/C9mEOnfNvvr/",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 md:py-36 bg-white" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
          <AnimatedSection>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              Testimonios
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 id="testimonials-heading" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              Lo que dicen mis{" "}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">clientes</span>
            </h2>
          </AnimatedSection>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((item, i) => (
            <AnimatedSection key={item.name} delay={i * 0.08}>
              <div className="relative bg-gradient-to-br from-rosa-50/30 to-marron-50/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full border border-warm-gray-100/30 flex flex-col">
                {/* Quote mark */}
                <div className="font-[family-name:var(--font-script)] text-5xl sm:text-6xl text-rosa-200 leading-none mb-3">
                  &ldquo;
                </div>

                {/* Text */}
                <p className="text-sm sm:text-base text-warm-gray-500 leading-relaxed mb-6 flex-1">
                  {item.text}
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rosa-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-rosa-400">
                        {item.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-dark">{item.name}</p>
                      <p className="text-xs text-warm-gray-400">{item.service}</p>
                    </div>
                  </div>
                  <a
                    href={item.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-warm-gray-300 hover:text-rosa-400 transition-colors"
                    aria-label={`Ver testimonio de ${item.name} en Instagram`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
