"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    supabase.from("activity_logs").insert({
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

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
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
          <a href="/" className="text-sm text-warm-gray-400 hover:text-warm-dark transition-colors">
            ← Volver a la web
          </a>
        </div>
      </div>
    </div>
  );
}
