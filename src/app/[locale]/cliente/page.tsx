import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientDashboardContent from "@/components/client/ClientDashboardContent";

export default async function ClienteDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleRow?.role !== "client") {
    redirect("/login");
  }

  const email = user.email ?? "";
  const { data: client } = await supabase
    .from("clients")
    .select("id, name")
    .eq("email", email)
    .maybeSingle();

  const { data: intake } = await supabase
    .from("intake_forms")
    .select("payload")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: plans } = client?.id
    ? await supabase
        .from("files")
        .select("file_name, file_url, uploaded_at")
        .eq("client_id", client.id)
        .order("uploaded_at", { ascending: false })
    : { data: [] as Array<{ file_name: string; file_url: string; uploaded_at: string }> };

  const { data: paidInvoices } = client?.id
    ? await supabase
        .from("invoices")
        .select("id")
        .eq("client_id", client.id)
        .eq("status", "paid")
        .limit(1)
    : { data: [] as Array<{ id: string }> };

  const trainingPlan =
    plans?.find((f) => f.file_name.startsWith("PLAN_TRAINING__")) ?? null;
  const nutritionPlan =
    plans?.find((f) => f.file_name.startsWith("PLAN_NUTRITION__")) ?? null;
  const hasPaidInvoice = Boolean(paidInvoices?.length);

  const { data: virtualList } = await supabase
    .from("virtual_appointments")
    .select("starts_at, meet_link, reason")
    .eq("email", email)
    .eq("status", "paid")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1);

  const nextVirtual = virtualList?.[0] ?? null;

  return (
    <ClientDashboardContent
      clientName={client?.name || "Cliente"}
      intakePayload={(intake?.payload as Record<string, unknown>) || null}
      trainingPlan={trainingPlan}
      nutritionPlan={nutritionPlan}
      hasPaidInvoice={hasPaidInvoice}
      nextVirtual={nextVirtual}
    />
  );
}

