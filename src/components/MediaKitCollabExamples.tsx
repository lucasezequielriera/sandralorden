"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  COLLAB_EXAMPLE_CATEGORIES,
  type CollabExampleCategory,
  type MediaKitCollabExample,
  instagramUrlToEmbed,
} from "@/lib/media-kit-collab-examples";

type FilterId = "all" | CollabExampleCategory;

function CollabVideoCard({
  example,
  categoryLabel,
  openLabel,
  invalidLabel,
}: {
  example: MediaKitCollabExample;
  categoryLabel: string;
  openLabel: string;
  invalidLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const embedUrl = instagramUrlToEmbed(example.url);
  const displayTitle = example.title.trim() || categoryLabel;

  return (
    <article className="flex flex-col rounded-2xl border border-warm-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative bg-crema aspect-[9/16] max-h-[420px] w-full">
        {expanded && embedUrl ? (
          <iframe
            src={embedUrl}
            title={displayTitle}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={() => embedUrl && setExpanded(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center cursor-pointer group bg-gradient-to-b from-rosa-50/80 to-crema hover:from-rosa-100/90 transition-colors"
            aria-label={`${openLabel}: ${displayTitle}`}
          >
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/90 text-rosa-500 shadow-md group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-marron-400 font-medium">{categoryLabel}</span>
            <span className="text-sm font-medium text-warm-dark line-clamp-2">{displayTitle}</span>
            {!embedUrl && <span className="text-xs text-red-400">{invalidLabel}</span>}
          </button>
        )}
      </div>
      <div className="px-3 py-3 flex items-center justify-between gap-2 border-t border-warm-gray-50">
        <p className="text-xs text-warm-gray-500 truncate">{displayTitle}</p>
        <a
          href={example.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-rosa-500 hover:text-rosa-600 shrink-0"
        >
          IG ↗
        </a>
      </div>
    </article>
  );
}

export default function MediaKitCollabExamples({ examples }: { examples: MediaKitCollabExample[] }) {
  const t = useTranslations("MediaKit");
  const [filter, setFilter] = useState<FilterId>("all");

  const categoryLabel = (id: CollabExampleCategory) =>
    t(`collabExCat_${id}` as "collabExCat_restaurantes");

  const categoriesWithContent = useMemo(() => {
    const set = new Set<CollabExampleCategory>();
    for (const ex of examples) {
      if (instagramUrlToEmbed(ex.url)) set.add(ex.category);
    }
    return COLLAB_EXAMPLE_CATEGORIES.filter((c) => set.has(c));
  }, [examples]);

  const filtered = useMemo(() => {
    if (filter === "all") return examples;
    return examples.filter((ex) => ex.category === filter);
  }, [examples, filter]);

  if (!examples.length) return null;

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-rosa-50/30" aria-labelledby="mk-collab-ex">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <h2
          id="mk-collab-ex"
          className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-3"
        >
          {t("collabExamplesTitle")}
        </h2>
        <p className="text-warm-gray-400 text-sm mb-8 max-w-2xl leading-relaxed">{t("collabExamplesSub")}</p>

        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label={t("collabExamplesFilterLabel")}>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-warm-dark text-white"
                : "bg-white border border-warm-gray-200 text-warm-gray-500 hover:border-rosa-200 hover:text-warm-dark"
            }`}
          >
            {t("collabExFilterAll")}
          </button>
          {categoriesWithContent.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                filter === cat
                  ? "bg-warm-dark text-white"
                  : "bg-white border border-warm-gray-200 text-warm-gray-500 hover:border-rosa-200 hover:text-warm-dark"
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-warm-gray-400">{t("collabExamplesEmpty")}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((example, i) => (
              <CollabVideoCard
                key={`${example.category}-${example.url}-${i}`}
                example={example}
                categoryLabel={categoryLabel(example.category)}
                openLabel={t("collabExPlay")}
                invalidLabel={t("collabExInvalidUrl")}
              />
            ))}
          </div>
        )}

        <p className="mt-8 text-xs text-warm-gray-400 max-w-2xl">{t("collabExamplesHint")}</p>
      </div>
    </section>
  );
}
