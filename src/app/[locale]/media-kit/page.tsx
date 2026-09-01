import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import MediaKitContent from "@/components/MediaKitContent";

const SITE_URL = "https://www.sandralorden.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MediaKit" });
  const path = locale === "es" ? "/media-kit" : "/en/media-kit";
  const canonical = `${SITE_URL}${path}`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: {
        es: `${SITE_URL}/media-kit`,
        en: `${SITE_URL}/en/media-kit`,
        "x-default": `${SITE_URL}/media-kit`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function MediaKitPage() {
  const t = await getTranslations("Page");

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] px-4 py-2 bg-warm-dark text-white rounded-lg text-sm -translate-y-20 opacity-0 pointer-events-none focus:translate-y-0 focus:opacity-100 focus:pointer-events-auto transition-all"
      >
        {t("skipToContent")}
      </a>
      <Navigation />
      <main id="main-content">
        <MediaKitContent />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
