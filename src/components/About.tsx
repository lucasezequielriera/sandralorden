"use client";

import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

export default function About() {
  return (
    <section id="sobre-mi" className="py-20 sm:py-28 md:py-36 bg-white" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
          <AnimatedSection direction="left">
            <div className="relative max-w-sm mx-auto lg:max-w-none">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden relative">
                <Image
                  src="/images/IMG_1902.jpg"
                  alt="Sandra Lordén Álvarez, entrenadora personal y nutricionista en Madrid"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 384px, (max-width: 1024px) 448px, 512px"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-24 sm:w-32 h-24 sm:h-32 rounded-2xl bg-rosa-200/40 -z-10" />
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-marron-200/30 -z-10" />
            </div>
          </AnimatedSection>

          {/* Content */}
          <div>
            <AnimatedSection direction="right">
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
                Sobre Mí
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <h2 id="about-heading" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl md:text-5xl font-light text-warm-dark leading-tight">
                Hazlo con pasión
                <br />
                <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">o cambia de profesión</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <p className="mt-6 sm:mt-8 text-base sm:text-lg text-warm-gray-400 leading-relaxed">
                De siempre fui una niña muy hiperactiva a la que le encantaba el deporte.
                Cuando terminé el colegio decidí enfocar mi carrera profesional a profundizar
                en la ciencia de la actividad física y la nutrición, de la que me enamoré
                profundamente y pude hacer de mi pasión mi profesión.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.3}>
              <p className="mt-4 text-base sm:text-lg text-warm-gray-400 leading-relaxed">
                Me fui especializando en <strong className="text-warm-dark">entrenamiento de fuerza en mujeres</strong> y
                en <strong className="text-warm-dark">nutrición deportiva</strong>, con el objetivo de ayudar a las personas
                a sacar su mejor versión. Quiero que quien trabaje conmigo no solo me vea como su
                entrenadora, sino como una amiga que quiere impulsarla y acompañarla en el proceso.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.4}>
              <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                      </svg>
                    ),
                    title: "Grado en CAFYD",
                    desc: "Ciencias del Deporte y la Actividad Física",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                      </svg>
                    ),
                    title: "Doble Máster",
                    desc: "Nutrición deportiva y alto rendimiento",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    ),
                    title: "Fuerza femenina",
                    desc: "Especialista en entrenamiento para mujeres",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                      </svg>
                    ),
                    title: "Embarazo y ciclo",
                    desc: "Formación en entrenamiento hormonal",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rosa-50 flex items-center justify-center text-rosa-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium text-warm-dark text-sm">{item.title}</p>
                      <p className="text-xs text-warm-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
