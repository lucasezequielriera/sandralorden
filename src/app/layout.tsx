import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Sandra Lorden | Entrenadora Personal & Nutricionista",
  description:
    "Entrenadora personal certificada y nutricionista. Entrenamientos personalizados virtuales y presenciales. Colaboradora de Gravl y EntrenaVirtual.",
  keywords: [
    "entrenadora personal",
    "nutricionista",
    "fitness",
    "entrenamiento virtual",
    "Sandra Lorden",
    "Gravl",
    "EntrenaVirtual",
  ],
  openGraph: {
    title: "Sandra Lorden | Entrenadora Personal & Nutricionista",
    description:
      "Transforma tu vida con entrenamientos personalizados y nutricion profesional.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${cormorant.variable} ${dancingScript.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
