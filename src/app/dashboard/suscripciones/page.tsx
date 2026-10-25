import { SubscriptionsPage } from "@/components/dashboard/suscripciones/SubscriptionsPage";
import { hubMetadata } from "@/app/dashboard/metadata";

export const metadata = hubMetadata(
  "Suscripciones",
  "Planes, uso y facturas de tus organizaciones.",
);

export default function SuscripcionesPage() {
  return (
    <div className="w-full max-w-350 mx-auto px-2">
      <SubscriptionsPage />
    </div>
  );
}
