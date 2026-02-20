import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();

  const { data, error } = await supabase
    .from("clients")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Cliente actualizado", `${data.name} (${data.email})`);
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await logActivity("Cliente eliminado", `${client?.name ?? "—"} (${client?.email ?? id})`);
  return NextResponse.json({ success: true });
}
