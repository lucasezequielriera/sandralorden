import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CookieBanner from "@/components/CookieBanner";
import PremiumLanding from "@/components/landing/PremiumLanding";

const SITE_URL = "https://www.sandralorden.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LandingMeta" });
  const path = locale === "es" ? "/landing" : "/en/landing";
  const canonical = `${SITE_URL}${path}`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        es: `${SITE_URL}/landing`,
        en: `${SITE_URL}/en/landing`,
        "x-default": `${SITE_URL}/landing`,
      },
    },
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: canonical,
      locale: locale === "es" ? "es_ES" : "en_US",
      siteName: "Sandra Lorden",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LandingPage() {
  const t = await getTranslations("Landing");

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] px-4 py-2 bg-warm-dark text-white rounded-lg text-sm -translate-y-20 opacity-0 pointer-events-none focus:translate-y-0 focus:opacity-100 focus:pointer-events-auto transition-all"
      >
        {t("skipToContent")}
      </a>
      <PremiumLanding />
      <CookieBanner />
    </>
  );
}
