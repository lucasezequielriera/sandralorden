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

export type CollabCustomCategory = {
  id: string;
  label: string;
};

export type MediaKitCollabExample = {
  category: string;
  url: string;
  title: string;
};

export const NEW_COLLAB_CATEGORY_VALUE = "__new__";

export function isBuiltInCollabCategory(value: string): value is CollabExampleCategory {
  return (COLLAB_EXAMPLE_CATEGORIES as readonly string[]).includes(value);
}

/** @deprecated Use isBuiltInCollabCategory */
export function isValidCollabExampleCategory(value: string): value is CollabExampleCategory {
  return isBuiltInCollabCategory(value);
}

export function slugifyCollabCategory(label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  if (!slug) return "";
  if (isBuiltInCollabCategory(slug)) return `${slug}-custom`;
  return slug;
}

export function humanizeCollabCategoryId(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function isKnownCollabCategory(
  id: string,
  customCategories: CollabCustomCategory[]
): boolean {
  return isBuiltInCollabCategory(id) || customCategories.some((c) => c.id === id);
}

export function mergeCollabCustomCategories(
  stored: CollabCustomCategory[] | undefined,
  examples: MediaKitCollabExample[]
): CollabCustomCategory[] {
  const map = new Map<string, CollabCustomCategory>();

  for (const item of stored ?? []) {
    const id = item.id?.trim();
    const label = item.label?.trim();
    if (!id || isBuiltInCollabCategory(id)) continue;
    map.set(id, { id, label: label || humanizeCollabCategoryId(id) });
  }

  for (const example of examples) {
    const id = example.category?.trim();
    if (!id || isBuiltInCollabCategory(id)) continue;
    if (!map.has(id)) {
      map.set(id, { id, label: humanizeCollabCategoryId(id) });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "es", { sensitivity: "base" })
  );
}

export function registerCollabCustomCategory(
  customCategories: CollabCustomCategory[],
  label: string
): { categories: CollabCustomCategory[]; id: string } {
  const trimmed = label.trim();
  const id = slugifyCollabCategory(trimmed);
  if (!id) return { categories: customCategories, id: "" };

  if (isBuiltInCollabCategory(id)) {
    return { categories: customCategories, id };
  }

  const existing = customCategories.find((c) => c.id === id);
  if (existing) {
    const categories = customCategories.map((c) =>
      c.id === id ? { ...c, label: trimmed || c.label } : c
    );
    return { categories, id };
  }

  return {
    categories: [...customCategories, { id, label: trimmed }],
    id,
  };
}

export function orderedCollabCategoryIds(
  examples: MediaKitCollabExample[],
  customCategories: CollabCustomCategory[]
): string[] {
  const withEmbed = new Set<string>();
  for (const ex of examples) {
    if (instagramUrlToEmbed(ex.url)) withEmbed.add(ex.category);
  }

  const builtIn = COLLAB_EXAMPLE_CATEGORIES.filter((c) => withEmbed.has(c));
  const custom = customCategories
    .map((c) => c.id)
    .filter((id) => withEmbed.has(id) && !isBuiltInCollabCategory(id));

  const orphan = [...withEmbed].filter(
    (id) => !builtIn.includes(id as CollabExampleCategory) && !custom.includes(id)
  );

  return [...builtIn, ...custom, ...orphan.sort()];
}

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

    return `https://www.instagram.com/${type}/${id}/embed`;
  } catch {
    return null;
  }
}
