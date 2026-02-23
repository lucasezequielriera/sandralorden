import { createClient } from "./server";
import { rateLimit } from "@/lib/rate-limit";

export type UserRole = "admin" | "client" | null;

export async function getUserRole(): Promise<UserRole> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return (data?.role as UserRole) ?? null;
}

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { authorized: false as const, user: null, rateLimited: false, supabase };

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (data?.role !== "admin") {
    return { authorized: false as const, user: null, rateLimited: false, supabase };
  }

  const { success } = rateLimit(`admin:${user.id}`, { maxRequests: 120, windowMs: 60_000 });
  if (!success) {
    return { authorized: true as const, user, rateLimited: true, supabase };
  }

  return { authorized: true as const, user, rateLimited: false, supabase };
}
