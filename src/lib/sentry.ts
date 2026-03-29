/**
 * Errores en producción (Sentry). Sin NEXT_PUBLIC_SENTRY_DSN no hace nada.
 */
export function captureException(error: unknown, extra?: Record<string, unknown>): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || typeof dsn !== "string") return;

  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.captureException(error, extra ? { extra } : {});
  });
}
