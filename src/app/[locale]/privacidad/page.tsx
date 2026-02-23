import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LegalMeta" });
  return { title: t("privacy"), robots: { index: false, follow: false } };
}

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-crema py-20 px-4 sm:px-6">
      <article className="mx-auto max-w-3xl prose prose-warm-dark prose-sm sm:prose-base">
        <Link href="/" className="inline-block text-sm text-warm-gray-400 hover:text-warm-dark transition-colors mb-8">
          ← Volver a la web
        </Link>

        <h1 className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl font-light text-warm-dark mb-2">
          Política de Privacidad
        </h1>
        <p className="text-warm-gray-400 text-sm mb-10">Última actualización: febrero 2026</p>

        <div className="space-y-8 text-warm-gray-500 leading-relaxed [&_h2]:font-[family-name:var(--font-display)] [&_h2]:italic [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-light [&_h2]:text-warm-dark [&_h2]:mt-10 [&_h2]:mb-3 [&_strong]:text-warm-dark [&_a]:text-rosa-400 [&_a]:underline [&_a]:underline-offset-2">

          <section>
            <h2>1. Responsable del tratamiento</h2>
            <ul className="list-none space-y-1 pl-0">
              <li><strong>Titular:</strong> Sandra Lorden Álvarez</li>
              <li><strong>Actividad:</strong> Entrenamiento personal y nutrición deportiva</li>
              <li><strong>Email:</strong> sandralordenfit@gmail.com</li>
              <li><strong>Sitio web:</strong> www.sandralorden.com</li>
            </ul>
          </section>

          <section>
            <h2>2. Datos que recopilamos</h2>
            <p>Recogemos los datos personales que nos proporcionas voluntariamente a través de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Formulario de transformación:</strong> nombre, email, teléfono, edad, objetivos de fitness y nutrición.</li>
              <li><strong>Formulario de contacto:</strong> nombre, email y mensaje.</li>
              <li><strong>Formulario de valoración detallada:</strong> datos de salud, hábitos alimenticios, rutinas de entrenamiento, objetivos y otra información que decidas compartir.</li>
            </ul>
          </section>

          <section>
            <h2>3. Finalidad del tratamiento</h2>
            <p>Tus datos se utilizan para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ofrecerte un análisis personalizado de tus objetivos de salud y fitness.</li>
              <li>Contactarte por WhatsApp o email para iniciar tu plan de transformación.</li>
              <li>Gestionar la relación comercial y los servicios contratados.</li>
              <li>Enviarte información relacionada con los servicios solicitados.</li>
            </ul>
          </section>

          <section>
            <h2>4. Base legal</h2>
            <p>El tratamiento de tus datos se basa en:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Consentimiento:</strong> al enviar cualquier formulario, aceptas expresamente esta política de privacidad.</li>
              <li><strong>Ejecución de contrato:</strong> para la prestación de los servicios de entrenamiento y nutrición contratados.</li>
              <li><strong>Interés legítimo:</strong> para el mantenimiento y mejora de la relación comercial.</li>
            </ul>
          </section>

          <section>
            <h2>5. Conservación de los datos</h2>
            <p>Tus datos se conservarán mientras exista una relación comercial o durante el tiempo necesario para cumplir con las obligaciones legales. Puedes solicitar su eliminación en cualquier momento.</p>
          </section>

          <section>
            <h2>6. Comunicación de datos a terceros</h2>
            <p>No vendemos ni cedemos tus datos a terceros. Tus datos pueden ser tratados por:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase Inc.</strong> — almacenamiento seguro de datos (servidores en la UE).</li>
              <li><strong>Vercel Inc.</strong> — alojamiento del sitio web.</li>
              <li><strong>Resend Inc.</strong> — envío de emails transaccionales.</li>
            </ul>
            <p>Estos proveedores cumplen con las garantías adecuadas de protección de datos conforme al RGPD.</p>
          </section>

          <section>
            <h2>7. Tus derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Acceso:</strong> saber qué datos tuyos tratamos.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos.</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado.</li>
              <li><strong>Limitación:</strong> solicitar la limitación del tratamiento.</li>
            </ul>
            <p>Para ejercer estos derechos, escríbenos a <a href="mailto:sandralordenfit@gmail.com">sandralordenfit@gmail.com</a>. Responderemos en un plazo máximo de 30 días.</p>
            <p>También puedes presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos (AEPD)</a>.</p>
          </section>

          <section>
            <h2>8. Seguridad</h2>
            <p>Adoptamos medidas técnicas y organizativas para proteger tus datos, incluyendo cifrado en tránsito (HTTPS/TLS), almacenamiento seguro con control de acceso y políticas de seguridad a nivel de fila en la base de datos.</p>
          </section>

          <section>
            <h2>9. Cookies</h2>
            <p>Este sitio web utiliza cookies técnicas necesarias para su funcionamiento y cookies analíticas para mejorar la experiencia del usuario. Puedes consultar más información en nuestra <Link href="/cookies">Política de Cookies</Link>.</p>
          </section>

          <section>
            <h2>10. Modificaciones</h2>
            <p>Nos reservamos el derecho de actualizar esta política de privacidad. La fecha de última actualización aparece al inicio de este documento. Te recomendamos revisarla periódicamente.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
