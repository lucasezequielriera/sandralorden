"use client";

import AnimatedSection from "./AnimatedSection";

const mediaLogos = [
  { name: "Vogue", src: "/images/logos/vogue.svg" },
  { name: "¡Hola!", src: "/images/logos/hola.svg" },
  { name: "Semana", src: "/images/logos/logo-semana_header.png" },
  { name: "Cuerpomente", src: "/images/logos/cuerpomente.svg" },
  { name: "JeFemme", src: "/images/logos/jefemme.svg" },
];

const pressItems = [
  {
    name: "¡Hola!",
    title: "Hay sesiones de ejercicio de 6 minutos con las que quemas calorías incluso en reposo",
    type: "Digital",
    date: "Oct 2025",
    url: "https://www.hola.com/estar-bien/20251005857074/entrenamiento-quema-grasa-resistencia-6-minutos-hiit/",
  },
  {
    name: "Semana",
    title: "Si quieres una espalda fuerte y definida pero no sabes qué hacer, este entreno es para ti",
    type: "Revista",
    date: "Sep 2025",
    url: "https://www.semana.es/bienestar/sandra-lorden-entrenadora-personal-si-quieres-espalda-fuerte-y-definida-pero-no-sabes-que-hacer-este-entreno-es-para-ti_2803912",
  },
  {
    name: "Cuerpomente",
    title: "Aumentar el tamaño de los glúteos y aplanar el abdomen al mismo tiempo, ¿misión imposible?",
    type: "Revista",
    date: "Jul 2025",
    url: "https://www.cuerpomente.com/salud-natural/ejercicios/sandra-lorden-entrenadora-no-puedes-aumentar-tamano-gluteos-y-perder-abdomen-mismo-tiempo-son-objetivos-opuestos_15960",
  },
  {
    name: "¡Hola!",
    title: "Ejercicios para fortalecer el core en casa: el error que impide que se marquen tus abdominales",
    type: "Digital",
    date: "Jun 2025",
    url: "https://www.hola.com/belleza/20250624838867/ejercicios-fortalecer-core-casa-error-impide-marquen-abdominales/",
  },
  {
    name: "¡Hola!",
    title: "Ponte en forma este otoño con las novedades en ejercicios y disciplinas fitness",
    type: "Digital",
    date: "Sep 2024",
    url: "https://www.hola.com/belleza/20240902715863/novedades-fitness-ejercicios-ponerse-en-forma/",
  },
  {
    name: "JeFemme",
    title: "Entrevista a Sandra Lordén Álvarez, entrenadora personal",
    type: "Entrevista",
    date: "Dic 2022",
    url: "https://www.jefemme.es/entrevista-a-sandra-lord%C3%A9n",
  },
  {
    name: "Vogue España",
    title: "Este es el número de días (y el tiempo) que hay que entrenar a la semana para tener un cuerpo tonificado",
    type: "Revista",
    date: "Sep 2020",
    url: "https://www.vogue.es/belleza/articulos/cuantos-dias-semana-tiempo-entrenar-obtener-resultados-tonificar-cuerpo",
  },
  {
    name: "Vogue España",
    title: "Así deberías entrenar si solo tienes 20-30 minutos al día para hacer ejercicio",
    type: "Revista",
    date: "Sep 2020",
    url: "https://www.vogue.es/belleza/articulos/entrenar-20-30-minutos-al-dia-entrenamientos-hacer-ejercicio-tonificar-cuerpo",
  },
  {
    name: "Vogue España",
    title: "La importancia que tiene la velocidad a la que haces los ejercicios abdominales",
    type: "Revista",
    date: "Ene 2020",
    url: "https://www.vogue.es/belleza/articulos/ejercicios-abdominales-velocidad-repeticiones-primer-dia-gimnasio",
  },
];

export default function Press() {
  return (
    <section id="prensa" className="py-20 sm:py-28 md:py-36 bg-white" aria-labelledby="press-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
          <AnimatedSection>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
              Prensa
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 id="press-heading" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl md:text-5xl font-light text-warm-dark leading-tight">
              Apariciones en{" "}
              <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">medios</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-warm-gray-400 leading-relaxed">
              Colaboro habitualmente con las principales revistas y medios de fitness
              y bienestar de España como experta en entrenamiento y nutrición deportiva.
            </p>
          </AnimatedSection>
        </div>

        {/* Featured media logos */}
        <AnimatedSection delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 mb-12 sm:mb-16">
            {mediaLogos.map((logo) => (
              <div
                key={logo.name}
                className="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="w-24 sm:w-28 md:w-32 h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Press Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {pressItems.map((item, i) => (
            <AnimatedSection key={item.url} delay={i * 0.06}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col bg-gradient-to-br from-rosa-50/50 to-marron-50/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 border border-warm-gray-100/30 h-full"
              >
                {/* Type badge + date */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="inline-block text-[10px] sm:text-xs uppercase tracking-widest text-marron-400 font-medium">
                    {item.type}
                  </span>
                  <span className="text-[10px] sm:text-xs text-warm-gray-300">
                    {item.date}
                  </span>
                </div>

                {/* Magazine name */}
                <h3 className="font-[family-name:var(--font-display)] italic text-base sm:text-lg font-light text-warm-dark mb-2">
                  {item.name}
                </h3>

                {/* Article title */}
                <p className="text-warm-gray-400 text-xs sm:text-sm leading-relaxed flex-1">
                  {item.title}
                </p>

                {/* Read link */}
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-rosa-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Leer artículo
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
