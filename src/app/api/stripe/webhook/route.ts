import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { notifySandraCheckoutPaid } from "@/lib/checkout-notify-sandra";
import { getCheckoutSessionCustomerEmail } from "@/lib/checkout-session-email";
import {
  buildPremiumAccessEmailHtml,
  buildPremiumAccessEmailText,
} from "@/lib/email-access-link";
import { getClientLoginRedirectUrl } from "@/lib/app-base-url";
import { buildPremium90DayInvoiceRows } from "@/lib/premium-90-invoices";
import { handleVirtualAppointmentPaid } from "@/lib/stripe-virtual-appointment";
import { captureException } from "@/lib/sentry";

async function hasProcessedEventStep(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  eventId: string,
  step: string
) {
  const { data } = await supabase
    .from("activity_logs")
    .select("id")
    .ilike("details", `%stripe_event:${eventId}%step:${step}%`)
    .limit(1)
    .maybeSingle();
  return Boolean(data?.id);
}

async function markProcessedEventStep(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  eventId: string,
  step: string,
  clientId?: string
) {
  await supabase.from("activity_logs").insert({
    client_id: clientId || null,
    action: "Webhook step",
    details: `stripe_event:${eventId};step:${step}`,
  });
}

async function getClientIdByStripeOrEmail(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  stripeCustomerId: string,
  email: string
) {
  if (stripeCustomerId) {
    const { data: byStripe } = await supabase
      .from("clients")
      .select("id")
      .eq("stripe_customer_id", stripeCustomerId)
      .single();
    if (byStripe?.id) return byStripe.id;
  }

  if (email) {
    const { data: byEmail } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email)
      .single();
    if (byEmail?.id) return byEmail.id;
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient();
    const signature = (await headers()).get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Webhook no configurado" }, { status: 400 });
    }

    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    const eventId = event.id;

    const supabase = await createServiceClient();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      // No depender solo de metadata.plan_type: en el webhook a veces llega vacío o distinto
      // y el checkout caería en premium_90d. Si ya guardamos el session id en Supabase, es cita virtual.
      const { data: virtualApptBySession } = await supabase
        .from("virtual_appointments")
        .select("id")
        .eq("stripe_checkout_session_id", session.id)
        .maybeSingle();

      if (virtualApptBySession?.id) {
        await handleVirtualAppointmentPaid(supabase, session, eventId);
        return NextResponse.json({ received: true });
      }

      // Si el update del session id falló en checkout o Stripe no reenvía metadata completo,
      // aún tenemos appointment_row_id en metadata (solo citas virtuales).
      const apptRowId =
        typeof metadata.appointment_row_id === "string" ? metadata.appointment_row_id.trim() : "";
      if (apptRowId) {
        const { data: vaPending } = await supabase
          .from("virtual_appointments")
          .select("id")
          .eq("id", apptRowId)
          .eq("status", "pending")
          .maybeSingle();
        if (vaPending?.id) {
          await handleVirtualAppointmentPaid(supabase, session, eventId);
          return NextResponse.json({ received: true });
        }
      }

      const email = getCheckoutSessionCustomerEmail(session);
      const name =
        (typeof metadata.client_name === "string" && metadata.client_name.trim()) ||
        session.customer_details?.name?.trim() ||
        "Cliente";
      const phone = metadata.client_phone || "";
      const programType = metadata.program_type || "Programa Premium 90 días";
      const planTypeRaw = typeof metadata.plan_type === "string" ? metadata.plan_type.trim() : "";
      const planType = planTypeRaw || "premium_90d";
      const intakeFormId = metadata.intake_form_id || "";

      if (planType === "virtual_appointment") {
        await handleVirtualAppointmentPaid(supabase, session, eventId);
        return NextResponse.json({ received: true });
      }
      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id || "";
      const stripeSubscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id || "";

      if (!email) {
        return NextResponse.json({ received: true });
      }

      const checkoutSessionId = session.id;

      const sandraNotify = await notifySandraCheckoutPaid({
        supabase,
        sessionId: checkoutSessionId,
        intakeFormId,
        customerEmail: email,
        name,
        programType,
        planType,
      });
      if (sandraNotify.sent === false && sandraNotify.reason === "smtp_error") {
        throw new Error(`Sandra notify SMTP: ${sandraNotify.message}`);
      }

      const { data: sessionAlreadyDone } = await supabase
        .from("activity_logs")
        .select("id")
        .ilike("details", `%stripe_session:${checkoutSessionId}%`)
        .limit(1)
        .maybeSingle();
      if (sessionAlreadyDone?.id) {
        return NextResponse.json({ received: true });
      }

      let clientId = metadata.client_id || "";

      if (!clientId) {
        clientId = await getClientIdByStripeOrEmail(supabase, stripeCustomerId, email);
      }

      if (!(await hasProcessedEventStep(supabase, eventId, "checkout_core"))) {
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

          await supabase.from("activity_logs").insert({
            client_id: clientId,
            action: "Pago confirmado",
            details: `${name} (${email}) — ${programType} — stripe_event:${eventId}`,
          });
        }
        await markProcessedEventStep(supabase, eventId, "checkout_core", clientId);
      }

      let appAccessLink = "";
      const setupRedirectTo = getClientLoginRedirectUrl(request);
      const recoveryLink = await supabase.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo: setupRedirectTo },
      });

      const existingUserId = recoveryLink.data.user?.id;
      if (existingUserId) {
        await supabase.from("user_roles").upsert(
          { user_id: existingUserId, role: "client" },
          { onConflict: "user_id" }
        );
      }

      if (!recoveryLink.error && recoveryLink.data.properties?.action_link) {
        appAccessLink = recoveryLink.data.properties.action_link;
      } else {
        const tempPassword = `${crypto.randomUUID()}Aa1!`;
        const createdUser = await supabase.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { full_name: name },
        });

        const userId = createdUser.data.user?.id;
        if (userId) {
          await supabase.from("user_roles").upsert(
            { user_id: userId, role: "client" },
            { onConflict: "user_id" }
          );
        }

        const retryRecovery = await supabase.auth.admin.generateLink({
          type: "recovery",
          email,
          options: { redirectTo: setupRedirectTo },
        });
        appAccessLink = retryRecovery.data.properties?.action_link || "";
      }

      if (appAccessLink && !(await hasProcessedEventStep(supabase, eventId, "checkout_access_email"))) {
        try {
          await sendEmail({
            to: email,
            subject: "Pago confirmado: activa tu acceso al Programa Premium 90 días",
            html: buildPremiumAccessEmailHtml(name, appAccessLink),
            text: buildPremiumAccessEmailText(name, appAccessLink),
          });
          await markProcessedEventStep(supabase, eventId, "checkout_access_email", clientId);
          await supabase.from("activity_logs").insert({
            client_id: clientId || null,
            action: "Cliente: email de acceso enviado",
            details: `access_mail:${checkoutSessionId};email:${email};source:webhook`,
          });
          await supabase.from("activity_logs").insert({
            client_id: clientId || null,
            action: "Stripe checkout processed",
            details: `stripe_session:${checkoutSessionId};email:${email};plan:${planType};source:webhook`,
          });
        } catch (accessMailErr) {
          console.error(
            "Webhook checkout_access_email:",
            accessMailErr instanceof Error ? accessMailErr.message : "unknown"
          );
          throw accessMailErr;
        }
      }

    } else if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const stripeCustomerId =
        typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id || "";
      const rawSubscription = (invoice as unknown as { subscription?: string | Stripe.Subscription | null })
        .subscription;
      const stripeSubscriptionId =
        typeof rawSubscription === "string" ? rawSubscription : rawSubscription?.id || "";
      const email = invoice.customer_email || "";
      const clientId = await getClientIdByStripeOrEmail(supabase, stripeCustomerId, email);

      if (clientId && !(await hasProcessedEventStep(supabase, eventId, "invoice_paid_core"))) {
        const amount = ((invoice.amount_paid || 0) / 100).toFixed(2);
        const dueDate = invoice.status_transitions?.paid_at
          ? new Date(invoice.status_transitions.paid_at * 1000).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        await supabase
          .from("clients")
          .update({
            status: "active",
            stripe_customer_id: stripeCustomerId || null,
            stripe_subscription_id: stripeSubscriptionId || null,
          })
          .eq("id", clientId);

        await supabase.from("invoices").insert({
          client_id: clientId,
          amount: Number(amount),
          currency: (invoice.currency || "eur").toUpperCase(),
          concept: "Renovación mensual Plan Objetivo",
          status: "paid",
          paid_date: dueDate,
          due_date: dueDate,
        });

        await supabase.from("activity_logs").insert({
          client_id: clientId,
          action: "Renovación cobrada",
          details: `Suscripción mensual cobrada correctamente · stripe_event:${eventId}`,
        });
        await markProcessedEventStep(supabase, eventId, "invoice_paid_core", clientId);
      }
    } else if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const stripeCustomerId =
        typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id || "";
      const rawSubscription = (invoice as unknown as { subscription?: string | Stripe.Subscription | null })
        .subscription;
      const stripeSubscriptionId =
        typeof rawSubscription === "string" ? rawSubscription : rawSubscription?.id || "";
      const email = invoice.customer_email || "";
      const clientId = await getClientIdByStripeOrEmail(supabase, stripeCustomerId, email);

      if (clientId && !(await hasProcessedEventStep(supabase, eventId, "invoice_failed_core"))) {
        const dueDate =
          invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

        await supabase
          .from("clients")
          .update({
            stripe_customer_id: stripeCustomerId || null,
            stripe_subscription_id: stripeSubscriptionId || null,
            notes: "Pago mensual fallido. Requiere reintento de cobro.",
          })
          .eq("id", clientId);

        await supabase.from("invoices").insert({
          client_id: clientId,
          amount: Number(((invoice.amount_due || 0) / 100).toFixed(2)),
          currency: (invoice.currency || "eur").toUpperCase(),
          concept: "Renovación mensual Plan Objetivo (fallida)",
          status: "pending",
          due_date: dueDate,
        });

        await supabase.from("activity_logs").insert({
          client_id: clientId,
          action: "Pago fallido",
          details: `Fallo de cobro de suscripción · stripe_event:${eventId}`,
        });
        await markProcessedEventStep(supabase, eventId, "invoice_failed_core", clientId);
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeSubscriptionId = subscription.id;
      const stripeCustomerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id || "";

      let clientId = "";
      if (stripeSubscriptionId) {
        const { data: bySub } = await supabase
          .from("clients")
          .select("id")
          .eq("stripe_subscription_id", stripeSubscriptionId)
          .single();
        clientId = bySub?.id || "";
      }

      if (!clientId && stripeCustomerId) {
        const { data: byCustomer } = await supabase
          .from("clients")
          .select("id")
          .eq("stripe_customer_id", stripeCustomerId)
          .single();
        clientId = byCustomer?.id || "";
      }

      if (clientId && !(await hasProcessedEventStep(supabase, eventId, "subscription_deleted_core"))) {
        await supabase
          .from("clients")
          .update({
            status: "inactive",
            stripe_subscription_id: null,
            notes: "Suscripción cancelada.",
          })
          .eq("id", clientId);

        await supabase.from("activity_logs").insert({
          client_id: clientId,
          action: "Suscripción cancelada",
          details: `Suscripción finalizada en Stripe · stripe_event:${eventId}`,
        });
        await markProcessedEventStep(supabase, eventId, "subscription_deleted_core", clientId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error instanceof Error ? error.message : "unknown");
    captureException(error, { route: "stripe_webhook" });
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }
}

