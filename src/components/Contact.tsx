"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with form service (e.g., Formspree, Resend)
    alert("Gracias por tu mensaje. Te contactare pronto!");
    setFormState({ name: "", email: "", service: "", message: "" });
  };

  return (
    <section id="contacto" className="py-28 md:py-36 bg-gradient-to-br from-rosa-50 via-crema to-marron-50" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Info */}
          <div>
            <AnimatedSection>
              <p className="text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-4">
                Contacto
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h2 id="contact-heading" className="font-[family-name:var(--font-display)] italic text-4xl md:text-5xl font-light text-warm-dark leading-tight">
                Empieza tu{" "}
                <span className="font-[family-name:var(--font-script)] not-italic text-rosa-400">transformación</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="mt-6 text-lg text-warm-gray-400 leading-relaxed">
                Rellena el formulario o contactame directamente. Estare encantada
                de ayudarte a encontrar el plan perfecto para ti.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="mt-10 space-y-6">
                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/80 border border-warm-gray-100 flex items-center justify-center text-rosa-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-dark">Email</p>
                    <p className="text-sm text-warm-gray-400">hola@sandralorden.com</p>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/80 border border-warm-gray-100 flex items-center justify-center text-rosa-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-dark">Instagram</p>
                    <p className="text-sm text-warm-gray-400">@sandralorden</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/80 border border-warm-gray-100 flex items-center justify-center text-rosa-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-dark">Ubicacion</p>
                    <p className="text-sm text-warm-gray-400">Espana & Online</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right - Form */}
          <AnimatedSection direction="right" delay={0.2}>
            <form
              onSubmit={handleSubmit}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-warm-gray-100/50 shadow-sm"
            >
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-warm-dark mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all duration-300"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-warm-dark mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-warm-dark mb-2">
                    Servicio de interes
                  </label>
                  <select
                    id="service"
                    value={formState.service}
                    onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="presencial">Entrenamiento Presencial</option>
                    <option value="virtual">Entrenamiento Virtual</option>
                    <option value="nutricion">Nutricion Deportiva</option>
                    <option value="online">Programas Online</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-warm-dark mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Cuentame tus objetivos..."
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-8 py-4 text-sm font-medium text-white bg-warm-dark rounded-xl transition-all duration-300 hover:bg-warm-gray-500 hover:shadow-lg cursor-pointer"
                >
                  Enviar Mensaje
                </motion.button>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
