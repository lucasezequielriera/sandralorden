"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { consumeImplicitHashSession } from "@/lib/supabase/consume-auth-hash";
import { getBrowserAppOrigin } from "@/lib/app-base-url";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const unauthorizedError = searchParams.get("error") === "unauthorized" ? "No tienes permisos de administrador" : null;
  const isResetStep = searchParams.get("reset") === "1";
  const displayError = error || unauthorizedError;

  const checkRecoverySession = useCallback(async () => {
    if (!isResetStep) return;
    const supabase = createClient();

    if (typeof window !== "undefined" && window.location.hash.includes("error=")) {
      const raw = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
      const p = new URLSearchParams(raw);
      const desc = p.get("error_description") || p.get("error_code") || "enlace inválido";
      try {
        setError(decodeURIComponent(desc.replace(/\+/g, " ")));
      } catch {
        setError(desc);
      }
      setRecoveryReady(false);
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }

    await consumeImplicitHashSession(supabase);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setError("Este enlace caducó o ya se usó. Pide un nuevo email de recuperación.");
      setRecoveryReady(false);
      return;
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleRow?.role !== "admin") {
      await supabase.auth.signOut();
      setError("Esta cuenta no tiene permisos de administrador.");
      setRecoveryReady(false);
      return;
    }

    setRecoveryReady(true);
    if (session.user.email) setEmail(session.user.email);
  }, [isResetStep]);

  useEffect(() => {
    void checkRecoverySession();
  }, [checkRecoverySession]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const supabase = createClient();
    const redirectTo = `${getBrowserAppOrigin()}/admin/login?reset=1`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setLoading(false);
    if (resetError) {
      setError("No se pudo enviar el email. Inténtalo de nuevo.");
      return;
    }
    setInfo("Te enviamos un enlace para restablecer la contraseña. Revisa tu correo.");
    setForgotMode(false);
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError("No se pudo guardar la contraseña. Prueba de nuevo o pide un nuevo enlace.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

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

  if (isResetStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crema via-rosa-50 to-marron-50 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-display)] italic text-3xl font-light text-warm-dark">
              Nueva contraseña
            </h1>
            <p className="text-sm text-warm-gray-400 mt-2">Panel de administración</p>
          </div>

          {recoveryReady ? (
            <form
              onSubmit={handleSetPassword}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-warm-gray-100/50 shadow-lg"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="admin-recovery-email" className="block text-sm font-medium text-warm-dark mb-1.5">
                    Email
                  </label>
                  <input
                    id="admin-recovery-email"
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/70 border border-warm-gray-200/50 text-warm-dark text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="admin-recovery-password" className="block text-sm font-medium text-warm-dark mb-1.5">
                    Nueva contraseña
                  </label>
                  <input
                    id="admin-recovery-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200"
                  />
                </div>
                <div>
                  <label htmlFor="admin-recovery-confirm" className="block text-sm font-medium text-warm-dark mb-1.5">
                    Repite la contraseña
                  </label>
                  <input
                    id="admin-recovery-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200"
                  />
                </div>
                {displayError && <p className="text-sm text-red-400 text-center">{displayError}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Guardando..." : "Guardar y entrar"}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-warm-gray-100/50 shadow-lg text-center">
              {!displayError && <p className="text-sm text-warm-gray-500">Preparando enlace...</p>}
              {displayError && <p className="text-sm text-red-400">{displayError}</p>}
            </div>
          )}

          <div className="text-center mt-6">
            <Link href="/admin/login" className="text-sm text-warm-gray-400 hover:text-warm-dark transition-colors">
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crema via-rosa-50 to-marron-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] italic text-3xl font-light text-warm-dark">
            Sandra Lorden
          </h1>
          <p className="text-sm text-warm-gray-400 mt-2">Panel de Administración</p>
        </div>

        {forgotMode ? (
          <form
            onSubmit={handleForgotPassword}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-warm-gray-100/50 shadow-lg"
          >
            <p className="text-sm text-warm-gray-500 mb-4">
              Te enviaremos un enlace a tu correo para restablecer la contraseña del panel admin.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-warm-dark mb-1.5">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200"
                  placeholder="tu@email.com"
                />
              </div>
              {displayError && <p className="text-sm text-red-400 text-center">{displayError}</p>}
              {info && <p className="text-sm text-green-700 text-center">{info}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-xl hover:bg-warm-gray-500 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setError(null);
                }}
                className="w-full text-sm text-warm-gray-400 hover:text-warm-dark cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
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

              {displayError && <p className="text-sm text-red-400 text-center">{displayError}</p>}
              {info && <p className="text-sm text-green-700 text-center">{info}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 text-sm font-medium text-white bg-warm-dark rounded-xl transition-all hover:bg-warm-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotMode(true);
                  setError(null);
                  setInfo(null);
                }}
                className="w-full text-sm text-warm-gray-400 hover:text-warm-dark cursor-pointer"
              >
                Olvidé mi contraseña
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-warm-gray-400 hover:text-warm-dark transition-colors">
            ← Volver a la web
          </Link>
        </div>
      </div>
    </div>
  );
}
