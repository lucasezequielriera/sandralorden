import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FloatingButtons from "@/components/FloatingButtons";
import CookieBanner from "@/components/CookieBanner";

const SectionLoader = () => <div className="py-20 sm:py-28" />;
const Services = dynamic(() => import("@/components/Services"), { loading: SectionLoader });
const Press = dynamic(() => import("@/components/Press"), { loading: SectionLoader });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { loading: SectionLoader });
const FAQ = dynamic(() => import("@/components/FAQ"), { loading: SectionLoader });
const Contact = dynamic(() => import("@/components/Contact"), { loading: SectionLoader });
const Footer = dynamic(() => import("@/components/Footer"));

export default async function Home() {
  const t = await getTranslations("Page");
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-warm-dark focus:text-white focus:rounded-lg focus:text-sm">
        {t("skipToContent")}
      </a>
      <Navigation />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Press />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
      <CookieBanner />
    </>
  );
}
