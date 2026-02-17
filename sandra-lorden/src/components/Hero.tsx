"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TransformationModal from "./TransformationModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-crema via-rosa-50 to-marron-50" />

        {/* Decorative circles */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-rosa-200/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-marron-200/20 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 text-center">
          {/* Tagline top */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm uppercase tracking-[0.3em] text-marron-400 font-medium mb-8"
          >
            Entrenadora Personal & Nutricionista
          </motion.p>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-script)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-warm-dark leading-[1.2]"
          >
            Sandra
            <br />
            <span className="text-rosa-400">Lorden</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 max-w-xl mx-auto text-lg text-warm-gray-400 leading-relaxed"
          >
            Transformo vidas a traves del entrenamiento personalizado y la nutricion
            consciente. Tu mejor version empieza hoy.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white bg-warm-dark rounded-full transition-all duration-300 hover:bg-warm-gray-500 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              Empieza Tu Transformacion
            </button>
            <a
              href="#sobre-mi"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-warm-dark bg-white/60 backdrop-blur-sm border border-warm-gray-200 rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
            >
              Conoceme
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-20 flex flex-wrap justify-center gap-12 md:gap-20"
          >
            {[
              { number: "+500", label: "Clientes" },
              { number: "+8", label: "Anos de experiencia" },
              { number: "+15", label: "Apariciones en prensa" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-display)] italic text-3xl md:text-4xl font-light text-warm-dark">
                  {stat.number}
                </p>
                <p className="mt-1 text-sm text-warm-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-warm-gray-300 flex items-start justify-center p-1"
          >
            <motion.div className="w-1 h-2 rounded-full bg-warm-gray-300" />
          </motion.div>
        </motion.div>
      </section>

      {/* Transformation Modal */}
      <TransformationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
