"use client";

import AnimatedSection from "./AnimatedSection";

export default function Partners() {
  return (
    <section className="py-20 md:py-28 bg-crema">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <AnimatedSection>
          <p className="text-center text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-14">
            Colaboro con
          </p>
        </AnimatedSection>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20 md:gap-32">
          <AnimatedSection delay={0.1}>
            <div className="group flex flex-col items-center gap-3 transition-all duration-300">
              <div className="w-48 h-20 rounded-2xl bg-white border border-warm-gray-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:border-rosa-200">
                <span className="font-[family-name:var(--font-display)] italic text-2xl font-light text-warm-dark tracking-tight">
                  Gravl
                </span>
              </div>
              <p className="text-xs text-warm-gray-400">Plataforma de entrenamiento</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="group flex flex-col items-center gap-3 transition-all duration-300">
              <div className="w-48 h-20 rounded-2xl bg-white border border-warm-gray-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:border-marron-200">
                <span className="font-[family-name:var(--font-display)] italic text-2xl font-light text-warm-dark tracking-tight">
                  EntrenaVirtual
                </span>
              </div>
              <p className="text-xs text-warm-gray-400">Fitness online</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
