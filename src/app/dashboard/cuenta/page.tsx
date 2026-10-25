import { CuentaPage } from "@/components/dashboard/cuenta/CuentaPage";
import { hubMetadata } from "@/app/dashboard/metadata";

export const metadata = hubMetadata(
  "Mi cuenta",
  "Perfil, seguridad, dispositivos y notificaciones de tu cuenta.",
);

export default function CuentaPageRoute() {
  return (
    <div className="w-full max-w-350 mx-auto px-2">
      <CuentaPage />
    </div>
  )
}
