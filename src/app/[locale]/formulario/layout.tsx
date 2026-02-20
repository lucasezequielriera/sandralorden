import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Formulario" });
  const url = locale === "es" ? "https://www.sandralorden.com/formulario" : "https://www.sandralorden.com/en/formulario";
  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
    alternates: { canonical: url },
    openGraph: {
      title: `${t("pageTitle")} | Sandra Lorden`,
      description: t("pageSubtitle"),
      url,
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      siteName: "Sandra Lorden",
    },
    robots: { index: false, follow: true },
  };
}

export default function FormularioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
