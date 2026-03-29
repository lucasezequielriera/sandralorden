import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import VirtualAppointmentBooking, {
  type VirtualPrefilled,
} from "@/components/VirtualAppointmentBooking";

export default async function CitaVirtualPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let prefilled: VirtualPrefilled = null;
  if (user?.email) {
    const { data: client } = await supabase
      .from("clients")
      .select("id, name, email, phone")
      .eq("email", user.email)
      .maybeSingle();
    if (client) {
      prefilled = {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
      };
    }
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-crema py-16 text-center text-sm text-warm-gray-400">Cargando…</div>
      }
    >
      <VirtualAppointmentBooking prefilled={prefilled} />
    </Suspense>
  );
}
