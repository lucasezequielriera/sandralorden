import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/check-role";

export async function GET() {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { data, error } = await supabase
    .from("files")
    .select("*, clients(name)")
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Files GET error:", error.message);
    return NextResponse.json({ error: "Error al obtener archivos" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const clientId = formData.get("client_id") as string;

  if (!file || !clientId) {
    return NextResponse.json({ error: "Archivo y cliente son obligatorios" }, { status: 400 });
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(clientId)) {
    return NextResponse.json({ error: "ID de cliente no válido" }, { status: 400 });
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = new Set([
    "application/pdf",
    "image/jpeg", "image/png", "image/webp",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
  ]);

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "El archivo excede el límite de 10 MB" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const path = `${clientId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("client-files")
    .upload(path, file);

  if (uploadError) {
    console.error("File upload error:", uploadError.message);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from("client-files")
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  const fileUrl = signedData?.signedUrl;
  if (signedError || !fileUrl) {
    console.error("Signed URL error:", signedError?.message);
    return NextResponse.json({ error: "Error al generar URL del archivo" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("files")
    .insert({
      client_id: clientId,
      file_name: file.name,
      file_url: fileUrl,
      file_type: file.type || ext || "",
    })
    .select()
    .single();

  if (error) {
    console.error("File DB insert error:", error.message);
    return NextResponse.json({ error: "Error al registrar el archivo" }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
