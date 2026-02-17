"use client";

import AnimatedSection from "./AnimatedSection";

const services = [
  {
    title: "Entrenamiento Presencial",
    description:
      "Sesiones individuales one-to-one donde trabajamos juntas en el gimnasio. Correccion postural en tiempo real y motivacion constante.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
    features: ["Sesiones de 60 minutos", "Plan personalizado", "Seguimiento semanal"],
    accent: "rosa",
  },
  {
    title: "Entrenamiento Virtual",
    description:
      "Entrena conmigo desde cualquier lugar del mundo. Sesiones en vivo por videollamada con la misma calidad que presencial.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    features: ["Flexibilidad horaria", "Sin desplazamiento", "Grabacion de sesiones"],
    accent: "marron",
  },
  {
    title: "Nutricion Deportiva",
    description:
      "Planes nutricionales personalizados que complementan tu entrenamiento. Alimentacion consciente para resultados reales.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
      </svg>
    ),
    features: ["Dietas personalizadas", "Suplementacion", "Educacion nutricional"],
    accent: "rosa",
  },
  {
    title: "Programas Online",
    description:
      "Programas de entrenamiento completos a traves de Gravl y EntrenaVirtual. Accede a rutinas profesionales desde tu movil.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    features: ["Acceso 24/7", "Comunidad online", "Actualizaciones mensuales"],
    accent: "marron",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-28 md:py-36 bg-crema" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <AnimatedSection>
            <p className="text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              Servicios
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 id="services-heading" className="font-[family-name:var(--font-display)] italic text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              Tu camino hacia el{" "}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">bienestar</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-warm-gray-400 leading-relaxed">
              Ofrezco diferentes modalidades para adaptarme a tus necesidades,
              horarios y objetivos. Siempre con un enfoque profesional y personalizado.
            </p>
          </AnimatedSection>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.1}>
              <div className="group relative bg-white rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-warm-gray-100/50 h-full">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                    service.accent === "rosa"
                      ? "bg-rosa-50 text-rosa-400 group-hover:bg-rosa-100"
                      : "bg-marron-50 text-marron-400 group-hover:bg-marron-100"
                  }`}
                >
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="font-[family-name:var(--font-display)] italic text-2xl font-light text-warm-dark mb-3">
                  {service.title}
                </h3>
                <p className="text-warm-gray-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-warm-gray-500">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          service.accent === "rosa" ? "bg-rosa-300" : "bg-marron-300"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Arrow */}
                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-warm-dark opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                  Saber mas
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
