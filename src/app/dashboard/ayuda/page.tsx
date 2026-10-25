import { AyudaPage } from "@/components/dashboard/ayuda/AyudaPage";
import { hubMetadata } from "@/app/dashboard/metadata";

export const metadata = hubMetadata(
  "Ayuda",
  "Preguntas frecuentes, contacto y tickets de soporte de Zentro.",
);

export default function AyudaPageRoute() {
  return (
    <div className="w-full max-w-350 mx-auto px-2">
      <AyudaPage />
    </div>
  );
}
