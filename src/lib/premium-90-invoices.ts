/** Tres meses consecutivos desde el mes del pago (≈90 días) para la cuadrícula de pagos del admin. */

export type Premium90InvoiceInsert = {
  client_id: string;
  amount: number;
  currency: string;
  concept: string;
  status: "paid";
  paid_date: string;
  due_date: string;
};

/** Precio público del Programa Premium 90 días (Stripe + facturas admin). Tres meses × 70 €. */
export const PREMIUM_90_TOTAL_EUR = 210;
export const PREMIUM_90_UNIT_AMOUNT_CENTS = Math.round(PREMIUM_90_TOTAL_EUR * 100);

const PREMIUM_90_MONTHS = 3;

/** Reparte el total en céntimos para que la suma sea exacta (p. ej. 210 → 70 + 70 + 70). */
function splitTotalEurAcrossMonths(totalEur: number, parts: number): number[] {
  const totalCents = Math.round(totalEur * 100);
  const base = Math.floor(totalCents / parts);
  const remainder = totalCents - base * parts;
  return Array.from({ length: parts }, (_, i) => (base + (i < remainder ? 1 : 0)) / 100);
}

/**
 * Tres facturas pagadas que suman el total del programa, vencimiento el día 1 de cada mes cubierto.
 * `paidDateStr` = YYYY-MM-DD del cobro (mismo día en las tres filas).
 */
export function buildPremium90DayInvoiceRows(
  clientId: string,
  paidDateStr: string
): Premium90InvoiceInsert[] {
  const parts = paidDateStr.split("-").map(Number);
  const y = parts[0]!;
  const m = parts[1]!;
  const d = parts[2]!;
  const start = new Date(y, m - 1, d);
  const startMonth = start.getMonth();
  const startYear = start.getFullYear();
  const amounts = splitTotalEurAcrossMonths(PREMIUM_90_TOTAL_EUR, PREMIUM_90_MONTHS);

  const rows: Premium90InvoiceInsert[] = [];
  for (let i = 0; i < PREMIUM_90_MONTHS; i++) {
    const monthIndex = startMonth + i;
    const dueYear = startYear + Math.floor(monthIndex / 12);
    const dueMonth = monthIndex % 12;
    const due_date = `${dueYear}-${String(dueMonth + 1).padStart(2, "0")}-01`;
    rows.push({
      client_id: clientId,
      amount: amounts[i]!,
      currency: "EUR",
      concept: `Programa Premium 90 días (${i + 1}/${PREMIUM_90_MONTHS})`,
      status: "paid",
      paid_date: paidDateStr,
      due_date,
    });
  }
  return rows;
}
