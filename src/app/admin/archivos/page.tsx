import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import ArchivosContent from "@/components/admin/ArchivosContent";

export default async function ArchivosPage() {
  const supabase = await createClient();

  const { data: files } = await supabase
    .from("files")
    .select("*, clients(name)")
    .order("uploaded_at", { ascending: false });

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  return (
    <AdminShell>
      <ArchivosContent files={files ?? []} clients={clients ?? []} />
    </AdminShell>
  );
}
