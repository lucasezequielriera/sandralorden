import type { NextRequest } from "next/server";

/** Origen canónico de producción (emails Supabase, Stripe, enlaces en correos). */
export const PRODUCTION_SITE_ORIGIN = "https://www.sandralorden.com";

/** Acepta "localhost:3001" o "https://dominio.com" y devuelve URL absoluta. */
function normalizeEnvAppUrl(raw: string): string {
  const t = raw.trim().replace(/\/$/, "");
  if (!t) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("localhost") || t.startsWith("127.0.0.1")) {
    return `http://${t}`;
  }
  return `https://${t}`;
}

function isLocalhostHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isLocalhostUrl(raw: string): boolean {
  try {
    const u = new URL(normalizeEnvAppUrl(raw));
    return isLocalhostHost(u.hostname);
  } catch {
    return false;
  }
}

function isProductionDeploy(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

/**
 * Origen público para success_url de Stripe, redirect_to de Supabase y enlaces en emails.
 * En producción nunca usa localhost aunque NEXT_PUBLIC_APP_URL o la petición apunten a local.
 */
export function getPublicAppOrigin(request?: Request | NextRequest): string {
  const envRaw = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  if (isProductionDeploy()) {
    if (envRaw && !isLocalhostUrl(envRaw)) {
      try {
        return new URL(normalizeEnvAppUrl(envRaw)).origin;
      } catch {
        return PRODUCTION_SITE_ORIGIN;
      }
    }
    return PRODUCTION_SITE_ORIGIN;
  }

  let reqOrigin = "";
  if (request) {
    try {
      reqOrigin = new URL(request.url).origin.replace(/\/$/, "");
    } catch {
      reqOrigin = "";
    }
  }

  if (!envRaw) {
    return reqOrigin || "http://localhost:3000";
  }

  const envAbsolute = normalizeEnvAppUrl(envRaw);

  try {
    const envUrl = new URL(envAbsolute);
    const reqUrl = reqOrigin ? new URL(reqOrigin) : null;

    if (
      reqUrl &&
      isLocalhostHost(envUrl.hostname) &&
      isLocalhostHost(reqUrl.hostname) &&
      envUrl.port !== reqUrl.port
    ) {
      return reqOrigin;
    }

    return envUrl.origin.replace(/\/$/, "");
  } catch {
    return reqOrigin || "http://localhost:3000";
  }
}

/** Para componentes cliente: producción siempre usa el dominio público. */
export function getBrowserAppOrigin(): string {
  if (typeof window === "undefined") return PRODUCTION_SITE_ORIGIN;
  const { hostname, origin } = window.location;
  if (isLocalhostHost(hostname)) return origin.replace(/\/$/, "");
  return PRODUCTION_SITE_ORIGIN;
}

/** redirect_to del enlace mágico de Supabase: vista de crear contraseña de cliente. */
export function getClientLoginRedirectUrl(request?: Request | NextRequest): string {
  return `${getPublicAppOrigin(request)}/login?nueva=1`;
}

/** redirect_to para restablecer contraseña del panel admin. */
export function getAdminLoginRedirectUrl(request?: Request | NextRequest): string {
  return `${getPublicAppOrigin(request)}/admin/login?reset=1`;
}
