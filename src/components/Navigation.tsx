"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#sobre-mi", label: "Sobre Mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#prensa", label: "Prensa" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <m.nav
      aria-label="Navegación principal"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(61,44,44,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            className="font-[family-name:var(--font-script)] text-xl sm:text-2xl text-warm-dark"
          >
            Sandra Lorden
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-warm-gray-500 transition-colors duration-300 hover:text-warm-dark relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-rosa-300 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA + Admin */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-transformation-modal"))}
              className="inline-flex items-center px-5 lg:px-6 py-2.5 text-sm font-medium text-white bg-warm-dark rounded-full transition-all duration-300 hover:bg-warm-gray-500 hover:shadow-lg cursor-pointer"
            >
              Empieza Ya
            </button>
            <a
              href="/admin"
              className="w-9 h-9 rounded-full border border-warm-gray-200/60 flex items-center justify-center text-warm-gray-400 hover:text-warm-dark hover:border-warm-gray-300 transition-all"
              aria-label="Panel de administración"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </a>
          </div>

          {/* Mobile: Admin + Menu */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="/admin"
              className="w-8 h-8 rounded-full border border-warm-gray-200/60 flex items-center justify-center text-warm-gray-400 hover:text-warm-dark hover:border-warm-gray-300 transition-all"
              aria-label="Panel de administración"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
            <m.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-warm-dark origin-center"
            />
            <m.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-[1.5px] bg-warm-dark"
            />
            <m.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[1.5px] bg-warm-dark origin-center"
            />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-warm-gray-100"
          >
            <div className="px-4 sm:px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <m.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-base font-medium text-warm-gray-500 hover:text-warm-dark transition-colors"
                >
                  {link.label}
                </m.a>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent("open-transformation-modal"));
                }}
                className="mt-2 inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-full cursor-pointer"
              >
                Empieza Ya
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.nav>
  );
}
