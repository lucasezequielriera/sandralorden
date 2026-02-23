import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Dancing_Script } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import MotionProvider from "@/components/MotionProvider";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.sandralorden.com";
const SITE_NAME = "Sandra Lorden";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#3D2C2C" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const url = locale === "es" ? SITE_URL : `${SITE_URL}/en`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
    keywords: t("keywords"),
    authors: [
      { name: "Sandra Lorden", url: SITE_URL },
      { name: "Lucas Riera", url: "https://www.lucasriera.com" },
    ],
    creator: "Lucas Riera",
    publisher: "Sandra Lorden",
    alternates: {
      canonical: url,
      languages: {
        es: SITE_URL,
        en: `${SITE_URL}/en`,
        "x-default": SITE_URL,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_ES",
      url,
      siteName: SITE_NAME,
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("twitterDescription"),
      creator: "@sandralorden",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: { icon: "/icon", apple: "/apple-icon" },
    manifest: "/manifest.json",
    category: "fitness",
    other: {
      "google-site-verification": "KiaTi5WqqMF79O_CBWretnFkteRu3jWF1iTsLwpWmAI",
    },
  };
}

async function JsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const tFaq = await getTranslations({ locale, namespace: "FAQ" });
  const url = locale === "es" ? SITE_URL : `${SITE_URL}/en`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Sandra Lorden",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    jobTitle:
      locale === "es"
        ? "Entrenadora Personal y Nutricionista Deportiva"
        : "Personal Trainer and Sports Nutritionist",
    description: t("description"),
    knowsAbout:
      locale === "es"
        ? [
            "Entrenamiento personal",
            "Nutrición deportiva",
            "Fitness femenino",
            "Entrenamiento funcional",
            "Planes de nutrición",
            "Entrenamiento online",
          ]
        : [
            "Personal training",
            "Sports nutrition",
            "Women's fitness",
            "Functional training",
            "Nutrition plans",
            "Online training",
          ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name:
        locale === "es"
          ? "Universidad — Grado en Ciencias del Deporte y la Actividad Física"
          : "University — Degree in Exercise Science and Physical Activity",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name:
          locale === "es"
            ? "Grado en Ciencias del Deporte y la Actividad Física (CAFYD)"
            : "Degree in Exercise Science and Physical Activity (CAFYD)",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name:
          locale === "es"
            ? "Máster en Nutrición Deportiva"
            : "Master's in Sports Nutrition",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name:
          locale === "es"
            ? "Máster en Alto Rendimiento"
            : "Master's in High Performance",
      },
    ],
    sameAs: [
      "https://www.instagram.com/sandralordenfit",
      "https://www.instagram.com/sandralorden",
    ],
    address: { "@type": "PostalAddress", addressCountry: "ES" },
    telephone: "+34660140063",
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name:
      locale === "es"
        ? "Sandra Lorden — Entrenadora Personal y Nutricionista"
        : "Sandra Lorden — Personal Trainer & Nutritionist",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    description: t("description"),
    telephone: "+34660140063",
    email: "sandralordenfit@gmail.com",
    address: { "@type": "PostalAddress", addressCountry: "ES" },
    geo: { "@type": "GeoCoordinates", latitude: 40.4168, longitude: -3.7038 },
    areaServed: [
      { "@type": "City", name: "Madrid" },
      { "@type": "Country", name: locale === "es" ? "España" : "Spain" },
      { "@type": "Place", name: "Online / Virtual" },
    ],
    priceRange: "€€",
    founder: { "@id": `${SITE_URL}/#person` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name:
        locale === "es"
          ? "Servicios de Sandra Lorden"
          : "Sandra Lorden's Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              locale === "es"
                ? "Entrenamiento Personal Presencial"
                : "In-Person Personal Training",
            description:
              locale === "es"
                ? "Sesiones individuales presenciales a domicilio o al aire libre con corrección postural y material portátil profesional."
                : "Individual in-person sessions at home or outdoors with posture correction and professional portable equipment.",
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "50",
            priceCurrency: "EUR",
            unitText: locale === "es" ? "sesión" : "session",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              locale === "es"
                ? "Asesoría Online — Nutrición"
                : "Online Coaching — Nutrition",
            description:
              locale === "es"
                ? "Plan nutricional personalizado adaptado a tus gustos, horarios y objetivos con seguimiento continuo."
                : "Personalized nutrition plan adapted to your tastes, schedule, and goals with ongoing support.",
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "59",
            priceCurrency: "EUR",
            unitText: locale === "es" ? "mes" : "month",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              locale === "es"
                ? "Asesoría Online — Entrenamiento"
                : "Online Coaching — Training",
            description:
              locale === "es"
                ? "Plan de entrenamiento individualizado para gimnasio o casa con fotos, anotaciones y seguimiento."
                : "Individualized training plan for gym or home with photos, notes, and ongoing support.",
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "59",
            priceCurrency: "EUR",
            unitText: locale === "es" ? "mes" : "month",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              locale === "es"
                ? "Asesoría Online — Pack Completo"
                : "Online Coaching — Complete Pack",
            description:
              locale === "es"
                ? "Pack de entrenamiento + nutrición personalizado con seguimiento diario y checking mensual."
                : "Training + nutrition pack with daily support and monthly check-ins.",
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "79",
            priceCurrency: "EUR",
            unitText: locale === "es" ? "mes" : "month",
          },
        },
      ],
    },
    sameAs: [
      "https://www.instagram.com/sandralordenfit",
      "https://www.instagram.com/sandralorden",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: t("description"),
    publisher: { "@id": `${SITE_URL}/#person` },
    creator: {
      "@type": "Person",
      name: "Lucas Riera",
      url: "https://www.lucasriera.com",
      jobTitle:
        locale === "es"
          ? "Desarrollador & Diseñador Web"
          : "Web Developer & Designer",
    },
    inLanguage: locale === "es" ? "es-ES" : "en",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "es" ? "Inicio" : "Home",
        item: url,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4, 5, 6].map((i) => ({
      "@type": "Question",
      name: tFaq(`q${i}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: tFaq(`a${i}`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <JsonLd locale={locale} />
        <link rel="author" href="https://www.lucasriera.com" />
        <link rel="humans" type="text/plain" href="/humans.txt" />
      </head>
      <body
        className={`${cormorant.variable} ${dancingScript.variable} ${dmSans.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
        <ConditionalAnalytics />
      </body>
    </html>
  );
}
