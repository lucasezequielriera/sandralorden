"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";

/**
 * Supabase recovery / magic links put tokens in the URL hash. The server never
 * sees the hash, so middleware cannot set cookies until the browser runs
 * getSession(). Home and marketing pages did not load Supabase, so tokens
 * were ignored. This component runs once on the client, establishes the
 * session, strips tokens from the address bar, and sends recovery users to
 * set their password.
 */
export default function SupabaseAuthRecoveryBridge() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || typeof window === "undefined") return;

    const path = window.location.pathname;
    const search = window.location.search ?? "";
    const hash = window.location.hash ?? "";

    // Evita carrera con la página de login: ella hace setSession desde el hash.
    if (path.includes("/login") && search.includes("nueva=1")) {
      return;
    }

    const hasHashTokens = hash.length > 1 && hash.includes("access_token");
    const hasCodeParam = search.includes("code=");

    if (!hasHashTokens && !hasCodeParam) return;

    ran.current = true;
    const supabase = createClient();

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const paramsFromHash = new URLSearchParams(hash.replace(/^#/, "?"));
      const isRecovery = paramsFromHash.get("type") === "recovery";

      const pathOnly = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", pathOnly);

      if (session?.user && isRecovery) {
        router.replace({ pathname: "/login", query: { nueva: "1" } });
        return;
      }

      if (session?.user) {
        router.refresh();
      }
    })();
  }, [router]);

  return null;
}
