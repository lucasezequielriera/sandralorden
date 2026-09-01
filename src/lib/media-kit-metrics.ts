/** Métricas de redes para el media kit (opcional vía env; no inventar cifras). */

export type MediaKitSocialMetrics = {
  igFitFollowers: string | null;
  igPersonalFollowers: string | null;
  igEngagement: string | null;
};

export function getMediaKitSocialMetrics(): MediaKitSocialMetrics {
  return {
    igFitFollowers: process.env.NEXT_PUBLIC_MEDIA_KIT_IG_FIT_FOLLOWERS?.trim() || null,
    igPersonalFollowers: process.env.NEXT_PUBLIC_MEDIA_KIT_IG_PERSONAL_FOLLOWERS?.trim() || null,
    igEngagement: process.env.NEXT_PUBLIC_MEDIA_KIT_IG_ENGAGEMENT?.trim() || null,
  };
}

export const MEDIA_KIT_CONTACT = {
  email: "sandralordenfit@gmail.com",
  phone: "+34660140063",
  whatsAppUrl: "https://wa.me/34660140063",
  siteUrl: "https://www.sandralorden.com",
  instagramPro: "https://www.instagram.com/sandralordenfit",
  instagramPersonal: "https://www.instagram.com/sandralorden",
  twitterHandle: "@sandralorden",
} as const;
