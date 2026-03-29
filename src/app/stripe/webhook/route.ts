/**
 * Alias por si el endpoint en Stripe se configuró sin el prefijo /api (p. ej. …/stripe/webhook).
 * La ruta canónica sigue siendo POST /api/stripe/webhook
 */
export { POST } from "../../api/stripe/webhook/route";
