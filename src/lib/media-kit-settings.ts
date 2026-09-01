import { createServiceClient } from "@/lib/supabase/server";
import { MEDIA_KIT_CONTACT } from "@/lib/media-kit-metrics";
import {
  type CollabCustomCategory,
  type MediaKitCollabExample,
  mergeCollabCustomCategories,
  isKnownCollabCategory,
} from "@/lib/media-kit-collab-examples";

export type MediaKitCollabItem = {
  title: string;
  description: string;
};

export type MediaKitPricingItem = {
  format: string;
  price: string;
  notes: string;
};

export type MediaKitLocaleBlock = {
  bioParagraph1: string;
  bioParagraph2: string;
  audienceBullets: string[];
  expertiseItems: string[];
  collabItems: MediaKitCollabItem[];
  collabNote: string;
  pricingItems: MediaKitPricingItem[];
  pricingNote: string;
};

export type MediaKitMetrics = {
  igFitFollowers: string;
  igPersonalFollowers: string;
  igEngagement: string;
  igReach: string;
  igImpressions: string;
  tiktokFollowers: string;
  linkedinFollowers: string;
  youtubeSubscribers: string;
};

export type MediaKitStats = {
  clients: string;
  years: string;
};

export type MediaKitContact = {
  email: string;
  phone: string;
  instagramPro: string;
  instagramPersonal: string;
  siteUrl: string;
};

export type MediaKitSettings = {
  contact: MediaKitContact;
  stats: MediaKitStats;
  metrics: MediaKitMetrics;
  showPricing: boolean;
  collabExamples: MediaKitCollabExample[];
  collabCustomCategories: CollabCustomCategory[];
  es: MediaKitLocaleBlock;
  en: MediaKitLocaleBlock;
};

const ES_DEFAULTS: MediaKitLocaleBlock = {
  bioParagraph1:
    "De siempre fui una niña muy hiperactiva a la que le encantaba el deporte. Cuando terminé el colegio decidí enfocar mi carrera profesional a profundizar en la ciencia de la actividad física y la nutrición, de la que me enamoré profundamente y pude hacer de mi pasión mi profesión.",
  bioParagraph2:
    "Me fui especializando en entrenamiento de fuerza en mujeres y en nutrición deportiva, con el objetivo de ayudar a las personas a sacar su mejor versión. Quiero que quien trabaje conmigo no solo me vea como su entrenadora, sino como una amiga que quiere impulsarla y acompañarla en el proceso.",
  audienceBullets: [
    "Mujeres 25–45 interesadas en fitness, nutrición y bienestar",
    "Deportistas amateur y personas que buscan cambio de hábitos sostenible",
    "Audiencia española con alcance internacional (Vogue US, prensa en Puerto Rico y Canadá)",
    "Contenido en español; comunicación profesional también en inglés",
  ],
  expertiseItems: [
    "Entrenamiento de fuerza en mujeres",
    "Nutrición deportiva",
    "Embarazo y ciclo menstrual",
    "Pérdida de grasa y recomposición corporal",
    "Hipertrofia y rendimiento",
    "Hábitos sostenibles y coaching",
    "Wellness y lifestyle saludable",
    "Programas online y presenciales",
  ],
  collabItems: [
    {
      title: "Contenido patrocinado en Instagram",
      description:
        "Posts, reels o stories integrando producto o servicio con enfoque educativo y auténtico.",
    },
    {
      title: "Artículos y citas expertas",
      description:
        "Colaboraciones editoriales, entrevistas y aportación de contenido para medios digitales e impresos.",
    },
    {
      title: "Embajadora de marca",
      description: "Presencia recurrente en campañas wellness, fitness o nutrición a medio plazo.",
    },
    {
      title: "Workshops y charlas",
      description:
        "Sesiones formativas para empresas, gimnasios o eventos sobre entrenamiento y nutrición.",
    },
    {
      title: "Programas y retos de marca",
      description: "Diseño de retos, planes o contenidos exclusivos para comunidades de marca.",
    },
    {
      title: "Televisión y medios audiovisuales",
      description: "Participación como experta en programas, podcasts o producciones audiovisuales.",
    },
    {
      title: "Creación de videos UGC",
      description:
        "Vídeos auténticos tipo user-generated content para campañas de marca: testimonios, demos de producto, rutinas y contenido educativo en formato reel o vertical.",
    },
  ],
  collabNote:
    "Colaboraciones previas con ON AIR Fitness, Gravl, EntrenaVirtual y medios editoriales como Vogue, ELLE, ¡Hola! y Mujerhoy.",
  pricingItems: [
    { format: "Story Instagram", price: "", notes: "1–3 stories" },
    { format: "Post / Reel Instagram", price: "", notes: "Contenido educativo + producto" },
    { format: "Pack contenido (post + stories)", price: "", notes: "Campaña integrada" },
    { format: "Artículo / cita experta", price: "", notes: "Medios digitales o impresos" },
    { format: "Charla / workshop", price: "", notes: "Empresas, gimnasios, eventos" },
    { format: "Embajadora de marca", price: "", notes: "Acuerdo mensual o trimestral" },
  ],
  pricingNote:
    "Tarifas orientativas. El presupuesto final depende del alcance, exclusividad, uso de imagen y duración de la campaña.",
};

