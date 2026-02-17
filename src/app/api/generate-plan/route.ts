import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Resend } from "resend";
import { buildAnalysisEmailHtml, buildLeadNotificationEmailHtml } from "@/lib/email-template";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY no configurada.");
  return new OpenAI({ apiKey });
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no configurada.");
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, goal, levelAndDays, duration, obstacle, extra } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Nombre, email y telefono son obligatorios." }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const resend = getResendClient();
    const emailFrom = process.env.EMAIL_FROM || "Sandra Lorden <onboarding@resend.dev>";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

    const prompt = `Eres Sandra Lorden, entrenadora personal y nutricionista profesional. Escribe un ANALISIS BREVE y cercano para una persona que acaba de rellenar tu cuestionario. Debe sonar como si le hablaras directamente, calido y profesional. NO es un plan, es tu primera impresion y analisis de su situacion.

DATOS DE LA PERSONA:
- Nombre: ${name}
- Servicio que busca: ${service}
- Objetivo: ${goal}
- Nivel y disponibilidad: ${levelAndDays}
- Tiempo de compromiso: ${duration}
- Mayor obstaculo: ${obstacle}
- Info adicional: ${extra || "Nada mencionado"}

GENERA EXACTAMENTE ESTO (en Markdown):

Saludo cercano usando su nombre (1 linea).

**Tu situacion:** 2-3 lineas analizando donde esta ahora segun sus respuestas, de forma empatica.

**Lo que veo claro:** 2-3 lineas sobre lo que puedes hacer por ella/el segun su objetivo y el servicio que busca (${service}). Se especifica sin dar el plan.

**Mi recomendacion:** 1-2 lineas de consejo inicial concreto que pueda aplicar ya.

Cierra con algo como: "Para poder preparar tu plan a medida necesito conocerte un poco mejor. Rellena el formulario y me pongo manos a la obra!"

REGLAS: Espanol, tuteo cercano y profesional. Markdown (**, -). Max 150 palabras. Motivador sin cursi. NO precios. NO emojis excesivos (max 2-3).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres Sandra Lorden, entrenadora personal y nutricionista. Escribes analisis breves y cercanos. Siempre en espanol, cercana y profesional." },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.75,
    });

    const analysis = completion.choices[0]?.message?.content;
    if (!analysis) {
      return NextResponse.json({ error: "No se pudo generar el analisis." }, { status: 500 });
    }

    const formUrl = `${baseUrl}/formulario?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&service=${encodeURIComponent(service)}`;

    const clientEmailResult = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: `${name}, he revisado tu cuestionario ✨`,
      html: buildAnalysisEmailHtml(name, analysis, formUrl),
    });
    console.log("Client email result:", JSON.stringify(clientEmailResult));

    const sandraEmail = process.env.SANDRA_EMAIL;
    if (sandraEmail) {
      const sandraEmailResult = await resend.emails.send({
        from: emailFrom,
        to: sandraEmail,
        subject: `🔔 Nuevo lead: ${name} — ${service || "Sin especificar"}`,
        html: buildLeadNotificationEmailHtml({ name, email, phone, service, goal, levelAndDays, duration, obstacle, extra }),
      });
      console.log("Sandra lead notification result:", JSON.stringify(sandraEmailResult));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in generate-plan:", error);
    return NextResponse.json(
      { error: "Error al procesar tu solicitud. Por favor, intentalo de nuevo." },
      { status: 500 }
    );
  }
}
