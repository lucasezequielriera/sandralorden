import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe";
import { sanitizeField } from "@/lib/sanitize";
import { notifySandraCheckoutPaid } from "@/lib/checkout-notify-sandra";
import { sendEmail } from "@/lib/email";
import { getCheckoutSessionCustomerEmail } from "@/lib/checkout-session-email";
import {
  buildPremiumAccessEmailHtml,
  buildPremiumAccessEmailText,
} from "@/lib/email-access-link";
import { getClientLoginRedirectUrl } from "@/lib/app-base-url";
import { resolveClientRecoveryActionLink } from "@/lib/supabase/resolve-client-recovery-link";
import { buildPremium90DayInvoiceRows } from "@/lib/premium-90-invoices";

async function activityLogHasFragment(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  fragment: string
): Promise<boolean> {
  const { data } = await supabase
    .from("activity_logs")
    .select("id")
    .ilike("details", `%${fragment}%`)
    .limit(1)
    .maybeSingle();
  return Boolean(data?.id);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = sanitizeField(body.sessionId, 200);
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId requerido" }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Pago no confirmado" }, { status: 400 });
    }

    const metadata = session.metadata || {};
    const email = getCheckoutSessionCustomerEmail(session);
    const name =
      (typeof metadata.client_name === "string" && metadata.client_name.trim()) ||
      session.customer_details?.name?.trim() ||
      "Cliente";
    const phone = metadata.client_phone || "";
    const programType = metadata.program_type || "Programa Premium 90 días";
    const planType = metadata.plan_type || "premium_90d";
    const intakeFormId = metadata.intake_form_id || "";
    const stripeCustomerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id || "";
    const stripeSubscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id || "";

    if (!email) {
      return NextResponse.json(
        { error: "No hay email en la sesión de pago (metadata ni Stripe). No se puede enviar el acceso." },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    const sandraNotify = await notifySandraCheckoutPaid({
      supabase,
      sessionId,
      intakeFormId,
      customerEmail: email,
      name,
      programType,
      planType,
    });

    const accessMailMarker = `access_mail:${sessionId}`;
    if (await activityLogHasFragment(supabase, accessMailMarker)) {
      return NextResponse.json({ ok: true, alreadyProcessed: true, sandraNotify });
    }

    const coreDoneMarker = `stripe_session:${sessionId}`;
    const coreDone = await activityLogHasFragment(supabase, coreDoneMarker);

    let clientId = metadata.client_id || "";
    if (!coreDone) {
      if (!clientId) {
        const { data: byEmail } = await supabase
          .from("clients")
          .select("id")
          .eq("email", email)
          .single();
        clientId = byEmail?.id || "";
      }

      if (!clientId) {
        const { data: created } = await supabase
          .from("clients")
          .insert({
            name,
            email,
            phone,
            service_type: "Entrenamiento + Nutrición",
            modality: "virtual",
            status: "active",
            notes: `Cliente ${planType === "monthly_50" ? "mensual" : "de pago único"} · ${programType}`,
            stripe_customer_id: stripeCustomerId || null,
            stripe_subscription_id: stripeSubscriptionId || null,
          })
          .select("id")
          .single();
        clientId = created?.id || "";
      } else {
        await supabase
          .from("clients")
          .update({
            status: "active",
            notes: `Cliente ${planType === "monthly_50" ? "mensual" : "de pago único"} · ${programType}`,
            stripe_customer_id: stripeCustomerId || null,
            stripe_subscription_id: stripeSubscriptionId || null,
          })
          .eq("id", clientId);
      }

      if (clientId) {
        const paidDateStr = new Date().toISOString().split("T")[0];
        if (planType === "premium_90d") {
          await supabase.from("invoices").insert(buildPremium90DayInvoiceRows(clientId, paidDateStr));
        } else if (planType === "monthly_50") {
          await supabase.from("invoices").insert({
            client_id: clientId,
            amount: 50,
            currency: "EUR",
            concept: "Plan Mensual Objetivo (suscripción)",
            status: "paid",
            paid_date: paidDateStr,
            due_date: paidDateStr,
          });
        }
      }
    }

    const setupRedirectTo = getClientLoginRedirectUrl();
    const appAccessLink = await resolveClientRecoveryActionLink(supabase, {
      email,
      name,
      redirectTo: setupRedirectTo,
    });

    if (!appAccessLink) {
      console.error("Checkout confirm: sin action_link de Supabase para", email);
      return NextResponse.json(
        {
          error: "No se pudo generar el enlace de acceso. Revisa Supabase y reintenta.",
          sandraNotify,
        },
        { status: 500 }
      );
    }

    try {
      await sendEmail({
        to: email,
        subject: "Pago confirmado: activa tu acceso al Programa Premium 90 días",
        html: buildPremiumAccessEmailHtml(name, appAccessLink),
        text: buildPremiumAccessEmailText(name, appAccessLink),
      });
    } catch (mailErr) {
      console.error(
        "Checkout confirm: fallo SMTP al cliente:",
        mailErr instanceof Error ? mailErr.message : "unknown"
      );
      return NextResponse.json(
        { error: "El pago está confirmado pero no se pudo enviar el email. Revisa SMTP/Brevo y reintenta." },
        { status: 500 }
      );
    }

    await supabase.from("activity_logs").insert({
      client_id: clientId || null,
      action: "Cliente: email de acceso enviado",
      details: `${accessMailMarker};email:${email}`,
    });

    if (!coreDone) {
      await supabase.from("activity_logs").insert({
        client_id: clientId || null,
        action: "Pago confirmado (confirm fallback)",
        details: `${coreDoneMarker};email:${email};plan:${planType}`,
      });
    }

    return NextResponse.json({ ok: true, repaired: coreDone, sandraNotify });
  } catch (error) {
    console.error("Checkout confirm error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "No se pudo confirmar checkout" }, { status: 500 });
  }
}
