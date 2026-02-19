import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FloatingButtons from "@/components/FloatingButtons";

const Services = dynamic(() => import("@/components/Services"));
const Press = dynamic(() => import("@/components/Press"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-warm-dark focus:text-white focus:rounded-lg">
        Saltar al contenido principal
      </a>
      <Navigation />
      <main id="main-content" role="main">
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
    </>
  );
}
