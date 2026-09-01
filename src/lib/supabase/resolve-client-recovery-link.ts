import type { createServiceClient } from "./server";

type ServiceSupabase = Awaited<ReturnType<typeof createServiceClient>>;

/**
 * Genera un enlace recovery de Supabase (crear contraseña). Si el usuario no existe en Auth,
 * lo crea con contraseña temporal y reintenta.
 */
export async function resolveClientRecoveryActionLink(
  supabase: ServiceSupabase,
  params: { email: string; name: string; redirectTo: string }
): Promise<string> {
  const { email, name, redirectTo } = params;

  const firstTry = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  const existingUserId = firstTry.data.user?.id;
  if (existingUserId) {
    await supabase.from("user_roles").upsert(
      { user_id: existingUserId, role: "client" },
      { onConflict: "user_id" }
    );
  }

  if (!firstTry.error && firstTry.data.properties?.action_link) {
    return firstTry.data.properties.action_link;
  }

  const tempPassword = `${crypto.randomUUID()}Aa1!`;
  const createdUser = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  const createdUserId = createdUser.data.user?.id;
  if (createdUserId) {
    await supabase.from("user_roles").upsert(
      { user_id: createdUserId, role: "client" },
      { onConflict: "user_id" }
    );
  }

  const retry = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  return retry.data.properties?.action_link || "";
}
