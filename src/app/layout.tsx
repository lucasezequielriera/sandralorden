import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Dancing_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MotionProvider from "@/components/MotionProvider";
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
const TITLE_DEFAULT = "Sandra Lorden | Entrenadora Personal y Nutricionista en Madrid";
const TITLE_TEMPLATE = "%s | Sandra Lorden";
const DESCRIPTION =
  "Sandra Lorden — entrenadora personal certificada y nutricionista deportiva en Madrid. Planes de entrenamiento personalizados (presencial y online) y nutrición deportiva. +1000 clientes transformados y 10 años de experiencia. Especialista en entrenamiento de fuerza para mujeres. Empieza tu transformación hoy.";

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
    "entrenadora personal Madrid",
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
    "entrenamiento de fuerza mujeres",
    "entrenadora personal certificada",
    "nutricionista Madrid",
    "entrenadora personal España",
    "nutricionista España",
  ],

  authors: [
    { name: "Sandra Lorden", url: SITE_URL },
    { name: "Lucas Riera", url: "https://www.lucasriera.com" },
  ],
  creator: "Lucas Riera",
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
      "Entrenadora personal certificada y nutricionista deportiva en Madrid. Planes personalizados de entrenamiento y nutrición. +1000 clientes transformados.",
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
    icon: "/icon",
    apple: "/icon",
  },

  manifest: "/manifest.json",

  category: "fitness",

  other: {
    "google-site-verification": "KiaTi5WqqMF79O_CBWretnFkteRu3jWF1iTsLwpWmAI",
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
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidad — Grado en Ciencias del Deporte y la Actividad Física",
    },
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "Grado en Ciencias del Deporte y la Actividad Física (CAFYD)" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "Máster en Nutrición Deportiva" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "Máster en Alto Rendimiento" },
    ],
    sameAs: [
      "https://www.instagram.com/sandralordenfit",
      "https://www.instagram.com/sandralorden",
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
    email: "hola@sandralordenfit.com",
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
      { "@type": "City", name: "Madrid" },
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
            name: "Entrenamiento Personal Presencial",
            description:
              "Sesiones individuales presenciales a domicilio o al aire libre con corrección postural y material portátil profesional.",
          },
          priceSpecification: { "@type": "PriceSpecification", price: "50", priceCurrency: "EUR", unitText: "sesión" },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Asesoría Online — Nutrición",
            description:
              "Plan nutricional personalizado adaptado a tus gustos, horarios y objetivos con seguimiento continuo.",
          },
          priceSpecification: { "@type": "PriceSpecification", price: "59", priceCurrency: "EUR", unitText: "mes" },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Asesoría Online — Entrenamiento",
            description:
              "Plan de entrenamiento individualizado para gimnasio o casa con fotos, anotaciones y seguimiento.",
          },
          priceSpecification: { "@type": "PriceSpecification", price: "59", priceCurrency: "EUR", unitText: "mes" },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Asesoría Online — Pack Completo",
            description:
              "Pack de entrenamiento + nutrición personalizado con seguimiento diario y checking mensual.",
          },
          priceSpecification: { "@type": "PriceSpecification", price: "79", priceCurrency: "EUR", unitText: "mes" },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "1000",
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
    description: DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#person` },
    creator: {
      "@type": "Person",
      name: "Lucas Riera",
      url: "https://www.lucasriera.com",
      jobTitle: "Desarrollador & Diseñador Web",
    },
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
          text: "Sí, Sandra Lorden ofrece asesorías online de entrenamiento y nutrición con seguimiento continuo por WhatsApp, email o videollamada. Los planes se entregan en formato PDF con fotos y anotaciones.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué servicios ofrece Sandra Lorden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sandra Lorden ofrece entrenamiento personal presencial (a domicilio o al aire libre) y asesorías online de nutrición, entrenamiento (gym o casa) o pack completo. Todos los planes son personalizados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Sandra Lorden es nutricionista certificada?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, Sandra Lorden es graduada en Ciencias del Deporte y la Actividad Física (CAFYD) con doble Máster en Nutrición Deportiva y Alto Rendimiento. Tiene 10 años de experiencia y más de 1000 clientes.",
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
      {
        "@type": "Question",
        name: "¿Necesito experiencia previa para entrenar con Sandra Lorden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, Sandra Lorden trabaja con todos los niveles, desde principiantes hasta avanzados. Cada plan se adapta al nivel, objetivos y disponibilidad de cada persona.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto tiempo tardaré en ver resultados con Sandra Lorden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La mayoría de clientas notan cambios en las primeras 3-4 semanas. Los resultados sólidos y sostenibles se ven a partir de los 3 meses con constancia en el entrenamiento y la nutrición.",
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
        <link rel="author" href="https://www.lucasriera.com" />
        <link rel="humans" type="text/plain" href="/humans.txt" />
      </head>
      <body className={`${cormorant.variable} ${dancingScript.variable} ${dmSans.variable} antialiased`}>
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
