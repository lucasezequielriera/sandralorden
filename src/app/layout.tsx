import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.sandralorden.com";
const SITE_NAME = "Sandra Lorden";
const TITLE_DEFAULT = "Sandra Lorden | Entrenadora Personal y Nutricionista en España";
const TITLE_TEMPLATE = "%s | Sandra Lorden";
const DESCRIPTION =
  "Sandra Lorden — entrenadora personal certificada y nutricionista deportiva en España. Planes de entrenamiento personalizados (presencial y online) y nutrición deportiva. +500 clientes transformados y +8 años de experiencia. Colaboradora de Gravl y EntrenaVirtual. Empieza tu transformación hoy.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#3D2C2C" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITLE_DEFAULT,
    template: TITLE_TEMPLATE,
  },
  description: DESCRIPTION,

  keywords: [
    "entrenadora personal",
    "entrenadora personal España",
    "entrenadora personal online",
    "entrenadora personal mujer",
    "nutricionista deportiva",
    "nutricionista online",
    "nutrición deportiva",
    "entrenamiento personalizado",
    "entrenamiento virtual",
    "entrenamiento presencial",
    "planes de entrenamiento",
    "planes de nutrición",
    "fitness femenino",
    "entrenamiento para mujeres",
    "perder grasa",
    "ganar músculo",
    "definición muscular",
    "hábitos saludables",
    "transformación física",
    "Sandra Lorden",
    "Gravl",
    "EntrenaVirtual",
    "entrenadora personal certificada",
    "nutricionista España",
  ],

  authors: [{ name: "Sandra Lorden", url: SITE_URL }],
  creator: "Sandra Lorden",
  publisher: "Sandra Lorden",

  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-ES": SITE_URL,
      "es": SITE_URL,
    },
  },

  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Sandra Lorden — Entrenadora Personal y Nutricionista",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description:
      "Entrenadora personal certificada y nutricionista deportiva. Planes personalizados de entrenamiento y nutrición. +500 clientes transformados.",
    images: [`${SITE_URL}/og-image.png`],
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

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/manifest.json",

  category: "fitness",

  other: {
    "google-site-verification": "REPLACE_WITH_YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Sandra Lorden",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    jobTitle: "Entrenadora Personal y Nutricionista Deportiva",
    description: DESCRIPTION,
    knowsAbout: [
      "Entrenamiento personal",
      "Nutrición deportiva",
      "Fitness femenino",
      "Entrenamiento funcional",
      "Planes de nutrición",
      "Entrenamiento online",
    ],
    worksFor: [
      { "@type": "Organization", name: "Gravl" },
      { "@type": "Organization", name: "EntrenaVirtual" },
    ],
    sameAs: [
      "https://instagram.com/sandralorden",
      "https://tiktok.com/@sandralorden",
      "https://youtube.com/@sandralorden",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "ES",
    },
    telephone: "+34660140063",
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: "Sandra Lorden — Entrenadora Personal y Nutricionista",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    description: DESCRIPTION,
    telephone: "+34660140063",
    email: "hola@sandralorden.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.4168,
      longitude: -3.7038,
    },
    areaServed: [
      { "@type": "Country", name: "España" },
      { "@type": "Place", name: "Online / Virtual" },
    ],
    priceRange: "€€",
    founder: { "@id": `${SITE_URL}/#person` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Sandra Lorden",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Entrenamiento Presencial",
            description:
              "Sesiones individuales one-to-one con corrección postural en tiempo real y motivación constante.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Entrenamiento Virtual",
            description:
              "Sesiones en vivo por videollamada con la misma calidad que presencial, desde cualquier lugar.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Nutrición Deportiva",
            description:
              "Planes nutricionales personalizados que complementan tu entrenamiento para resultados reales.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Programas Online",
            description:
              "Programas de entrenamiento completos a través de Gravl y EntrenaVirtual desde tu móvil.",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "500",
    },
    sameAs: [
      "https://instagram.com/sandralorden",
      "https://tiktok.com/@sandralorden",
      "https://youtube.com/@sandralorden",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "es-ES",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Sandra Lorden ofrece entrenamiento online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, Sandra Lorden ofrece entrenamiento virtual en vivo por videollamada, con la misma calidad que las sesiones presenciales. También tiene programas online a través de Gravl y EntrenaVirtual.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué servicios ofrece Sandra Lorden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sandra Lorden ofrece entrenamiento presencial, entrenamiento virtual, nutrición deportiva personalizada y programas online. Todos los planes son personalizados y adaptados a cada persona.",
        },
      },
      {
        "@type": "Question",
        name: "¿Sandra Lorden es nutricionista certificada?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, Sandra Lorden es entrenadora personal certificada y nutricionista deportiva con más de 8 años de experiencia y más de 500 clientes transformados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo empiezo con Sandra Lorden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Puedes empezar rellenando el cuestionario de transformación en la web. Sandra analizará tus datos y te contactará por WhatsApp para iniciar tu plan personalizado.",
        },
      },
    ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className={`${cormorant.variable} ${dancingScript.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
