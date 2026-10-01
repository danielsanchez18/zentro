import { AddLocationPage } from "@/components/app/configuration/locations/AddLocationPage";

/**
 * Ruta: Configuración → Ubicaciones → Nueva ubicación (/app/:slug/configuracion/ubicaciones/nueva).
 */
export default async function NewLocationRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <AddLocationPage slug={slug} />;
}
