import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import ContabilidadContent from "@/components/admin/ContabilidadContent";

export default async function ContabilidadPage() {
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, clients(name, email)")
    .order("created_at", { ascending: false });

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  return (
    <AdminShell>
      <ContabilidadContent invoices={invoices ?? []} clients={clients ?? []} />
    </AdminShell>
  );
}
