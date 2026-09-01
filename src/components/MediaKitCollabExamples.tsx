"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  type CollabCustomCategory,
  type MediaKitCollabExample,
  instagramUrlToEmbed,
  isBuiltInCollabCategory,
  orderedCollabCategoryIds,
} from "@/lib/media-kit-collab-examples";

type FilterId = "all" | string;

function CollabVideoCard({
  example,
  categoryLabel,
  invalidLabel,
}: {
  example: MediaKitCollabExample;
  categoryLabel: string;
  invalidLabel: string;
}) {
  const embedUrl = instagramUrlToEmbed(example.url);
  const customTitle = example.title.trim();
  const displayTitle = customTitle || categoryLabel;

  return (
    <article className="group relative">
      <div
        className="relative overflow-hidden rounded-3xl bg-warm-dark/5 shadow-[0_8px_30px_rgba(45,37,32,0.06)] ring-1 ring-black/[0.04] transition-all duration-300 group-hover:shadow-[0_16px_40px_rgba(45,37,32,0.1)] group-hover:ring-rosa-200/60"
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-crema">
          {embedUrl ? (
            <>
              <iframe
                src={embedUrl}
                title={displayTitle}
                className="absolute left-0 w-full border-0 pointer-events-auto"
                style={{
                  top: "-52px",
                  height: "calc(100% + 148px)",
                }}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/[0.06]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 via-black/5 to-transparent"
                aria-hidden
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-marron-400 font-medium">
                {categoryLabel}
              </span>
              <span className="text-sm font-medium text-warm-dark">{displayTitle}</span>
              <span className="text-xs text-red-400">{invalidLabel}</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-2 pointer-events-none">
          <span
            className="inline-flex max-w-[85%] items-center rounded-full bg-white/92 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-warm-gray-600 shadow-sm backdrop-blur-md"
          >
            {categoryLabel}
          </span>
        </div>
      </div>

      {customTitle ? (
        <p className="mt-2.5 px-1 text-center text-xs text-warm-gray-500 leading-snug line-clamp-2">
          {customTitle}
        </p>
      ) : null}
    </article>
  );
}

export default function MediaKitCollabExamples({
  examples,
  customCategories = [],
}: {
  examples: MediaKitCollabExample[];
  customCategories?: CollabCustomCategory[];
}) {
  const t = useTranslations("MediaKit");
  const [filter, setFilter] = useState<FilterId>("all");

  const categoryLabel = (id: string) => {
    if (isBuiltInCollabCategory(id)) {
      return t(`collabExCat_${id}` as "collabExCat_restaurantes");
    }
    const custom = customCategories.find((c) => c.id === id);
    return custom?.label ?? id;
  };

  const categoriesWithContent = useMemo(
    () => orderedCollabCategoryIds(examples, customCategories),
    [examples, customCategories]
  );

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

        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label={t("collabExamplesFilterLabel")}>
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              filter === "all"
                ? "bg-warm-dark text-white shadow-sm"
                : "bg-white/80 border border-warm-gray-200/80 text-warm-gray-500 hover:border-rosa-200 hover:text-warm-dark hover:bg-white"
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                filter === cat
                  ? "bg-warm-dark text-white shadow-sm"
                  : "bg-white/80 border border-warm-gray-200/80 text-warm-gray-500 hover:border-rosa-200 hover:text-warm-dark hover:bg-white"
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-warm-gray-400">{t("collabExamplesEmpty")}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filtered.map((example, i) => (
              <CollabVideoCard
                key={`${example.category}-${example.url}-${i}`}
                example={example}
                categoryLabel={categoryLabel(example.category)}
                invalidLabel={t("collabExInvalidUrl")}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
