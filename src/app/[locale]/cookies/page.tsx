import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies",
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-crema py-20 px-4 sm:px-6">
      <article className="mx-auto max-w-3xl prose prose-warm-dark prose-sm sm:prose-base">
        <a href="/" className="inline-block text-sm text-warm-gray-400 hover:text-warm-dark transition-colors mb-8">
          ← Volver a la web
        </a>

        <h1 className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-2">
          Política de Cookies
        </h1>
        <p className="text-warm-gray-400 text-sm mb-10">Última actualización: febrero 2026</p>

        <div className="space-y-8 text-warm-gray-500 leading-relaxed [&_h2]:font-[family-name:var(--font-display)] [&_h2]:italic [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-light [&_h2]:text-warm-dark [&_h2]:mt-10 [&_h2]:mb-3 [&_strong]:text-warm-dark [&_a]:text-rosa-400 [&_a]:underline [&_a]:underline-offset-2">

          <section>
            <h2>1. ¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (ordenador, tablet o móvil) cuando los visitas. Se utilizan para recordar tus preferencias, mejorar tu experiencia de navegación y recopilar información analítica.</p>
          </section>

          <section>
            <h2>2. Cookies que utilizamos</h2>

            <h3 className="text-lg font-medium text-warm-dark mt-6 mb-2">Cookies técnicas (necesarias)</h3>
            <p>Son imprescindibles para el funcionamiento del sitio web. No requieren consentimiento.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-warm-gray-200">
                    <th className="text-left py-2 pr-4 font-medium text-warm-dark">Cookie</th>
                    <th className="text-left py-2 pr-4 font-medium text-warm-dark">Finalidad</th>
                    <th className="text-left py-2 font-medium text-warm-dark">Duración</th>
                  </tr>
                </thead>
                <tbody className="[&_td]:py-2 [&_td]:pr-4">
                  <tr className="border-b border-warm-gray-100">
                    <td>sb-*-auth-token</td>
                    <td>Sesión de usuario autenticado (panel admin)</td>
                    <td>Sesión</td>
                  </tr>
                  <tr className="border-b border-warm-gray-100">
                    <td>cookie-consent</td>
                    <td>Recordar tu preferencia de cookies</td>
                    <td>1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-warm-dark mt-6 mb-2">Cookies analíticas</h3>
            <p>Nos ayudan a entender cómo interactúas con el sitio web para mejorarlo. Solo se activan si aceptas su uso.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-warm-gray-200">
                    <th className="text-left py-2 pr-4 font-medium text-warm-dark">Cookie</th>
                    <th className="text-left py-2 pr-4 font-medium text-warm-dark">Proveedor</th>
                    <th className="text-left py-2 pr-4 font-medium text-warm-dark">Finalidad</th>
                    <th className="text-left py-2 font-medium text-warm-dark">Duración</th>
                  </tr>
                </thead>
                <tbody className="[&_td]:py-2 [&_td]:pr-4">
                  <tr className="border-b border-warm-gray-100">
                    <td>va</td>
                    <td>Vercel Analytics</td>
                    <td>Analítica web anonimizada</td>
                    <td>Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>3. Gestión de cookies</h2>
            <p>Puedes aceptar o rechazar las cookies analíticas a través del banner que aparece al visitar el sitio web por primera vez. También puedes configurar tu navegador para bloquear o eliminar cookies:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>
            <p>Ten en cuenta que deshabilitar las cookies técnicas puede afectar al funcionamiento del sitio.</p>
          </section>

          <section>
            <h2>4. Más información</h2>
            <p>Para más información sobre cómo tratamos tus datos, consulta nuestra <a href="/privacidad">Política de Privacidad</a>. Si tienes dudas, escríbenos a <a href="mailto:sandralordenfit@gmail.com">sandralordenfit@gmail.com</a>.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
