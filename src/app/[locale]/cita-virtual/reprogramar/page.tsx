import type { Metadata } from "next";
import { Suspense } from "react";
import VirtualAppointmentRescheduleClient from "@/components/VirtualAppointmentRescheduleClient";

export const metadata: Metadata = {
  title: "Reprogramar cita virtual",
  robots: { index: false, follow: false },
};

function RescheduleFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <p className="text-warm-gray-500 text-sm">…</p>
    </div>
  );
}

export default function ReprogramarCitaVirtualPage() {
  return (
    <Suspense fallback={<RescheduleFallback />}>
      <VirtualAppointmentRescheduleClient />
    </Suspense>
  );
}
