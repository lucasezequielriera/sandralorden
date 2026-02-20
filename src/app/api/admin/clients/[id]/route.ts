import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const body = await request.json();

  const { data, error } = await supabase
    .from("clients")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Cliente actualizado", `${data.name} (${data.email})`, id);
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase.from("clients").select("name, email").eq("id", id).single();

  const { data: fileRows } = await supabase.from("files").select("file_url").eq("client_id", id);
  if (fileRows && fileRows.length > 0) {
    const paths = fileRows
      .map((f) => {
        const match = f.file_url.match(/client-files\/(.+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];
    if (paths.length > 0) {
      await supabase.storage.from("client-files").remove(paths);
    }
  }

  await supabase.from("activity_logs").delete().eq("client_id", id);
  if (client?.name) {
    await supabase.from("activity_logs").delete().is("client_id", null).ilike("details", `%${client.name}%`);
  }

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Cliente eliminado", `${client?.name ?? "—"} (${client?.email ?? id})`);
  return NextResponse.json({ success: true });
}
