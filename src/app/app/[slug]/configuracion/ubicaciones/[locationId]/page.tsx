import { EditLocationPage } from "@/components/app/configuration/locations/EditLocationPage";

/**
 * Ruta: Configuración → Ubicaciones → Editar ubicación (/app/:slug/configuracion/ubicaciones/:locationId).
 */
export default async function EditLocationRoute({
  params,
}: {
  params: Promise<{ slug: string; locationId: string }>;
}) {
  const { slug, locationId } = await params;

  return <EditLocationPage slug={slug} locationId={locationId} />;
}
