import type Stripe from "stripe";

/**
 * Stripe Checkout puede rellenar el email en metadata, customer_details o customer_email.
 */
export function getCheckoutSessionCustomerEmail(session: Stripe.Checkout.Session): string {
  const metadata = session.metadata || {};
  const fromMeta =
    (typeof metadata.client_email === "string" && metadata.client_email.trim()) ||
    (typeof metadata.customer_email === "string" && metadata.customer_email.trim()) ||
    "";
  if (fromMeta) return fromMeta;
  const fromDetails = session.customer_details?.email?.trim() || "";
  if (fromDetails) return fromDetails;
  const top = (session as { customer_email?: string | null }).customer_email;
  if (typeof top === "string" && top.trim()) return top.trim();
  return "";
}
