import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sanitizeField } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventName = sanitizeField(body.eventName, 80);
    const stage = sanitizeField(body.stage, 80);
    const planType = sanitizeField(body.planType, 40);
    const locale = sanitizeField(body.locale, 10);
    const clientId = sanitizeField(body.clientId, 100);
    const email = sanitizeField(body.email, 160);

    if (!eventName) {
      return NextResponse.json({ error: "eventName requerido" }, { status: 400 });
    }

    const supabase = await createServiceClient();
    await supabase.from("activity_logs").insert({
      client_id: clientId || null,
      action: "Funnel event",
      details: `event:${eventName};stage:${stage || ""};plan:${planType || ""};locale:${locale || ""};email:${email || ""}`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Funnel event error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "No se pudo guardar evento" }, { status: 500 });
  }
}

