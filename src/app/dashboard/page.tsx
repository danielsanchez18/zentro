import { Overview } from "@/components/dashboard/overview/Overview";
import { hubMetadata } from "@/app/dashboard/metadata";

export const metadata = hubMetadata(
  "Inicio",
  "Tu espacio personal en Zentro: organizaciones, primeros pasos, invitaciones y suscripciones.",
);

export default function DashboardPage() {
  return (
    <div className="w-full max-w-350 mx-auto px-2">
      <Overview />
    </div>
  );
}
