import { ConfigurationModule } from "@/components/app/configuration";

/**
 * Centro de configuración (prototipo frontend).
 *
 * Hub con las secciones de configuración del workspace. Los datos de las
 * secciones viven en stores locales (locations-store, billing-store, etc.);
 * al conectar la API solo cambia el origen de cada store.
 */
export default async function ConfigurationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ConfigurationModule slug={slug} />;
}