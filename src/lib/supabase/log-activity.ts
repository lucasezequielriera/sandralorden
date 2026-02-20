import { createClient } from "./server";

export async function logActivity(action: string, details = "") {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("activity_logs").insert({
      user_id: user?.id ?? null,
      action,
      details,
    });
  } catch {
    // Non-blocking
  }
}
