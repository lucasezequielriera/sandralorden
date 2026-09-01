import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Convierte #access_token + refresh_token del hash (flujo implícito / recovery) en sesión.
 * Más fiable que depender solo de getSession() cuando hay carreras con otros efectos.
 */
export async function consumeImplicitHashSession(supabase: SupabaseClient): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const h = window.location.hash ?? "";
  if (h.length < 2 || !h.includes("access_token")) return false;

  const params = new URLSearchParams(h.startsWith("#") ? h.slice(1) : h);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (!access_token || !refresh_token) return false;

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    console.error("consumeImplicitHashSession:", error.message);
    return false;
  }

  const clean = window.location.pathname + window.location.search;
  window.history.replaceState(null, "", clean);
  return true;
}
