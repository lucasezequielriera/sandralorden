import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/check-role";
import { createServiceClient } from "@/lib/supabase/server";
import { resolveClientRecoveryActionLink } from "@/lib/supabase/resolve-client-recovery-link";
import { getClientLoginRedirectUrl } from "@/lib/app-base-url";
import {
  buildPremiumAccessEmailHtml,
  buildPremiumAccessEmailText,
} from "@/lib/email-access-link";
import { sendEmail } from "@/lib/email";
import { logActivity } from "@/lib/supabase/log-activity";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, rateLimited, supabase } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (rateLimited) return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });

  const { id } = await params;

  const { data: client, error } = await supabase
    .from("clients")
    .select("id, name, email")
    .eq("id", id)
    .single();

  if (error || !client?.email?.trim()) {
    return NextResponse.json({ error: "Cliente no encontrado o sin email" }, { status: 404 });
  }

  const email = client.email.trim();
  const name = (client.name || "Cliente").trim() || "Cliente";
  const redirectTo = getClientLoginRedirectUrl(request);

  const service = await createServiceClient();
  const actionLink = await resolveClientRecoveryActionLink(service, {
    email,
    name,
    redirectTo,
  });

  if (!actionLink) {
    console.error("Resend access email: sin action_link de Supabase para", email);
    return NextResponse.json(
      { error: "No se pudo generar el enlace de acceso. Revisa Supabase." },
      { status: 500 }
    );
  }

  try {
    await sendEmail({
      to: email,
      subject: "Enlace para crear tu contraseña — Sandra Lorden",
      html: buildPremiumAccessEmailHtml(name, actionLink, "resend"),
      text: buildPremiumAccessEmailText(name, actionLink, "resend"),
    });
  } catch (mailErr) {
    console.error(
      "Resend access email: fallo SMTP:",
      mailErr instanceof Error ? mailErr.message : "unknown"
    );
    return NextResponse.json(
      { error: "No se pudo enviar el correo. Revisa SMTP/Brevo e inténtalo de nuevo." },
      { status: 500 }
    );
  }

  await logActivity("Cliente: reenvío email de acceso", `email:${email}`, id);
  return NextResponse.json({ ok: true });
}
