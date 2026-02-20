import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ClientDetailContent from "@/components/admin/ClientDetailContent";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("client_id", id)
    .order("date", { ascending: false });

  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("client_id", id)
    .order("uploaded_at", { ascending: false });

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <ClientDetailContent
        client={client}
        sessions={sessions ?? []}
        files={files ?? []}
        invoices={invoices ?? []}
      />
    </AdminShell>
  );
}
