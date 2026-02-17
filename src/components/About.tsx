"use client";

import AnimatedSection from "./AnimatedSection";

export default function About() {
  return (
    <section id="sobre-mi" className="py-28 md:py-36 bg-white" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image placeholder */}
          <AnimatedSection direction="left">
            <div className="relative">
              <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-rosa-100 to-marron-100 overflow-hidden relative" role="img" aria-label="Sandra Lorden, entrenadora personal y nutricionista">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-rosa-200/50 flex items-center justify-center mb-4">
                      <svg
                        className="w-10 h-10 text-rosa-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-marron-400">Tu foto aqui</p>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-rosa-200/40 -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-marron-200/30 -z-10" />
            </div>
          </AnimatedSection>

          {/* Content */}
          <div>
            <AnimatedSection direction="right">
              <p className="text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
                Sobre Mi
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <h2 id="about-heading" className="font-[family-name:var(--font-display)] italic text-4xl md:text-5xl font-light text-warm-dark leading-tight">
                Pasión por el
                <br />
                <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">bienestar integral</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <p className="mt-8 text-lg text-warm-gray-400 leading-relaxed">
                Soy Sandra Lorden, entrenadora personal certificada y nutricionista.
                Mi mision es ayudarte a alcanzar tus objetivos de salud y fitness
                de manera sostenible y personalizada.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.3}>
              <p className="mt-4 text-lg text-warm-gray-400 leading-relaxed">
                Con mas de 8 anos de experiencia, he tenido el privilegio de
                colaborar con marcas como <strong className="text-warm-dark">Gravl</strong> y{" "}
                <strong className="text-warm-dark">EntrenaVirtual</strong>, y de aparecer
                en multiples revistas especializadas del sector fitness y bienestar.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.4}>
              <div className="mt-10 grid grid-cols-2 gap-6">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                      </svg>
                    ),
                    title: "Certificada",
                    desc: "Formacion continua en fitness y nutricion",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    ),
                    title: "Personalizado",
                    desc: "Planes adaptados a cada persona",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236c.016.003.032.007.048.011" />
                      </svg>
                    ),
                    title: "Virtual & Presencial",
                    desc: "Entrena desde cualquier lugar",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                      </svg>
                    ),
                    title: "Nutricion",
                    desc: "Alimentacion consciente y equilibrada",
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
