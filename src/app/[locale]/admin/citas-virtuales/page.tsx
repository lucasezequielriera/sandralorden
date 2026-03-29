import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import VirtualAppointmentsContent from "@/components/admin/VirtualAppointmentsContent";

export default async function CitasVirtualesAdminPage() {
  const supabase = await createClient();
  const { data: appointments } = await supabase
    .from("virtual_appointments")
    .select("id, starts_at, ends_at, name, email, phone, reason, status, source, meet_link, created_at")
    .order("starts_at", { ascending: true });

  return (
    <AdminShell>
      <VirtualAppointmentsContent appointments={appointments ?? []} />
    </AdminShell>
  );
}
