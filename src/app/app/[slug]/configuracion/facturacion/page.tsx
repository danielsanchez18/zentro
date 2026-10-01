import { BillingSettingsModule } from "@/components/app/billing/settings/BillingSettingsModule";

/**
 * Configuración → Facturación (prototipo frontend).
 *
 * Reutiliza el formulario de datos fiscales del módulo Facturación para que la
 * ruta /configuracion/facturacion (usada por el dashboard de suscripciones)
 * no quede huérfana.
 */
export default async function ConfigurationBillingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <BillingSettingsModule slug={slug} />;
}