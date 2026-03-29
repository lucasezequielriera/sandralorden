import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";

/** URL del recibo de Stripe (Checkout Session o cargo asociado al PaymentIntent). */
export async function getCheckoutReceiptUrl(session: Stripe.Checkout.Session): Promise<string | null> {
  const direct = (session as { receipt_url?: string | null }).receipt_url;
  if (typeof direct === "string" && direct.startsWith("http")) return direct;

  const piRef = session.payment_intent;
  const piId =
    typeof piRef === "string"
      ? piRef
      : piRef && typeof piRef === "object" && "id" in piRef
        ? (piRef as { id: string }).id
        : null;
  if (!piId) return null;

  try {
    const stripe = getStripeClient();
    const pi = await stripe.paymentIntents.retrieve(piId, { expand: ["latest_charge"] });
    const ch = pi.latest_charge;
    if (typeof ch === "object" && ch !== null && "receipt_url" in ch) {
      const ru = (ch as { receipt_url?: string | null }).receipt_url;
      if (typeof ru === "string" && ru.startsWith("http")) return ru;
    }
  } catch {
    return null;
  }
  return null;
}
