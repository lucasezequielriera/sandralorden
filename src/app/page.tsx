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
      <Navigation />
      <main>
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
