"use client";

import AnimatedSection from "./AnimatedSection";

const pressItems = [
  {
    name: "Women's Health",
    quote: "Sandra Lorden nos ensena su rutina de fuerza favorita para mujeres.",
    type: "Revista",
  },
  {
    name: "Sport Life",
    quote: "La entrenadora que esta revolucionando el fitness online en Espana.",
    type: "Revista",
  },
  {
    name: "Cosmopolitan",
    quote: "5 ejercicios que Sandra Lorden recomienda para empezar la semana con energia.",
    type: "Revista",
  },
  {
    name: "Men's Health",
    quote: "Entrenamiento funcional: la vision de Sandra Lorden sobre el fitness moderno.",
    type: "Revista",
  },
  {
    name: "Elle",
    quote: "Sandra Lorden: la nutricion es el 80% del camino hacia tus objetivos.",
    type: "Revista",
  },
  {
    name: "Vogue Fitness",
    quote: "La entrenadora personal que confian las celebridades espanolas.",
    type: "Digital",
  },
];

export default function Press() {
  return (
    <section id="prensa" className="py-28 md:py-36 bg-white" aria-labelledby="press-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <AnimatedSection>
            <p className="text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              Prensa
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 id="press-heading" className="font-[family-name:var(--font-display)] italic text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              Apariciones en{" "}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">medios</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-warm-gray-400 leading-relaxed">
              He tenido el honor de colaborar con las principales revistas y medios
              de fitness y bienestar del pais.
            </p>
          </AnimatedSection>
        </div>

        {/* Press Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pressItems.map((item, i) => (
            <AnimatedSection key={item.name} delay={i * 0.08}>
              <div className="group relative bg-gradient-to-br from-rosa-50/50 to-marron-50/50 rounded-2xl p-8 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 border border-warm-gray-100/30">
                {/* Type badge */}
                <span className="inline-block text-xs uppercase tracking-widest text-marron-400 font-medium mb-4">
                  {item.type}
                </span>

                {/* Magazine name */}
                <h3 className="font-[family-name:var(--font-display)] italic text-xl font-light text-warm-dark mb-3">
                  {item.name}
                </h3>

                {/* Quote */}
                <p className="text-warm-gray-400 text-sm leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Decorative line */}
                <div className="mt-6 w-8 h-[2px] bg-rosa-200 group-hover:w-12 transition-all duration-300" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
