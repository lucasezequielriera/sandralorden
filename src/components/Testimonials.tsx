"use client";

import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    name: "Maria Garcia",
    role: "Clienta desde 2023",
    text: "Sandra no solo me ayudo a alcanzar mis objetivos fisicos, sino que cambio mi relacion con la comida y el ejercicio. Es una profesional increible.",
  },
  {
    name: "Laura Martinez",
    role: "Entrenamiento Virtual",
    text: "Pensaba que el entrenamiento online no seria lo mismo, pero Sandra hace que cada sesion sea intensa, divertida y totalmente personalizada.",
  },
  {
    name: "Ana Rodriguez",
    role: "Nutricion + Entrenamiento",
    text: "El plan nutricional que diseno para mi fue un cambio de vida. Por fin entiendo lo que como y por que. Resultados reales y sostenibles.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <AnimatedSection>
            <p className="text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              Testimonios
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="font-[family-name:var(--font-display)] italic text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              Lo que dicen mis{" "}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">clientas</span>
            </h2>
          </AnimatedSection>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <AnimatedSection key={item.name} delay={i * 0.1}>
              <div className="relative bg-gradient-to-br from-rosa-50/30 to-marron-50/30 rounded-3xl p-8 lg:p-10 h-full border border-warm-gray-100/30">
                {/* Quote mark */}
                <div className="font-[family-name:var(--font-script)] text-6xl text-rosa-200 leading-none mb-4">
                  &ldquo;
                </div>

                {/* Text */}
                <p className="text-warm-gray-500 leading-relaxed mb-8">
                  {item.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rosa-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-rosa-400">
                      {item.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-dark">{item.name}</p>
                    <p className="text-xs text-warm-gray-400">{item.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
