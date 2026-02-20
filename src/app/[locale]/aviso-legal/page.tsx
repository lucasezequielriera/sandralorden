import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal",
  robots: { index: false, follow: false },
};

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-crema py-20 px-4 sm:px-6">
      <article className="mx-auto max-w-3xl prose prose-warm-dark prose-sm sm:prose-base">
        <a href="/" className="inline-block text-sm text-warm-gray-400 hover:text-warm-dark transition-colors mb-8">
          ← Volver a la web
        </a>

        <h1 className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-2">
          Aviso Legal
        </h1>
        <p className="text-warm-gray-400 text-sm mb-10">Última actualización: febrero 2026</p>

        <div className="space-y-8 text-warm-gray-500 leading-relaxed [&_h2]:font-[family-name:var(--font-display)] [&_h2]:italic [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-light [&_h2]:text-warm-dark [&_h2]:mt-10 [&_h2]:mb-3 [&_strong]:text-warm-dark [&_a]:text-rosa-400 [&_a]:underline [&_a]:underline-offset-2">

          <section>
            <h2>1. Datos identificativos</h2>
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa al usuario de los siguientes datos:</p>
            <ul className="list-none space-y-1 pl-0">
              <li><strong>Titular:</strong> Sandra Lorden Álvarez</li>
              <li><strong>Actividad profesional:</strong> Entrenadora personal y nutricionista deportiva</li>
              <li><strong>Domicilio:</strong> Madrid, España</li>
              <li><strong>Email de contacto:</strong> sandralordenfit@gmail.com</li>
              <li><strong>Sitio web:</strong> www.sandralorden.com</li>
            </ul>
          </section>

          <section>
            <h2>2. Objeto</h2>
            <p>El presente sitio web tiene como objeto proporcionar información sobre los servicios profesionales de entrenamiento personal y nutrición deportiva ofrecidos por Sandra Lorden Álvarez, así como facilitar el contacto y la contratación de dichos servicios.</p>
          </section>

          <section>
            <h2>3. Condiciones de uso</h2>
            <p>El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena de todas las condiciones incluidas en este Aviso Legal. El usuario se compromete a hacer un uso adecuado del sitio web y de los servicios de conformidad con la ley, la moral y el orden público.</p>
          </section>

          <section>
            <h2>4. Propiedad intelectual e industrial</h2>
            <p>Todos los contenidos del sitio web (incluyendo, sin limitación, textos, fotografías, gráficos, imágenes, iconos, vídeos, diseño, código fuente y software) son propiedad de Sandra Lorden Álvarez o de sus respectivos autores, y están protegidos por las leyes de propiedad intelectual e industrial.</p>
            <p>Queda prohibida la reproducción, distribución, comunicación pública o transformación de cualquier contenido de este sitio web sin la autorización expresa y por escrito de su titular.</p>
          </section>

          <section>
            <h2>5. Exclusión de responsabilidad</h2>
            <p>Sandra Lorden Álvarez no se hace responsable de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>La falta de disponibilidad, continuidad o calidad del sitio web ni de que su contenido esté actualizado.</li>
              <li>La presencia de virus o elementos dañinos en los contenidos que puedan producir alteraciones en el sistema informático del usuario.</li>
              <li>El uso que los usuarios puedan hacer de los contenidos del sitio web.</li>
              <li>Los resultados individuales de los programas de entrenamiento y nutrición, que pueden variar según cada persona.</li>
            </ul>
          </section>

          <section>
            <h2>6. Enlaces a terceros</h2>
            <p>Este sitio web puede contener enlaces a sitios web de terceros. Sandra Lorden Álvarez no se responsabiliza del contenido ni de las políticas de privacidad de dichos sitios externos.</p>
          </section>

          <section>
            <h2>7. Protección de datos</h2>
            <p>El tratamiento de datos personales se rige por nuestra <a href="/privacidad">Política de Privacidad</a>, conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>
          </section>

          <section>
            <h2>8. Legislación aplicable y jurisdicción</h2>
            <p>El presente Aviso Legal se rige por la legislación española. Para la resolución de cualquier controversia que pudiera derivarse del acceso o uso de este sitio web, las partes se someten a los Juzgados y Tribunales de Madrid, España.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
