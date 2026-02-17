import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formulario de Transformación",
  description:
    "Completa el formulario detallado para que Sandra Lorden pueda preparar tu plan personalizado de entrenamiento y nutrición a medida.",
  alternates: {
    canonical: "https://www.sandralorden.com/formulario",
  },
  openGraph: {
    title: "Formulario de Transformación | Sandra Lorden",
    description:
      "Rellena tus datos para que Sandra pueda crear tu plan personalizado de entrenamiento y nutrición.",
    url: "https://www.sandralorden.com/formulario",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://www.sandralorden.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sandra Lorden — Formulario de Transformación",
      },
    ],
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function FormularioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
