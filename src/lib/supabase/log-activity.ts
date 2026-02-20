import { createClient } from "./server";

export async function logActivity(action: string, details = "", clientId?: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("activity_logs").insert({
      user_id: user?.id ?? null,
      client_id: clientId ?? null,
      action,
      details,
    });
  } catch {
    // Non-blocking
  }
}
