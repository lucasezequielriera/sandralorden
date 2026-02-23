import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { requireAdmin } from "@/lib/supabase/check-role";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Client GET error:", error.message);
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;

  const body = await request.json();

  const ALLOWED_FIELDS = ["name", "email", "phone", "modality", "service_type", "status", "goal", "notes"];
  const filtered: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) filtered[key] = body[key];
  }

  if (Object.keys(filtered).length === 0) {
    return NextResponse.json({ error: "No se proporcionaron campos válidos." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("clients")
    .update(filtered)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Client PATCH error:", error.message);
    return NextResponse.json({ error: "Error al actualizar el cliente" }, { status: 500 });
  }
  await logActivity("Cliente actualizado", `${data.name} (${data.email})`, id);
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;

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
    const escapedName = client.name.replace(/[%_\\]/g, "\\$&");
    await supabase.from("activity_logs").delete().is("client_id", null).ilike("details", `%${escapedName}%`);
  }

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    console.error("Client DELETE error:", error.message);
    return NextResponse.json({ error: "Error al eliminar el cliente" }, { status: 500 });
  }
  await logActivity("Cliente eliminado", `${client?.name ?? "—"} (${client?.email ?? id})`);
  return NextResponse.json({ success: true });
}
