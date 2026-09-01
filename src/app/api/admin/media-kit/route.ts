import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/check-role";
import { createServiceClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/log-activity";
import { mergeMediaKitSettings, type MediaKitSettings } from "@/lib/media-kit-settings";

function migrationHint(errorMessage: string): string | undefined {
  if (
    errorMessage.includes("media_kit_settings") ||
    errorMessage.includes("schema cache") ||
    errorMessage.includes("does not exist")
  ) {
    return "La tabla media_kit_settings no existe. Ejecuta: npm run db:migrate-media-kit (tras configurar SUPABASE_DB_URL en .env.local) o pega el SQL de supabase/migrations/20260301_media_kit_settings.sql en el SQL Editor de Supabase.";
  }
  return undefined;
}

export async function GET() {
  const { authorized, rateLimited } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("media_kit_settings")
    .select("data, updated_at")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    console.error("Media kit GET error:", error.message);
    const hint = migrationHint(error.message);
    return NextResponse.json(
      { error: "Error al cargar el media kit", hint },
      { status: 500 }
    );
  }

  const settings = mergeMediaKitSettings(data?.data as Partial<MediaKitSettings> | null);
  return NextResponse.json({ settings, updated_at: data?.updated_at ?? null });
}

export async function PATCH(request: NextRequest) {
  const { authorized, rateLimited } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const body = await request.json();
  const incoming = body.settings as Partial<MediaKitSettings> | undefined;

  if (!incoming || typeof incoming !== "object") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const merged = mergeMediaKitSettings(incoming);
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("media_kit_settings")
    .upsert({
      id: "default",
      data: merged,
      updated_at: new Date().toISOString(),
    })
    .select("data, updated_at")
    .single();

  if (error) {
    console.error("Media kit PATCH error:", error.message);
    const hint = migrationHint(error.message);
    return NextResponse.json(
      { error: "Error al guardar el media kit", hint },
      { status: 500 }
    );
  }

  await logActivity("Media kit actualizado", "Configuración del media kit guardada");
  return NextResponse.json({
    settings: mergeMediaKitSettings(data.data as Partial<MediaKitSettings>),
    updated_at: data.updated_at,
  });
}
