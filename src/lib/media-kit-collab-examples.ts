export const COLLAB_EXAMPLE_CATEGORIES = [
  "restaurantes",
  "hoteles",
  "recetas",
  "on-air",
  "wellness",
  "myprotein",
  "teveo",
] as const;

export type CollabExampleCategory = (typeof COLLAB_EXAMPLE_CATEGORIES)[number];

export type MediaKitCollabExample = {
  category: CollabExampleCategory;
  url: string;
  title: string;
};

/** Convierte URL de post/reel IG a URL de embed. */
export function instagramUrlToEmbed(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (!parsed.hostname.includes("instagram.com")) return null;

    const parts = parsed.pathname.split("/").filter(Boolean);
    const type = parts[0];
    const id = parts[1];
    if (!id || !["reel", "p", "tv"].includes(type)) return null;

    return `https://www.instagram.com/${type}/${id}/embed/captioned`;
  } catch {
    return null;
  }
}

export function isValidCollabExampleCategory(value: string): value is CollabExampleCategory {
  return (COLLAB_EXAMPLE_CATEGORIES as readonly string[]).includes(value);
}
