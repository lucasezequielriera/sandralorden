import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe";
import { sanitizeField, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import { getPublicAppOrigin } from "@/lib/app-base-url";
import { PREMIUM_90_UNIT_AMOUNT_CENTS } from "@/lib/premium-90-invoices";

const PREMIUM_PROGRAM_LABELS = new Set(["Programa Premium 90 días", "Premium 90-Day Program"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let name = sanitizeField(body.name, 100);
    let email = sanitizeEmail(body.email);
    let phone = sanitizePhone(body.phone);
    const programType = sanitizeField(body.programType, 100);
    const planType = sanitizeField(body.planType, 50) || "premium_90d";
    const locale = sanitizeField(body.locale, 10) || "es";
    const intakeFormId = sanitizeField(body.intakeFormId, 100);

    if (planType === "premium_90d" && !PREMIUM_PROGRAM_LABELS.has(programType)) {
      return NextResponse.json({ error: "El checkout premium solo aplica al Programa Premium 90 días." }, { status: 400 });
    }

    const supabase = await createServiceClient();
    let clientId = sanitizeField(body.clientId, 100);

    if (!clientId) {
      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("email", email)
        .single();

      if (existing?.id) {
        clientId = existing.id;
      }
    }

    if (clientId && (!name || !email || !phone)) {
      const { data: existingClient } = await supabase
        .from("clients")
        .select("name, email, phone")
        .eq("id", clientId)
        .single();
      name = name || sanitizeField(existingClient?.name, 100);
      email = email || sanitizeEmail(existingClient?.email);
      phone = phone || sanitizePhone(existingClient?.phone);
    }

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Faltan datos obligatorios para el pago." }, { status: 400 });
    }

    const stripe = getStripeClient();
    const origin = getPublicAppOrigin(request);
    const successPathBase = locale === "en" ? "/en/formulario?checkout=success" : "/formulario?checkout=success";
    const successPath = `${successPathBase}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelPathBase = locale === "en" ? "/en/formulario?checkout=cancelled" : "/formulario?checkout=cancelled";
    const cancelPath = `${cancelPathBase}&offer=monthly${clientId ? `&clientId=${encodeURIComponent(clientId)}` : ""}`;
    const isMonthly = planType === "monthly_50";

    const session = await stripe.checkout.sessions.create({
      mode: isMonthly ? "subscription" : "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: isMonthly ? "Plan Mensual Objetivo" : "Programa Premium 90 días",
              description: isMonthly
                ? "Entrenamiento + nutrición en formato mensual."
                : "Entrenamiento + nutrición con actualizaciones mensuales.",
            },
            unit_amount: isMonthly ? 5000 : PREMIUM_90_UNIT_AMOUNT_CENTS,
            ...(isMonthly ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        client_id: clientId || "",
        client_name: name,
        client_phone: phone,
        client_email: email,
        program_type: isMonthly ? "Plan Mensual Objetivo" : programType,
        plan_type: planType,
        intake_form_id: intakeFormId || "",
      },
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}${cancelPath}`,
    });

    await supabase.from("activity_logs").insert({
      client_id: clientId || null,
      action: "Funnel event",
      details: `event:checkout_started;stage:checkout;plan:${planType};locale:${locale};email:${email}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 500 });
  }
}

