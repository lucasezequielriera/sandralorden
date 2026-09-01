/** Fuente única de apariciones en medios (home `Press.tsx` + landing 90 días). */

export type PressItemType =
  | "Digital"
  | "Revista"
  | "TV"
  | "Entrevista"
  | "Colaboración"
  | "Internacional";

export type PressItem = {
  name: string;
  title: string;
  type: PressItemType;
  /** ISO date YYYY-MM-DD para ordenar y mostrar */
  date: string;
  url: string;
};

export const PRESS_TYPE_I18N_KEYS: Record<
  PressItemType,
  "typeDigital" | "typeRevista" | "typeTV" | "typeEntrevista" | "typeColaboracion" | "typeInternacional"
> = {
  Digital: "typeDigital",
  Revista: "typeRevista",
  TV: "typeTV",
  Entrevista: "typeEntrevista",
  Colaboración: "typeColaboracion",
  Internacional: "typeInternacional",
};

/** Orden: más reciente primero */
export const PRESS_ITEMS: PressItem[] = [
  {
    name: "Backdoor Toronto",
    title:
      "No single food eliminates toxins by itself, but these three foods help detox the body (expert Sandra Lordén)",
    type: "Internacional",
    date: "2026-08-24",
    url: "https://shopbackdoor.ca/sandra-lorden-sports-nutritionist-no-single-food-eliminates-toxins-but-these-three-foods-help-detox-the-body/",
  },
  {
    name: "Primera Hora",
    title: "El snack de verano que controla tu apetito, según la experta Sandra Lordén",
    type: "Digital",
    date: "2026-08-22",
    url: "https://primerahora.es/estilo-de-vida/snack-verano-sandra-lorden/",
  },
  {
    name: "Mujerhoy",
    title:
      "El snack de verano ideal no es el que tiene menos calorías, es el que controla el apetito",
    type: "Digital",
    date: "2026-08-21",
    url: "https://www.mujerhoy.com/vivir/bienestar/sandra-lorden-nutricionista-deportiva-snack-verano-ideal-20260821114512-nt.html",
  },
  {
    name: "Mujerhoy",
    title:
      "Ningún alimento elimina toxinas por sí solo, pero estos tres ayudan a depurar el cuerpo",
    type: "Digital",
    date: "2026-08-20",
    url: "https://www.mujerhoy.com/vivir/bienestar/mejores-alimentos-depurar-cuerpo-recomendaciones-sandra-lorden-nutricionista-deportiva-20260820142531-nt.html",
  },
  {
    name: "Glamour España",
    title: "Andar 10.000 pasos al día es bueno, ¿verdad o mito?",
    type: "Digital",
    date: "2026-03-17",
    url: "https://www.glamour.es/articulos/es-necesario-andar-10000-pasos-al-dia",
  },
  {
    name: "ON AIR Fitness",
    title: "Colaboración ON AIR Nutrición — consejos, recetas y educación nutricional",
    type: "Colaboración",
    date: "2026-03-04",
    url: "https://www.linkedin.com/posts/on-air-fitness-espagne_colaboraci%C3%B3n-on-air-fitness-x-sandra-lorden-activity-7434855631746142208-JXyC",
  },
  {
    name: "MSN",
    title:
      "Sandra Lorden, entrenadora: hay sesiones de ejercicio de 6 minutos con las que quemas calorías incluso en reposo",
    type: "Digital",
    date: "2025-10-01",
    url: "https://www.msn.com/es-mx/salud/other/sandra-lorden-entrenadora-hay-sesiones-de-ejercicio-de-6-minutos-con-las-que-quemas-calor%C3%ADas-incluso-en-reposo/ar-AA1NSpe7",
  },
  {
    name: "¡Hola!",
    title: "Hay sesiones de ejercicio de 6 minutos con las que quemas calorías incluso en reposo",
    type: "Digital",
    date: "2025-10-01",
    url: "https://www.hola.com/estar-bien/20251005857074/entrenamiento-quema-grasa-resistencia-6-minutos-hiit/",
  },
  {
    name: "Semana",
    title: "Si quieres una espalda fuerte y definida pero no sabes qué hacer, este entreno es para ti",
    type: "Revista",
    date: "2025-09-01",
    url: "https://www.semana.es/bienestar/sandra-lorden-entrenadora-personal-si-quieres-espalda-fuerte-y-definida-pero-no-sabes-que-hacer-este-entreno-es-para-ti_2803912",
  },
  {
    name: "Cuerpomente",
    title: "Aumentar el tamaño de los glúteos y aplanar el abdomen al mismo tiempo, ¿misión imposible?",
    type: "Revista",
    date: "2025-07-01",
    url: "https://www.cuerpomente.com/salud-natural/ejercicios/sandra-lorden-entrenadora-no-puedes-aumentar-tamano-gluteos-y-perder-abdomen-mismo-tiempo-son-objetivos-opuestos_15960",
  },
  {
    name: "¡Hola!",
    title: "Ejercicios para fortalecer el core en casa: el error que impide que se marquen tus abdominales",
    type: "Digital",
    date: "2025-06-01",
    url: "https://www.hola.com/belleza/20250624838867/ejercicios-fortalecer-core-casa-error-impide-marquen-abdominales/",
  },
  {
    name: "Vogue",
    title: "Is “Protein Yogurt” Better? Experts Weigh In",
    type: "Internacional",
    date: "2025-05-14",
    url: "https://www.vogue.com/article/protein-yogurt",
  },
  {
    name: "ELLE",
    title: "Los 5 ejercicios que de verdad tonifican y reafirman el cuerpo para ponerse en forma de aquí al verano",
    type: "Revista",
    date: "2025-04-01",
    url: "https://www.elle.com/es/belleza/a64483685/los-5-ejercicios-que-de-verdad-tonifican-y-reafirman-el-cuerpo-para-ponerse-en-forma-de-aqui-al-verano-segun-una-entrenadora/",
  },
  {
    name: "Vogue España",
    title: "Yogures de proteínas: beneficios, cómo elegirlos y todo lo que debes saber",
    type: "Revista",
    date: "2025-04-29",
    url: "https://www.vogue.es/articulos/yogures-proteinas-beneficios-como-elegir-los-mejores",
  },
  {
    name: "¡Hola!",
    title: "Ponte en forma este otoño con las novedades en ejercicios y disciplinas fitness",
    type: "Digital",
    date: "2024-09-01",
    url: "https://www.hola.com/belleza/20240902715863/novedades-fitness-ejercicios-ponerse-en-forma/",
  },
  {
    name: "Mediaset — Solos",
    title: "La entrenadora personal Sandra Lorden visita el pisito para poner en forma a los inquilinos",
    type: "TV",
    date: "2023-06-01",
    url: "https://www.mediasetinfinity.es/programas-tv/solos/keyla-y-napoli/episodios/programa-480-40_09934104/player/",
  },
  {
    name: "JeFemme",
    title: "Entrevista a Sandra Lordén Álvarez, entrenadora personal",
    type: "Entrevista",
    date: "2022-12-01",
    url: "https://www.jefemme.es/entrevista-a-sandra-lord%C3%A9n",
  },
  {
    name: "Vogue España",
    title: "Este es el número de días (y el tiempo) que hay que entrenar a la semana para tener un cuerpo tonificado",
    type: "Revista",
    date: "2020-09-01",
    url: "https://www.vogue.es/belleza/articulos/cuantos-dias-semana-tiempo-entrenar-obtener-resultados-tonificar-cuerpo",
  },
  {
    name: "Vogue España",
    title: "Así deberías entrenar si solo tienes 20-30 minutos al día para hacer ejercicio",
    type: "Revista",
    date: "2020-09-01",
    url: "https://www.vogue.es/belleza/articulos/entrenar-20-30-minutos-al-dia-entrenamientos-hacer-ejercicio-tonificar-cuerpo",
  },
  {
    name: "Vogue España",
    title: "La importancia que tiene la velocidad a la que haces los ejercicios abdominales",
    type: "Revista",
    date: "2020-01-01",
    url: "https://www.vogue.es/belleza/articulos/ejercicios-abdominales-velocidad-repeticiones-primer-dia-gimnasio",
  },
];

