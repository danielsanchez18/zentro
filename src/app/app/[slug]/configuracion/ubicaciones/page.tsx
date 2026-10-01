import { LocationsModule } from "@/components/app/configuration/locations/LocationsModule";

/**
 * Configuración → Ubicaciones (prototipo frontend).
 *
 * CRUD de la entidad "Ubicación" (decisión 09/2026): entidad flexible con
 * funciones "¿Qué sucede aquí?" y ficha pública opcional. Vive en
 * `locations-store` (mock); al conectar la API solo cambia el origen.
 */
export default async function LocationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <LocationsModule slug={slug} />;
}