const EN_DEFAULTS: MediaKitLocaleBlock = {
  bioParagraph1:
    "I've always been a very active child who loved sports. After school I focused my career on deepening my knowledge of exercise science and nutrition — a field I fell in love with and turned into my profession.",
  bioParagraph2:
    "I specialised in strength training for women and sports nutrition, aiming to help people become their best selves. I want clients to see me not only as their trainer, but as a friend who supports them through the process.",
  audienceBullets: [
    "Women 25–45 interested in fitness, nutrition and wellness",
    "Amateur athletes and people seeking sustainable habit change",
    "Spanish audience with international reach (Vogue US, press in Puerto Rico and Canada)",
    "Content in Spanish; professional communication also in English",
  ],
  expertiseItems: [
    "Strength training for women",
    "Sports nutrition",
    "Pregnancy and menstrual cycle",
    "Fat loss and body recomposition",
    "Hypertrophy and performance",
    "Sustainable habits and coaching",
    "Wellness and healthy lifestyle",
    "Online and in-person programmes",
  ],
  collabItems: [
    {
      title: "Sponsored Instagram content",
      description: "Posts, reels or stories integrating product or service with an educational, authentic approach.",
    },
    {
      title: "Articles and expert quotes",
      description: "Editorial collaborations, interviews and expert content for digital and print media.",
    },
    {
      title: "Brand ambassador",
      description: "Ongoing presence in wellness, fitness or nutrition campaigns over the medium term.",
    },
    {
      title: "Workshops and talks",
      description: "Educational sessions for companies, gyms or events on training and nutrition.",
    },
    {
      title: "Brand programmes and challenges",
      description: "Design of challenges, plans or exclusive content for brand communities.",
    },
    {
      title: "Television and audiovisual media",
      description: "Expert appearances on shows, podcasts or audiovisual productions.",
    },
    {
      title: "UGC video creation",
      description:
        "Authentic user-generated-style videos for brand campaigns: testimonials, product demos, routines and educational content in reel or vertical format.",
    },
  ],
  collabNote:
    "Previous collaborations with ON AIR Fitness, Gravl, EntrenaVirtual and editorial outlets including Vogue, ELLE, ¡Hola! and Mujerhoy.",
  pricingItems: [
    { format: "Instagram Story", price: "", notes: "1–3 stories" },
    { format: "Instagram Post / Reel", price: "", notes: "Educational + product content" },
    { format: "Content pack (post + stories)", price: "", notes: "Integrated campaign" },
    { format: "Article / expert quote", price: "", notes: "Digital or print media" },
    { format: "Talk / workshop", price: "", notes: "Companies, gyms, events" },
    { format: "Brand ambassador", price: "", notes: "Monthly or quarterly agreement" },
  ],
  pricingNote:
    "Indicative rates. Final budget depends on scope, exclusivity, image rights and campaign duration.",
};

function envMetric(key: string): string {
  return process.env[key]?.trim() || "";
}

export function getDefaultMediaKitSettings(): MediaKitSettings {
  return {
    contact: {
      email: MEDIA_KIT_CONTACT.email,
      phone: MEDIA_KIT_CONTACT.phone,
      instagramPro: MEDIA_KIT_CONTACT.instagramPro,
      instagramPersonal: MEDIA_KIT_CONTACT.instagramPersonal,
      siteUrl: MEDIA_KIT_CONTACT.siteUrl,
    },
    stats: {
      clients: "+1000",
      years: "10+",
    },
    metrics: {
      igFitFollowers: envMetric("NEXT_PUBLIC_MEDIA_KIT_IG_FIT_FOLLOWERS"),
      igPersonalFollowers: envMetric("NEXT_PUBLIC_MEDIA_KIT_IG_PERSONAL_FOLLOWERS"),
      igEngagement: envMetric("NEXT_PUBLIC_MEDIA_KIT_IG_ENGAGEMENT"),
      igReach: "",
      igImpressions: "",
      tiktokFollowers: "",
      linkedinFollowers: "",
      youtubeSubscribers: "",
    },
    showPricing: true,
    collabExamples: [],
    collabCustomCategories: [],
    es: structuredClone(ES_DEFAULTS),
    en: structuredClone(EN_DEFAULTS),
  };
}

