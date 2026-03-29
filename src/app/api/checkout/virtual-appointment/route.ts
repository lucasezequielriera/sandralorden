import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe";
import { sanitizeField, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import { getPublicAppOrigin } from "@/lib/app-base-url";
import {
  fetchAvailableSlots,
  getVirtualAppointmentUnitAmountCents,
} from "@/lib/virtual-appointments";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`va_checkout:${ip}`, { maxRequests: 10, windowMs: 120_000 });
  if (!success) {
    return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const startsAt = sanitizeField(body.startsAt, 80);
    const endsAt = sanitizeField(body.endsAt, 80);
    let name = sanitizeField(body.name, 100);
    let email = sanitizeEmail(body.email);
    let phone = sanitizePhone(body.phone);
    const reason = sanitizeField(body.reason, 2000);
    const clientId = sanitizeField(body.clientId, 100);
    const sourceRaw = sanitizeField(body.source, 20);
    const source = sourceRaw === "client" ? "client" : "home";
    const locale = sanitizeField(body.locale, 10) || "es";

    const supabase = await createServiceClient();

    if (clientId) {
      const { data: c } = await supabase.from("clients").select("name, email, phone").eq("id", clientId).maybeSingle();
      if (!c) {
        return NextResponse.json({ error: "Cliente no encontrado." }, { status: 400 });
      }
      name = name || sanitizeField(c.name, 100);
      email = email || sanitizeEmail(c.email);
      phone = phone || sanitizePhone(c.phone);
    }

    if (!startsAt || !endsAt || !name || !email || !phone || !reason) {
      return NextResponse.json({ error: "Faltan datos obligatorios." }, { status: 400 });
    }

    /** Stripe metadata values ≤ 500 chars */
    const reasonMeta = reason.slice(0, 500);

    const available = await fetchAvailableSlots(supabase);
    const picked = available.find((s) => s.startsAt === startsAt && s.endsAt === endsAt);
    if (!picked) {
      return NextResponse.json({ error: "Ese horario ya no está disponible." }, { status: 400 });
    }

    const unitAmount = getVirtualAppointmentUnitAmountCents();
    const stripe = getStripeClient();
    const origin = getPublicAppOrigin(request);

    const successPath =
      locale === "en" ? "/en/virtual-appointment?checkout=success" : "/cita-virtual?checkout=success";
    const cancelPath =
      locale === "en" ? "/en/virtual-appointment?checkout=cancelled" : "/cita-virtual?checkout=cancelled";

    const { data: inserted, error: insErr } = await supabase
      .from("virtual_appointments")
      .insert({
        client_id: clientId || null,
        email,
        name,
        phone,
        starts_at: startsAt,
        ends_at: endsAt,
        status: "pending",
        source,
        reason,
        locale: locale === "en" ? "en" : "es",
      })
      .select("id")
      .single();

    if (insErr || !inserted) {
      const code = (insErr as { code?: string } | undefined)?.code;
      if (code === "23505") {
        return NextResponse.json(
          { error: "Ese horario acaba de ser reservado. Elige otro." },
          { status: 409 },
        );
      }
      console.error("virtual_appointment insert:", insErr?.message);
      return NextResponse.json({ error: "No se pudo reservar el hueco." }, { status: 500 });
    }

    let session;
    try {
      session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Cita virtual con Sandra Lorden",
              description: "Videollamada individual (Google Meet tras el pago).",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan_type: "virtual_appointment",
        client_name: name,
        client_email: email,
        client_phone: phone,
        client_id: clientId || "",
        slot_start: startsAt,
        slot_end: endsAt,
        appointment_reason: reasonMeta,
        appointment_row_id: inserted.id,
        source,
        locale,
      },
      success_url: `${origin}${successPath}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}`,
    });
    } catch (stripeErr) {
      await supabase.from("virtual_appointments").delete().eq("id", inserted.id);
      throw stripeErr;
    }

    const { error: updErr } = await supabase
      .from("virtual_appointments")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", inserted.id);

    if (updErr) {
      console.error("virtual_appointment stripe_checkout_session_id update:", updErr.message);
      await supabase.from("virtual_appointments").delete().eq("id", inserted.id);
      return NextResponse.json({ error: "No se pudo vincular el pago con la reserva." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("checkout virtual-appointment:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 500 });
  }
}
