"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const unauthorizedError = searchParams.get("error") === "unauthorized" ? "No tienes permisos de administrador" : null;
  const displayError = error || unauthorizedError;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Error al obtener usuario");
      setLoading(false);
      return;
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleRow?.role !== "admin") {
      await supabase.auth.signOut();
      setError("No tienes permisos de administrador");
      setLoading(false);
      return;
    }

    await supabase.from("activity_logs").insert({
      action: "Inicio de sesión",
      details: email,
    });
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crema via-rosa-50 to-marron-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] italic text-3xl font-light text-warm-dark">
            Sandra Lorden
          </h1>
          <p className="text-sm text-warm-gray-400 mt-2">Panel de Administración</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-warm-gray-100/50 shadow-lg"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-warm-dark mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all text-sm"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-warm-dark mb-1.5">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            {displayError && (
              <p className="text-sm text-red-400 text-center">{displayError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-xl transition-all hover:bg-warm-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-warm-gray-400 hover:text-warm-dark transition-colors">
            ← Volver a la web
          </Link>
        </div>
      </div>
    </div>
  );
}
