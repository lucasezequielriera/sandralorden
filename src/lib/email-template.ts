/* ── Email para el CLIENTE (analisis breve + link al formulario) ── */

export function buildAnalysisEmailHtml(name: string, analysisMarkdown: string, formUrl: string): string {
  const analysisHtml = markdownToHtml(analysisMarkdown);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Analisis - Sandra Lorden</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFAF7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#3D2C2C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFAF7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="font-size:28px;color:#3D2C2C;margin:0;font-style:italic;font-family:Georgia,'Times New Roman',serif;">Sandra Lorden</p>
              <p style="font-size:12px;color:#C9A88E;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase;">Entrenadora Personal & Nutricionista</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;border-radius:24px;padding:40px 36px;box-shadow:0 2px 12px rgba(61,44,44,0.06);">
              <div style="font-size:15px;line-height:1.8;color:#6B5E5E;">${analysisHtml}</div>

              <hr style="border:none;border-top:1px solid #F2D1D1;margin:28px 0;" />

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0;">
                    <p style="font-size:16px;font-weight:300;color:#3D2C2C;margin:0 0 6px;font-style:italic;font-family:Georgia,'Times New Roman',serif;">El siguiente paso es tuyo</p>
                    <p style="font-size:13px;color:#8B7E7E;margin:0 0 20px;">Completa el formulario para que pueda preparar tu plan a medida</p>
                    <a href="${formUrl}"
                       style="display:inline-block;background-color:#3D2C2C;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:500;letter-spacing:0.3px;">
                      Completar mi formulario
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="font-size:11px;color:#C4B8AD;margin:0;">Sandra Lorden · Entrenadora Personal & Nutricionista</p>
              <p style="font-size:11px;color:#C4B8AD;margin:4px 0 0;">Este analisis fue preparado especialmente para ti.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── Email para SANDRA (nuevo lead desde el primer formulario) ── */

export function buildLeadNotificationEmailHtml(lead: { name: string; email: string; phone: string; service: string; goal: string; levelAndDays: string; duration: string; obstacle: string; extra: string }): string {
  const cleanPhone = lead.phone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("34") ? cleanPhone : `34${cleanPhone}`;
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Hola ${lead.name}! Soy Sandra. He visto que te has apuntado a mi programa, ¿qué tal? ¿Has podido rellenar el formulario completo? 💪`)}`;

  const rows = [
    { label: "Servicio", value: lead.service },
    { label: "Objetivo", value: lead.goal },
    { label: "Nivel y disponibilidad", value: lead.levelAndDays },
    { label: "Tiempo de compromiso", value: lead.duration },
    { label: "Mayor obstáculo", value: lead.obstacle },
    { label: "Info adicional", value: lead.extra },
  ].filter((r) => r.value);

  const rowsHtml = rows.map((r) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
        <p style="font-size:11px;color:#C9A88E;margin:0 0 3px;text-transform:uppercase;letter-spacing:0.8px;">${r.label}</p>
        <p style="font-size:13px;color:#3D2C2C;margin:0;">${r.value}</p>
      </td>
    </tr>`).join("");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Lead - ${lead.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFAF7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#3D2C2C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFAF7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background-color:#3D2C2C;border-radius:16px 16px 0 0;padding:20px 28px;">
              <p style="color:#F2D1D1;font-size:13px;margin:0;letter-spacing:1px;text-transform:uppercase;">🔔 Nuevo lead — primer formulario</p>
              <p style="color:#ffffff;font-size:22px;margin:6px 0 0;font-style:italic;font-family:Georgia,'Times New Roman',serif;">${lead.name}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:28px;border-radius:0 0 16px 16px;box-shadow:0 2px 12px rgba(61,44,44,0.06);">

              <!-- Contacto -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
                    <span style="font-size:12px;color:#C9A88E;display:inline-block;width:80px;">Email</span>
                    <a href="mailto:${lead.email}" style="font-size:14px;color:#3D2C2C;text-decoration:none;">${lead.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
                    <span style="font-size:12px;color:#C9A88E;display:inline-block;width:80px;">WhatsApp</span>
                    <a href="tel:${lead.phone}" style="font-size:14px;color:#3D2C2C;text-decoration:none;">${lead.phone}</a>
                  </td>
                </tr>
              </table>

              <!-- Datos del formulario -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${rowsHtml}
              </table>

              <!-- Aviso -->
              <div style="background-color:#FFF5F5;border-radius:12px;padding:16px;margin-top:20px;">
                <p style="font-size:12px;color:#D4908F;margin:0;font-weight:600;">⏳ Pendiente del formulario completo</p>
                <p style="font-size:12px;color:#8B7E7E;margin:6px 0 0;">Si no lo completa en 24-48h, escríbele por WhatsApp para recordárselo.</p>
              </div>

              <!-- WA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td align="center">
                    <a href="${waUrl}" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:600;">
                      Escribirle por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── Email para SANDRA (cliente completo el formulario detallado) ── */

export interface IntakeData {
  name: string;
  email: string;
  phone: string;
  service: string;
  age: string;
  height: string;
  weight: string;
  goalWeight: string;
  // Salud
  enfermedadesInfancia: string;
  lesiones: string;
  cirugias: string;
  diabetes: string;
  hipertension: string;
  corazon: string;
  hipotiroidismo: string;
  colesterolTrigliceridos: string;
  digestivo: string;
  medicamentos: string;
  fumaOBebe: string;
  descanso: string;
  // Alimentacion
  comidasYHorarios: string;
  apetito: string;
  momentoApetito: string;
  alimentosPreferidos: string;
  alimentosNoGustan: string;
  diaTipo: string;
  alergiasAlimentarias: string;
  suplementacion: string;
  suplementacionInteres: string;
  dietaAnteriorBase: string;
  dietaAnteriorTiempo: string;
  dietaAnteriorDuracion: string;
  dietaAnteriorObservaciones: string;
  // Entrenamiento
  diasEntrenoActual: string;
  diasEntrenoCompromiso: string;
  horaEntreno: string;
  duracionSesion: string;
  casaOGimnasio: string;
  materialCasa: string;
  // Objetivos
  mejoraRendimiento: string;
  mejoraEstetica: string;
}

function sectionHtml(title: string, rows: { label: string; value: string }[]): string {
  const filtered = rows.filter((r) => r.value);
  if (filtered.length === 0) return "";
  const rowsStr = filtered.map((r) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
        <p style="font-size:11px;color:#C9A88E;margin:0 0 3px;text-transform:uppercase;letter-spacing:0.8px;">${r.label}</p>
        <p style="font-size:13px;color:#3D2C2C;margin:0;white-space:pre-line;">${r.value}</p>
      </td>
    </tr>`).join("");

  return `
    <tr>
      <td style="padding:16px 0 6px;">
        <p style="font-size:14px;font-weight:600;color:#3D2C2C;margin:0;border-bottom:2px solid #F2D1D1;padding-bottom:6px;font-style:italic;font-family:Georgia,'Times New Roman',serif;">${title}</p>
      </td>
    </tr>
    ${rowsStr}`;
}

export function buildIntakeNotificationEmailHtml(lead: IntakeData): string {
  const cleanPhone = lead.phone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("34") ? cleanPhone : `34${cleanPhone}`;
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Hola ${lead.name}! Soy Sandra Lorden. Ya he revisado todo tu formulario y tengo ideas increibles para ti. Cuando quieras hablamos sobre tu plan! 💪`)}`;

  const datosPersonales = sectionHtml("Datos Personales", [
    { label: "Servicio", value: lead.service },
    { label: "Edad", value: lead.age },
    { label: "Altura", value: lead.height },
    { label: "Peso actual", value: lead.weight },
    { label: "Peso objetivo", value: lead.goalWeight },
  ]);

  const salud = sectionHtml("Salud", [
    { label: "Enfermedades desde pequeno/a", value: lead.enfermedadesInfancia },
    { label: "Lesiones", value: lead.lesiones },
    { label: "Cirugias", value: lead.cirugias },
    { label: "Diabetes", value: lead.diabetes },
    { label: "Hipertension Arterial", value: lead.hipertension },
    { label: "Enfermedades del corazon", value: lead.corazon },
    { label: "Hipotiroidismo", value: lead.hipotiroidismo },
    { label: "Colesterol / Trigliceridos", value: lead.colesterolTrigliceridos },
    { label: "Digestivo", value: lead.digestivo },
    { label: "Medicamentos / suplementacion medica", value: lead.medicamentos },
    { label: "Fuma o bebe", value: lead.fumaOBebe },
    { label: "Descanso (horas)", value: lead.descanso },
  ]);

  const alimentacion = sectionHtml("Alimentación", [
    { label: "Comidas al día y horarios", value: lead.comidasYHorarios },
    { label: "Apetito", value: lead.apetito },
    { label: "Momento con mayor apetito", value: lead.momentoApetito },
    { label: "✅ Alimentos que le gustan", value: lead.alimentosPreferidos },
    { label: "❌ Alimentos que NO le gustan", value: lead.alimentosNoGustan },
    { label: "Día tipo de comidas", value: lead.diaTipo },
    { label: "Alergias alimentarias", value: lead.alergiasAlimentarias },
    { label: "Suplementacion actual", value: lead.suplementacion },
    { label: "Interes en suplementacion", value: lead.suplementacionInteres },
    { label: "Dieta anterior — base", value: lead.dietaAnteriorBase },
    { label: "Dieta anterior — hace cuanto", value: lead.dietaAnteriorTiempo },
    { label: "Dieta anterior — duracion", value: lead.dietaAnteriorDuracion },
    { label: "Dieta anterior — observaciones", value: lead.dietaAnteriorObservaciones },
  ]);

  const entrenamiento = sectionHtml("Entrenamiento", [
    { label: "Dias de entreno actuales", value: lead.diasEntrenoActual },
    { label: "Dias de compromiso con el plan", value: lead.diasEntrenoCompromiso },
    { label: "Hora de entreno", value: lead.horaEntreno },
    { label: "Duracion de sesion", value: lead.duracionSesion },
    { label: "Casa o gimnasio", value: lead.casaOGimnasio },
    { label: "Material en casa", value: lead.materialCasa },
  ]);

  const objetivos = sectionHtml("Objetivos de Mejora", [
    { label: "Rendimiento fisico", value: lead.mejoraRendimiento },
    { label: "Estetica", value: lead.mejoraEstetica },
  ]);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formulario Completo - ${lead.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFAF7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#3D2C2C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFAF7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background-color:#3D2C2C;border-radius:16px 16px 0 0;padding:20px 28px;">
              <p style="color:#F2D1D1;font-size:13px;margin:0;letter-spacing:1px;text-transform:uppercase;">Formulario completo recibido</p>
              <p style="color:#ffffff;font-size:22px;margin:6px 0 0;font-style:italic;font-family:Georgia,'Times New Roman',serif;">${lead.name}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:28px;border-radius:0 0 16px 16px;box-shadow:0 2px 12px rgba(61,44,44,0.06);">

              <!-- Contacto -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
                    <span style="font-size:12px;color:#C9A88E;display:inline-block;width:80px;">Email</span>
                    <a href="mailto:${lead.email}" style="font-size:14px;color:#3D2C2C;text-decoration:none;">${lead.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
                    <span style="font-size:12px;color:#C9A88E;display:inline-block;width:80px;">WhatsApp</span>
                    <a href="tel:${lead.phone}" style="font-size:14px;color:#3D2C2C;text-decoration:none;">${lead.phone}</a>
                  </td>
                </tr>
              </table>

              <!-- Secciones -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${datosPersonales}
                ${salud}
                ${alimentacion}
                ${entrenamiento}
                ${objetivos}
              </table>

              <!-- WA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="${waUrl}" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:600;">
                      Escribirle por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:11px;color:#C4B8AD;text-align:center;margin:16px 0 0;">
                Ya completo el formulario. Contactale para iniciar!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── Utilidades de Markdown a HTML ── */

function markdownToHtml(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        return `<h2 style="font-size:18px;font-weight:300;color:#3D2C2C;margin:24px 0 8px;font-style:italic;font-family:Georgia,'Times New Roman',serif;">${inlineFormat(trimmed.slice(3))}</h2>`;
      }
      if (trimmed.startsWith("### ")) {
        return `<h3 style="font-size:16px;font-weight:400;color:#3D2C2C;margin:16px 0 6px;font-style:italic;font-family:Georgia,'Times New Roman',serif;">${inlineFormat(trimmed.slice(4))}</h3>`;
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return `<p style="margin:4px 0 4px 16px;font-size:14px;color:#6B5E5E;"><span style="color:#E8B4B4;margin-right:6px;">●</span>${inlineFormat(trimmed.slice(2))}</p>`;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return `<p style="margin:4px 0 4px 16px;font-size:14px;color:#6B5E5E;">${inlineFormat(trimmed)}</p>`;
      }
      if (trimmed === "") {
        return `<div style="height:8px;"></div>`;
      }
      return `<p style="margin:4px 0;font-size:14px;color:#6B5E5E;">${inlineFormat(trimmed)}</p>`;
    })
    .join("\n");
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#3D2C2C;font-weight:600;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#8B7E7E;">$1</em>');
}
