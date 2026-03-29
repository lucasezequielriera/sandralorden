import type { NextRequest } from "next/server";

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

/**
 * Origen público para success_url de Stripe, redirect_to de Supabase y enlaces en emails.
 *
 * En local, si NEXT_PUBLIC_APP_URL apunta a otro puerto que el de la petición actual
 * (p. ej. .env con :3000 y `npm run dev` en :3001), usamos el origen de la petición
 * para no generar enlaces rotos.
 *
 * NEXT_PUBLIC_APP_URL debe incluir esquema (http://localhost:3001). Si solo pones
 * localhost:3001, lo normalizamos a http://… para que Supabase acepte redirect_to.
 */
export function getPublicAppOrigin(request: Request | NextRequest): string {
  let reqOrigin = "";
  try {
    reqOrigin = new URL(request.url).origin.replace(/\/$/, "");
  } catch {
    reqOrigin = "";
  }

  const envRaw = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (!envRaw) {
    return reqOrigin || "http://localhost:3000";
  }

  const envAbsolute = normalizeEnvAppUrl(envRaw);

  try {
    const envUrl = new URL(envAbsolute);
    const reqUrl = reqOrigin ? new URL(reqOrigin) : null;

    if (
      reqUrl &&
      envUrl.hostname === "localhost" &&
      reqUrl.hostname === "localhost" &&
      envUrl.port !== reqUrl.port
    ) {
      return reqOrigin;
    }

    return envUrl.origin.replace(/\/$/, "");
  } catch {
    return reqOrigin || "http://localhost:3000";
  }
}

/** redirect_to del enlace mágico de Supabase: debe abrir la vista de crear contraseña, no el login estándar. */
export function getClientLoginRedirectUrl(request: Request | NextRequest): string {
  return `${getPublicAppOrigin(request)}/login?nueva=1`;
}

/** Origen del sitio desde env (emails y jobs sin Request). Incluye esquema. */
export function getPublicSiteOriginFromEnv(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (!raw) return "http://localhost:3000";
  return normalizeEnvAppUrl(raw);
}
