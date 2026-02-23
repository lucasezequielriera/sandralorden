import { escapeHtml } from "@/lib/sanitize";

/* ── Email para SANDRA (cliente completó el formulario detallado) ── */

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
        <p style="font-size:11px;color:#C9A88E;margin:0 0 3px;text-transform:uppercase;letter-spacing:0.8px;">${escapeHtml(r.label)}</p>
        <p style="font-size:13px;color:#3D2C2C;margin:0;white-space:pre-line;">${escapeHtml(r.value)}</p>
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
  <title>Formulario Completo - ${escapeHtml(lead.name)}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFAF7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#3D2C2C;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFAF7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background-color:#3D2C2C;border-radius:16px 16px 0 0;padding:20px 28px;">
              <p style="color:#F2D1D1;font-size:13px;margin:0;letter-spacing:1px;text-transform:uppercase;">Formulario completo recibido</p>
              <p style="color:#ffffff;font-size:22px;margin:6px 0 0;font-style:italic;font-family:Georgia,'Times New Roman',serif;">${escapeHtml(lead.name)}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:28px;border-radius:0 0 16px 16px;box-shadow:0 2px 12px rgba(61,44,44,0.06);">

              <!-- Contacto -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
                    <span style="font-size:12px;color:#C9A88E;display:inline-block;width:80px;">Email</span>
                    <a href="mailto:${escapeHtml(lead.email)}" style="font-size:14px;color:#3D2C2C;text-decoration:none;">${escapeHtml(lead.email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #F7F3F0;">
                    <span style="font-size:12px;color:#C9A88E;display:inline-block;width:80px;">WhatsApp</span>
                    <a href="tel:${escapeHtml(lead.phone)}" style="font-size:14px;color:#3D2C2C;text-decoration:none;">${escapeHtml(lead.phone)}</a>
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

