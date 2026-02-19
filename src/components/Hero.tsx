"use client";

import { useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import TransformationModal from "./TransformationModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        id="inicio"
        className="relative min-h-[100svh] flex items-center overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-crema via-rosa-50 to-marron-50" />

        {/* Decorative circles */}
        <m.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-rosa-200/30 blur-3xl"
        />
        <m.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-[10%] w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-marron-200/20 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 w-full pt-24 sm:pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-marron-400 font-medium mb-6 sm:mb-8"
              >
                Entrenadora Personal & Nutricionista
              </m.p>

              <m.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-[family-name:var(--font-script)] text-[3.2rem] sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-warm-dark leading-[1.15]"
              >
                Sandra
                <br />
                <span className="text-rosa-400">Lorden</span>
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="mt-6 sm:mt-8 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-warm-gray-400 leading-relaxed"
              >
                Transformo vidas a través del entrenamiento personalizado y la nutrición
                consciente. Tu mejor versión empieza hoy.
              </m.p>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 text-sm font-medium text-white bg-warm-dark rounded-full transition-all duration-300 hover:bg-warm-gray-500 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                >
                  Empieza Tu Transformación
                </button>
                <a
                  href="#sobre-mi"
                  className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 text-sm font-medium text-warm-dark bg-white/60 backdrop-blur-sm border border-warm-gray-200 rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
                >
                  Conóceme
                </a>
              </m.div>

              {/* Stats */}
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="mt-12 sm:mt-16 flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12"
              >
                {[
                  { number: "+1000", label: "Clientes" },
                  { number: "10", label: "Años de experiencia" },
                  { number: "+100", label: "Apariciones en prensa" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl md:text-4xl font-light text-warm-dark">
                      {stat.number}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-warm-gray-400">{stat.label}</p>
                  </div>
                ))}
              </m.div>
            </div>

            {/* Right: Photo */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative w-64 sm:w-72 md:w-80 lg:w-full max-w-md">
                <div className="aspect-[3/4] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rosa-200/30 border-4 border-white/60">
                  <Image
                    src="/images/IMG_1632.JPG"
                    alt="Sandra Lorden — Entrenadora Personal y Nutricionista en Madrid"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 448px"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-24 sm:w-32 h-24 sm:h-32 rounded-2xl bg-rosa-200/40 -z-10" />
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-marron-200/30 -z-10" />
              </div>
            </m.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <m.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-warm-gray-300 flex items-start justify-center p-1"
          >
            <m.div className="w-1 h-2 rounded-full bg-warm-gray-300" />
          </m.div>
        </m.div>
      </section>

      <TransformationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