function mergeLocaleBlock(
  stored: Partial<MediaKitLocaleBlock> | undefined,
  defaults: MediaKitLocaleBlock
): MediaKitLocaleBlock {
  if (!stored) return structuredClone(defaults);
  return {
    bioParagraph1: stored.bioParagraph1?.trim() || defaults.bioParagraph1,
    bioParagraph2: stored.bioParagraph2?.trim() || defaults.bioParagraph2,
    audienceBullets:
      stored.audienceBullets?.filter((b) => b.trim())?.length
        ? stored.audienceBullets.filter((b) => b.trim())
        : defaults.audienceBullets,
    expertiseItems:
      stored.expertiseItems?.filter((b) => b.trim())?.length
        ? stored.expertiseItems.filter((b) => b.trim())
        : defaults.expertiseItems,
    collabItems:
      stored.collabItems?.filter((c) => c.title.trim())?.length
        ? stored.collabItems.filter((c) => c.title.trim())
        : defaults.collabItems,
    collabNote: stored.collabNote?.trim() || defaults.collabNote,
    pricingItems:
      stored.pricingItems?.filter((p) => p.format.trim())?.length
        ? stored.pricingItems.filter((p) => p.format.trim())
        : defaults.pricingItems,
    pricingNote: stored.pricingNote?.trim() || defaults.pricingNote,
  };
}

function mergeCollabExamples(
  stored: MediaKitCollabExample[] | undefined,
  defaults: MediaKitCollabExample[],
  customCategories: CollabCustomCategory[]
): MediaKitCollabExample[] {
  if (!stored?.length) return defaults;
  return stored
    .filter(
      (item) =>
        item.url.trim() &&
        item.category?.trim() &&
        isKnownCollabCategory(item.category.trim(), customCategories)
    )
    .map((item) => ({
      category: item.category.trim(),
      url: item.url.trim(),
      title: item.title?.trim() || "",
    }));
}

export function mergeMediaKitSettings(stored: Partial<MediaKitSettings> | null | undefined): MediaKitSettings {
  const defaults = getDefaultMediaKitSettings();
  if (!stored) return defaults;

  const collabCustomCategories = mergeCollabCustomCategories(
    stored.collabCustomCategories,
    stored.collabExamples ?? []
  );

  return {
    contact: {
      email: stored.contact?.email?.trim() || defaults.contact.email,
      phone: stored.contact?.phone?.trim() || defaults.contact.phone,
      instagramPro: stored.contact?.instagramPro?.trim() || defaults.contact.instagramPro,
      instagramPersonal: stored.contact?.instagramPersonal?.trim() || defaults.contact.instagramPersonal,
      siteUrl: stored.contact?.siteUrl?.trim() || defaults.contact.siteUrl,
    },
    stats: {
      clients: stored.stats?.clients?.trim() || defaults.stats.clients,
      years: stored.stats?.years?.trim() || defaults.stats.years,
    },
    metrics: {
      igFitFollowers: stored.metrics?.igFitFollowers?.trim() || defaults.metrics.igFitFollowers,
      igPersonalFollowers: stored.metrics?.igPersonalFollowers?.trim() || defaults.metrics.igPersonalFollowers,
      igEngagement: stored.metrics?.igEngagement?.trim() || defaults.metrics.igEngagement,
      igReach: stored.metrics?.igReach?.trim() || defaults.metrics.igReach,
      igImpressions: stored.metrics?.igImpressions?.trim() || defaults.metrics.igImpressions,
      tiktokFollowers: stored.metrics?.tiktokFollowers?.trim() || defaults.metrics.tiktokFollowers,
      linkedinFollowers: stored.metrics?.linkedinFollowers?.trim() || defaults.metrics.linkedinFollowers,
      youtubeSubscribers: stored.metrics?.youtubeSubscribers?.trim() || defaults.metrics.youtubeSubscribers,
    },
    showPricing: stored.showPricing ?? defaults.showPricing,
    collabExamples: mergeCollabExamples(
      stored.collabExamples,
      defaults.collabExamples,
      collabCustomCategories
    ),
    collabCustomCategories,
    es: mergeLocaleBlock(stored.es, defaults.es),
    en: mergeLocaleBlock(stored.en, defaults.en),
  };
}

export function getMediaKitLocaleBlock(settings: MediaKitSettings, locale: string): MediaKitLocaleBlock {
  return locale === "en" ? settings.en : settings.es;
}

export async function getMediaKitSettings(): Promise<MediaKitSettings> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("media_kit_settings")
      .select("data")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data?.data) {
      return getDefaultMediaKitSettings();
    }

    return mergeMediaKitSettings(data.data as Partial<MediaKitSettings>);
  } catch {
    return getDefaultMediaKitSettings();
  }
}

export function buildWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}
