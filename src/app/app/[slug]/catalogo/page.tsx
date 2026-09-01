import { CatalogModule } from "@/components/app/catalog/overview/CatalogModule";

/**
 * Módulo Catálogo (mockup de flujo).
 *
 * Los componentes reciben los datos desde aquí: mientras no exista la API,
 * `catalogProducts` (mock) hace de fuente de datos.
 */
export default async function CatalogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CatalogModule slug={slug} />;
}
