import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Press from "@/components/Press";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
        <Partners />
        <Press />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
