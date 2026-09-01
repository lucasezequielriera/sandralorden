import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  MEDIA_LOGOS,
  PRESS_ITEMS,
  PRESS_TYPE_I18N_KEYS,
  LANDING_TV_FEATURE,
} from "@/lib/press-items";
import {
  getMediaKitSettings,
  getMediaKitLocaleBlock,
  buildWhatsAppUrl,
} from "@/lib/media-kit-settings";
import MediaKitDownloadButton from "@/components/MediaKitDownloadButton";
import MediaKitCollabExamples from "@/components/MediaKitCollabExamples";

const PRESS_HIGHLIGHT_COUNT = 8;

export default async function MediaKitContent() {
  const locale = await getLocale();
  const t = await getTranslations("MediaKit");
  const tPress = await getTranslations("Press");
  const tAbout = await getTranslations("About");
  const settings = await getMediaKitSettings();
  const block = getMediaKitLocaleBlock(settings, locale);
  const contact = settings.contact;
  const metrics = settings.metrics;

  const pressCount = PRESS_ITEMS.length;
  const mediaOutletCount = MEDIA_LOGOS.length;

  const statCards = [
    { value: settings.stats.clients, label: t("statClients") },
    { value: settings.stats.years, label: t("statYears") },
    { value: String(pressCount), label: t("statPress") },
    { value: String(mediaOutletCount), label: t("statOutlets") },
  ];

  const socialRows = [
    {
      platform: t("socialIgPersonal"),
      handle: "@sandralorden",
      url: contact.instagramPersonal,
      metric: metrics.igPersonalFollowers,
    },
    {
      platform: t("socialIgPro"),
      handle: "@sandralordenfit",
      url: contact.instagramPro,
      metric: metrics.igFitFollowers,
    },
  ];

  const extraMetrics = [
    { label: t("reachLabel"), value: metrics.igReach },
    { label: t("impressionsLabel"), value: metrics.igImpressions },
    { label: "TikTok", value: metrics.tiktokFollowers },
    { label: "LinkedIn", value: metrics.linkedinFollowers },
    { label: "YouTube", value: metrics.youtubeSubscribers },
  ].filter((m) => m.value.trim());

  const mailSubject = encodeURIComponent(t("mailtoSubject"));
  const mailBody = encodeURIComponent(t("mailtoBody"));
  const whatsAppUrl = buildWhatsAppUrl(contact.phone);

  return (
    <div className="bg-crema">
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rosa-50/80 via-crema to-marron-50/40 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
                {t("eyebrow")}
              </p>
              <h1 className="font-[family-name:var(--font-display)] italic text-4xl sm:text-5xl md:text-6xl font-light text-warm-dark leading-tight mb-4">
                {t("title")}
              </h1>
              <p className="text-lg sm:text-xl text-warm-gray-500 leading-relaxed max-w-2xl mb-2">
                {t("subtitle")}
              </p>
              <p className="text-sm text-warm-gray-400 mb-8">{t("locationLine")}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${contact.email}?subject=${mailSubject}&body=${mailBody}`}
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-full hover:bg-warm-gray-500 transition-colors"
                >
                  {t("ctaCollaborate")}
                </a>
                <a
                  href={contact.instagramPersonal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-warm-dark border border-warm-gray-200 rounded-full hover:border-rosa-300 hover:text-rosa-500 transition-colors"
                >
                  {t("ctaInstagram")}
                </a>
                <MediaKitDownloadButton />
              </div>
            </div>
            <div className="relative mx-auto lg:mx-0 w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl ring-1 ring-warm-gray-100">
              <Image
                src="/images/IMG_1902.jpg"
                alt={tAbout("imageAlt")}
                fill
                className="object-cover object-center"
                sizes="280px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white border-y border-warm-gray-100" aria-labelledby="mk-stats">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <h2 id="mk-stats" className="sr-only">{t("statsHeading")}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-light text-warm-dark">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-warm-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="mk-bio">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 id="mk-bio" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-6">
              {t("bioTitle")}
            </h2>
            <p className="text-warm-gray-500 leading-relaxed mb-4">{block.bioParagraph1}</p>
            <p className="text-warm-gray-500 leading-relaxed">{block.bioParagraph2}</p>
            <blockquote className="mt-8 border-l-2 border-rosa-300 pl-4 italic text-warm-gray-500">
              “{tAbout("titleLine1")} {tAbout("titleLine2")}”
            </blockquote>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-marron-400 font-medium mb-6">
              {t("credentialsTitle")}
            </h3>
            <ul className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="rounded-xl border border-warm-gray-100 bg-white/70 p-4">
                  <p className="font-medium text-warm-dark text-sm">
                    {tAbout(`credTitle${i}` as "credTitle1")}
                  </p>
                  <p className="text-sm text-warm-gray-400 mt-0.5">
                    {tAbout(`credDesc${i}` as "credDesc1")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-warm-dark text-white" aria-labelledby="mk-audience">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <h2 id="mk-audience" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light mb-3">
            {t("audienceTitle")}
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">{t("audienceIntro")}</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {socialRows.map((row) => (
              <a
                key={row.url}
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors group"
              >
                <p className="text-[10px] uppercase tracking-widest text-rosa-300/90 mb-1">{row.platform}</p>
                <p className="font-medium text-white group-hover:text-rosa-100">{row.handle}</p>
                <p className="mt-3 text-sm text-white/60">
                  {t("followersLabel")}:{" "}
                  <span className="text-white/90 font-medium">
                    {row.metric.trim() ? row.metric : t("metricOnRequest")}
                  </span>
                </p>
              </a>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-white/50">{t("engagementLabel")}: </span>
              <span className="text-white font-medium">
                {metrics.igEngagement.trim() ? metrics.igEngagement : t("metricOnRequest")}
              </span>
            </div>
            {extraMetrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <span className="text-white/50">{m.label}: </span>
                <span className="text-white font-medium">{m.value}</span>
              </div>
            ))}
          </div>

          <ul className="grid sm:grid-cols-2 gap-3">
            {block.audienceBullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/80">
                <span className="text-rosa-300 shrink-0">·</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MediaKitCollabExamples
        examples={settings.collabExamples}
        customCategories={settings.collabCustomCategories}
      />

      <section className="py-16 sm:py-20 bg-white" aria-labelledby="mk-expertise">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <h2 id="mk-expertise" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-8">
            {t("expertiseTitle")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {block.expertiseItems.map((item) => (
              <span
                key={item}
                className="text-sm px-4 py-2 rounded-full bg-rosa-50 text-warm-gray-600 border border-rosa-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {settings.showPricing && block.pricingItems.length > 0 && (
        <section className="py-16 sm:py-20 bg-rosa-50/40 border-y border-rosa-100" aria-labelledby="mk-pricing">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <h2 id="mk-pricing" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-3">
              {t("pricingTitle")}
            </h2>
            <p className="text-warm-gray-400 text-sm mb-10 max-w-2xl">{t("pricingSub")}</p>
            <div className="overflow-x-auto rounded-2xl border border-rosa-100 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-gray-100 text-left">
                    <th className="px-5 py-4 font-medium text-warm-dark">{t("pricingFormat")}</th>
                    <th className="px-5 py-4 font-medium text-warm-dark">{t("pricingRate")}</th>
                    <th className="px-5 py-4 font-medium text-warm-dark">{t("pricingNotes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {block.pricingItems.map((item, i) => (
                    <tr key={i} className="border-b border-warm-gray-50 last:border-0">
                      <td className="px-5 py-4 text-warm-dark">{item.format}</td>
                      <td className="px-5 py-4 text-warm-gray-600 font-medium">
                        {item.price.trim() ? item.price : t("pricingOnRequest")}
                      </td>
                      <td className="px-5 py-4 text-warm-gray-400">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {block.pricingNote.trim() && (
              <p className="mt-6 text-sm text-warm-gray-500">{block.pricingNote}</p>
            )}
          </div>
        </section>
      )}

      <section className="py-14 sm:py-16 bg-gradient-to-b from-rosa-50/30 to-crema" aria-labelledby="mk-logos">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center">
          <h2 id="mk-logos" className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark mb-3">
            {t("mediaTitle")}
          </h2>
          <p className="text-sm text-warm-gray-400 max-w-xl mx-auto mb-10">{t("mediaSub")}</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {MEDIA_LOGOS.map((logo) => (
              <div key={logo.name} className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={120}
                  height={44}
                  className="h-7 sm:h-9 w-auto max-w-[7rem] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="mk-press">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <h2 id="mk-press" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-3">
            {t("pressTitle")}
          </h2>
          <p className="text-warm-gray-400 text-sm mb-10 max-w-2xl">{t("pressSub")}</p>

          <a
            href={LANDING_TV_FEATURE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-8 rounded-2xl border-2 border-rosa-200 bg-rosa-50/50 p-6 sm:p-8 hover:shadow-md transition-shadow"
          >
            <span className="text-[10px] uppercase tracking-widest text-rosa-500 font-semibold">{tPress("typeTV")}</span>
            <h3 className="font-[family-name:var(--font-display)] italic text-xl text-warm-dark mt-2 mb-1">
              {LANDING_TV_FEATURE.outlet}
            </h3>
            <p className="text-sm text-warm-gray-500">{t("tvFeatureDesc")}</p>
          </a>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESS_ITEMS.slice(0, PRESS_HIGHLIGHT_COUNT).map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-warm-gray-100 bg-white p-4 hover:border-rosa-200 hover:shadow-sm transition-all h-full"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-marron-400">
                    {tPress(PRESS_TYPE_I18N_KEYS[item.type])}
                  </span>
                  <span className="text-[10px] text-warm-gray-300 shrink-0">
                    {new Date(item.date).toLocaleDateString(locale, { month: "short", year: "numeric" })}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] italic text-base text-warm-dark mb-2">{item.name}</h3>
                <p className="text-xs text-warm-gray-400 leading-relaxed flex-1 line-clamp-3">{item.title}</p>
              </a>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href={{ pathname: "/", hash: "prensa" }} className="text-sm font-medium text-rosa-500 hover:text-rosa-600 underline underline-offset-4">
              {t("pressSeeAll")}
            </Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-t border-warm-gray-100" aria-labelledby="mk-collab">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <h2 id="mk-collab" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-3">
            {t("collabTitle")}
          </h2>
          <p className="text-warm-gray-400 text-sm mb-10 max-w-2xl">{t("collabSub")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {block.collabItems.map((item) => (
              <div key={item.title} className="rounded-xl border border-warm-gray-100 p-5 bg-crema/50">
                <h3 className="font-medium text-warm-dark text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-warm-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          {block.collabNote.trim() && (
            <p className="mt-8 text-sm text-warm-gray-500">{block.collabNote}</p>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-warm-dark text-white" aria-labelledby="mk-contact">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 id="mk-contact" className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light mb-4">
            {t("contactTitle")}
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-8 leading-relaxed">{t("contactSub")}</p>
          <ul className="text-sm text-white/80 space-y-2 mb-8">
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-rosa-200 underline underline-offset-2">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={whatsAppUrl} className="hover:text-rosa-200 underline underline-offset-2">
                WhatsApp {contact.phone}
              </a>
            </li>
            <li>{contact.siteUrl}</li>
          </ul>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${contact.email}?subject=${mailSubject}&body=${mailBody}`}
              className="inline-flex items-center px-8 py-3.5 text-sm font-medium text-warm-dark bg-white rounded-full hover:bg-rosa-50 transition-colors"
            >
              {t("contactCta")}
            </a>
            <MediaKitDownloadButton className="border-white/30 text-white hover:border-rosa-200 hover:text-rosa-100" />
          </div>
        </div>
      </section>
    </div>
  );
}
