import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import ClientsListContent from "@/components/admin/ClientsListContent";

export default async function ClientesPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <ClientsListContent clients={clients ?? []} />
    </AdminShell>
  );
}
