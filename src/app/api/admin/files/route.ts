import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data, error } = await supabase
    .from("files")
    .select("*, clients(name)")
    .order("uploaded_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const clientId = formData.get("client_id") as string;

  if (!file || !clientId) {
    return NextResponse.json({ error: "Archivo y cliente son obligatorios" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const path = `${clientId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("client-files")
    .upload(path, file);

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage
    .from("client-files")
    .getPublicUrl(path);

  const { data, error } = await supabase
    .from("files")
    .insert({
      client_id: clientId,
      file_name: file.name,
      file_url: publicUrl,
      file_type: file.type || ext || "",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
