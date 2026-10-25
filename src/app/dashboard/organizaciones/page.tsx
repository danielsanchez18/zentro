import { OrganizationsPage } from "@/components/dashboard/organizaciones/OrganizationsPage";
import { hubMetadata } from "@/app/dashboard/metadata";

export const metadata = hubMetadata(
  "Organizaciones",
  "Entra a tus organizaciones, continúa su configuración o crea una nueva.",
);

export default function OrganizacionesPage() {
  return (
    <div className="w-full max-w-350 mx-auto px-2">
      <OrganizationsPage />
    </div>
  );
}
