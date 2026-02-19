import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crema via-rosa-50 to-marron-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-[family-name:var(--font-script)] text-6xl sm:text-7xl text-rosa-300 mb-4">
          404
        </p>
        <h1 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark mb-3">
          Esta página no existe
        </h1>
        <p className="text-sm sm:text-base text-warm-gray-400 leading-relaxed mb-8">
          Parece que te has perdido, pero no te preocupes.
          Vuelve al inicio y encuentra lo que buscas.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-medium text-white bg-warm-dark rounded-full transition-all duration-300 hover:bg-warm-gray-500 hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Volver al inicio
        </Link>
        <p className="mt-8 font-[family-name:var(--font-script)] text-lg text-warm-gray-300">
          Sandra Lorden
        </p>
      </div>
    </div>
  );
}
