import { ChannelsModule } from "@/components/app/channels/ChannelsModule";

/**
 * Canales de venta (Roadmap 22 · Fase 7).
 *
 * Entidad propia que unifica los "canales" que estaban dispersos en tres unions
 * distintas (`OrderChannel`, `CustomerChannel`, `FormChannel`) y distingue:
 * - canales propios (POS, sitio web, Marketplace Zentro): el pedido nace en Zentro;
 * - integraciones externas (WhatsApp, TikTok, Instagram, Shopify, Mercado Libre):
 *   el pedido nace afuera y Zentro se conecta más adelante.
 */
export default async function ChannelsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ChannelsModule slug={slug} />;
}