/** Destacados en landing 90 días (sin bloque TV dedicado). */
export function getLandingCoverageHighlights(): ReadonlyArray<{
  outlet: string;
  url: string;
  type: PressItemType;
}> {
  return PRESS_ITEMS.filter((item) => item.type !== "TV")
    .slice(0, 9)
    .map(({ name: outlet, url, type }) => ({ outlet, url, type }));
}

export const LANDING_TV_FEATURE = {
  outlet: "Mediaset — Solos",
  url: "https://www.mediasetinfinity.es/programas-tv/solos/keyla-y-napoli/episodios/programa-480-40_09934104/player/",
} as const;

/** Franja de logotipos (home + landing). */
export const MEDIA_LOGOS: ReadonlyArray<{ name: string; src: string }> = [
  { name: "Mujerhoy", src: "/images/logos/mujerhoy.svg" },
  { name: "Vogue", src: "/images/logos/vogue.svg" },
  { name: "ELLE", src: "/images/logos/elle.svg" },
  { name: "Glamour", src: "/images/logos/glamour.svg" },
  { name: "Primera Hora", src: "/images/logos/primerahora.svg" },
  { name: "¡Hola!", src: "/images/logos/hola.svg" },
  { name: "Semana", src: "/images/logos/logo-semana_header.png" },
  { name: "ON AIR Fitness", src: "/images/logos/on-air-fitness.svg" },
  { name: "Cuerpomente", src: "/images/logos/cuerpomente.png" },
  { name: "Backdoor Toronto", src: "/images/logos/backdoor-toronto.svg" },
  { name: "Mediaset", src: "/images/logos/mediaset.svg" },
  { name: "MSN", src: "/images/logos/msn.svg" },
  { name: "JeFemme", src: "/images/logos/jefemme.png" },
];
