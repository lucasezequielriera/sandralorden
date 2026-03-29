import { sendEmail } from "@/lib/email";
import { PREMIUM_90_TOTAL_EUR } from "@/lib/premium-90-invoices";
import { buildIntakeNotificationEmailHtml, type IntakeData } from "@/lib/email-template";
import { escapeHtml } from "@/lib/sanitize";
import type { createServiceClient } from "@/lib/supabase/server";

type ServiceSupabase = Awaited<ReturnType<typeof createServiceClient>>;

export function sandraPaymentNotifyMarker(sessionId: string): string {
  return `sandra_payment_notify:${sessionId}`;
}

async function sandraPaymentAlreadyNotified(supabase: ServiceSupabase, sessionId: string): Promise<boolean> {
  const fragment = sandraPaymentNotifyMarker(sessionId);
  const { data } = await supabase
    .from("activity_logs")
    .select("id")
    .ilike("details", `%${fragment}%`)
    .limit(1)
    .maybeSingle();
  return Boolean(data?.id);
}

/** Carga el último formulario del cliente (por id de intake en metadata o por email). */
export async function fetchLatestIntakePayload(
  supabase: ServiceSupabase,
  intakeFormId: string,
  email: string
): Promise<IntakeData | null> {
  const em = email.trim().toLowerCase();
  if (intakeFormId) {
    const { data } = await supabase.from("intake_forms").select("payload").eq("id", intakeFormId).maybeSingle();
    const p = data?.payload;
    if (p && typeof p === "object") return p as IntakeData;
  }
  const { data } = await supabase
    .from("intake_forms")
    .select("payload")
    .eq("email", em)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const p = data?.payload;
  if (p && typeof p === "object") return p as IntakeData;
  return null;
}

export function buildSandraPaymentConfirmedEmailHtml(params: {
  name: string;
  email: string;
  programType: string;
  planType: string;
  intakePayload: IntakeData | null;
}): string {
  const planLabel =
    params.planType === "monthly_50"
      ? "Mensual 50 EUR"
      : `Premium 90 días ${PREMIUM_90_TOTAL_EUR} EUR`;
  const summary = `
          <div style="font-family: Arial, sans-serif; color:#2f2f2f; line-height:1.5; margin-bottom: 14px;">
            <p style="margin:0 0 6px;"><strong>Pago confirmado correctamente</strong></p>
            <p style="margin:0 0 4px;">Programa: ${escapeHtml(params.programType)}</p>
            <p style="margin:0 0 4px;">Plan: ${escapeHtml(planLabel)}</p>
            <p style="margin:0 0 4px;">Cliente: ${escapeHtml(params.name)} (${escapeHtml(params.email)})</p>
          </div>`;
  if (params.intakePayload) {
    return summary + buildIntakeNotificationEmailHtml(params.intakePayload);
  }
  return `${summary}
          <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666;">
            No se adjuntó el formulario detallado automáticamente (no se encontró en base de datos para este email o id de formulario).
            Revisa en el panel de administración por ${escapeHtml(params.email)}.
          </p>`;
}

export type SandraNotifyResult =
  | { sent: true }
  | { sent: false; reason: "missing_sandra_email" | "already_notified" }
  | { sent: false; reason: "smtp_error"; message: string };

/**
 * Aviso único por sesión de Stripe: Sandra recibe siempre un resumen del pago y el formulario si existe.
 * Idempotente entre webhook y /api/checkout/confirm.
 */
export async function notifySandraCheckoutPaid(params: {
  supabase: ServiceSupabase;
  sessionId: string;
  intakeFormId: string;
  customerEmail: string;
  name: string;
  programType: string;
  planType: string;
}): Promise<SandraNotifyResult> {
  const sandraEmail = process.env.SANDRA_EMAIL?.trim();
  if (!sandraEmail) {
    console.warn("notifySandraCheckoutPaid: SANDRA_EMAIL no configurada en .env");
    return { sent: false, reason: "missing_sandra_email" };
  }

  if (await sandraPaymentAlreadyNotified(params.supabase, params.sessionId)) {
    return { sent: false, reason: "already_notified" };
  }

  console.info("notifySandraCheckoutPaid: enviando aviso de pago a Sandra", params.sessionId);

  const intakePayload = await fetchLatestIntakePayload(
    params.supabase,
    params.intakeFormId,
    params.customerEmail
  );

  try {
    await sendEmail({
      to: sandraEmail,
      subject: `Pago confirmado — ${params.name} — ${params.programType}`,
      html: buildSandraPaymentConfirmedEmailHtml({
        name: params.name,
        email: params.customerEmail,
        programType: params.programType,
        planType: params.planType,
        intakePayload,
      }),
      text: `Pago confirmado — ${params.name} — ${params.customerEmail} — ${params.programType}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("notifySandraCheckoutPaid: fallo SMTP:", message);
    return { sent: false, reason: "smtp_error", message };
  }

  const { error: logErr } = await params.supabase.from("activity_logs").insert({
    action: "Sandra: pago confirmado (email)",
    details: `${sandraPaymentNotifyMarker(params.sessionId)};email:${params.customerEmail}`,
  });
  if (logErr) {
    console.error("notifySandraCheckoutPaid: no se pudo guardar log (email sí enviado):", logErr.message);
  }

  return { sent: true };
}
