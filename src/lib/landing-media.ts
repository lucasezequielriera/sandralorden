/** Logos y enlaces de prensa para la landing de conversión (alineado con `Press.tsx`). */

export const LANDING_MEDIA_LOGOS = [
  { name: "Vogue", src: "/images/logos/vogue.svg" },
  { name: "ELLE", src: "/images/logos/elle.svg" },
  { name: "Glamour", src: "/images/logos/glamour.svg" },
  { name: "¡Hola!", src: "/images/logos/hola.svg" },
  { name: "Semana", src: "/images/logos/logo-semana_header.png" },
  { name: "Cuerpomente", src: "/images/logos/cuerpomente.png" },
  { name: "Mediaset", src: "/images/logos/mediaset.svg" },
  { name: "MSN", src: "/images/logos/msn.svg" },
  { name: "JeFemme", src: "/images/logos/jefemme.png" },
] as const;

export type LandingCoverageType = "Digital" | "Revista" | "TV" | "Entrevista";

export const LANDING_COVERAGE_HIGHLIGHTS: ReadonlyArray<{
  outlet: string;
  url: string;
  type: LandingCoverageType;
}> = [
  {
    outlet: "Glamour España",
    type: "Digital",
    url: "https://www.glamour.es/articulos/es-necesario-andar-10000-pasos-al-dia",
  },
  {
    outlet: "Vogue España",
    type: "Revista",
    url: "https://www.vogue.es/belleza/articulos/cuantos-dias-semana-tiempo-entrenar-obtener-resultados-tonificar-cuerpo",
  },
  {
    outlet: "ELLE",
    type: "Revista",
    url: "https://www.elle.com/es/belleza/a64483685/los-5-ejercicios-que-de-verdad-tonifican-y-reafirman-el-cuerpo-para-ponerse-en-forma-de-aqui-al-verano-segun-una-entrenadora/",
  },
  {
    outlet: "¡Hola!",
    type: "Digital",
    url: "https://www.hola.com/estar-bien/20251005857074/entrenamiento-quema-grasa-resistencia-6-minutos-hiit/",
  },
  {
    outlet: "Semana",
    type: "Revista",
    url: "https://www.semana.es/bienestar/sandra-lorden-entrenadora-personal-si-quieres-espalda-fuerte-y-definida-pero-no-sabes-que-hacer-este-entreno-es-para-ti_2803912",
  },
  {
    outlet: "Cuerpomente",
    type: "Revista",
    url: "https://www.cuerpomente.com/salud-natural/ejercicios/sandra-lorden-entrenadora-no-puedes-aumentar-tamano-gluteos-y-perder-abdomen-mismo-tiempo-son-objetivos-opuestos_15960",
  },
];

export const LANDING_TV_FEATURE = {
  outlet: "Mediaset — Solos",
  url: "https://www.mediasetinfinity.es/programas-tv/solos/keyla-y-napoli/episodios/programa-480-40_09934104/player/",
} as const;

export const PRESS_TYPE_KEYS: Record<LandingCoverageType, "typeDigital" | "typeRevista" | "typeTV" | "typeEntrevista"> = {
  Digital: "typeDigital",
  Revista: "typeRevista",
  TV: "typeTV",
  Entrevista: "typeEntrevista",
};
