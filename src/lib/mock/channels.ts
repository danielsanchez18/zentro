import type { LucideIcon } from "lucide-react";
import {
  Globe,
  MessageCircle,
  Music2,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";

/**
 * Modelo de Canales de venta (decisión de producto, Roadmap 22 · Fase 7).
 *
 * Distingue dos cosas que hasta ahora venían mezcladas en tres unions sueltas
 * (`OrderChannel`, `CustomerChannel`, `FormChannel`):
 *
 * 1. **Canales propios (`kind: "native"`)**: el pedido nace dentro de Zentro
 *    (POS, sitio web, Marketplace Zentro). Zentro es la fuente de verdad y el
 *    canal se activa o desactiva.
 * 2. **Integraciones externas (`kind: "external"`)**: el pedido nace afuera
 *    (WhatsApp, TikTok, Instagram, Shopify, Mercado Libre). Zentro se conecta,
 *    sincroniza y consume; por eso tienen *estado de conexión* y no un toggle.
 *
 * En el prototipo las integraciones están catalogadas pero **no conectables**:
 * el modelo ya tiene la forma que-usarán para no tener que rediseñar la entidad
 * cuando lleguen (ver `docs/frontend/modules/channels/issues.md`).
 */

export type ChannelKind = "native" | "external";

/**
 * Claves históricas usadas por los mocks antes de existir esta entidad.
 * Se conservan para resolver el canal equivalente sin romper los módulos que
 * ya las usan (Orders, CRM, Formularios, Reportes).
 */
export type LegacyChannelKey =
  | "pos"
  | "web"
  | "marketplace"
  | "whatsapp"
  | "manual"
  | "enlace"
  | "interno";

/** Canales propios que Zentro puede operar. */
export type NativeChannelKey = "pos" | "web" | "marketplace";

/** Plataformas externas previstas. Aún no hay conector. */
export type ExternalPlatformKey =
  | "whatsapp"
  | "tiktok"
  | "instagram"
  | "shopify"
  | "mercadolibre";

/** Estado de una integración externa (no aplica a canales propios). */
export type IntegrationStatus =
  | "no_disponible" // la plataforma existe en el catálogo, sin conector
  | "desconectado"
  | "conectando"
  | "conectado"
  | "error";

export interface IntegrationConnection {
  platform: ExternalPlatformKey;
  status: IntegrationStatus;
  /** Cuenta o tienda conectada en la plataforma externa. */
  externalAccount?: string | null;
  /** Capacidades que la integración puede sincronizar. */
  capabilities: IntegrationCapability[];
  lastSyncAt?: string | null;
  lastError?: string | null;
}

export type IntegrationCapability =
  | "productos"
  | "pedidos"
  | "pagos"
  | "inventario"
  | "clientes";

export interface IntegrationDef {
  key: ExternalPlatformKey;
  label: string;
  description: string;
  capabilities: IntegrationCapability[];
  icon: LucideIcon;
  /** `false` mientras no exista conector; la tarjeta se muestra deshabilitada. */
  available: boolean;
}

export interface SalesChannel {
  id: string;
  organizationId: string;
  kind: ChannelKind;
  /** Clave estable del canal (`pos`, `web`, `marketplace` o plataforma). */
  key: NativeChannelKey | ExternalPlatformKey;
  name: string;
  description?: string;
  status: "activo" | "inactivo";
  /** Solo propios: si admite pedidos entrantes. */
  acceptsOrders?: boolean;
  /** Solo externas: estado de la conexión. */
  integration?: IntegrationConnection;
  /** Claves legacy que este canal absorbe (compatibilidad con mocks previos). */
  legacyKeys: LegacyChannelKey[];
}

/* ------------------------------------------------------------------ */
/* Catálogo de integraciones externas                                  */
/* ------------------------------------------------------------------ */

export const INTEGRATION_CATALOG: IntegrationDef[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    description: "Pedidos y consultas que llegan desde tu número de atención.",
    capabilities: ["pedidos", "clientes"],
    icon: MessageCircle,
    available: false,
  },
  {
    key: "tiktok",
    label: "TikTok",
    description: "Pedidos desde tu tienda dentro de TikTok Shop.",
    capabilities: ["productos", "pedidos", "inventario"],
    icon: Music2,
    available: false,
  },
  {
    key: "instagram",
    label: "Instagram",
    description: "Pedidos desde mensajes y la tienda de Instagram.",
    capabilities: ["productos", "pedidos", "clientes"],
    icon: MessageCircle,
    available: false,
  },
  {
    key: "shopify",
    label: "Shopify",
    description: "Sincroniza catálogo, pedidos y pagos de tu tienda Shopify.",
    capabilities: ["productos", "pedidos", "pagos", "inventario"],
    icon: ShoppingBag,
    available: false,
  },
  {
    key: "mercadolibre",
    label: "Mercado Libre",
    description: "Pedidos y publicaciones de tu tienda en Mercado Libre.",
    capabilities: ["productos", "pedidos", "pagos"],
    icon: Store,
    available: false,
  },
];

export const findIntegration = (key: ExternalPlatformKey) =>
  INTEGRATION_CATALOG.find((i) => i.key === key);

export const integrationIcon = (key: ExternalPlatformKey): LucideIcon =>
  findIntegration(key)?.icon ?? Globe;

/** Etiquetas de capacidad, para mostrar qué sincroniza cada integración. */
export const INTEGRATION_CAPABILITY_LABELS: Record<IntegrationCapability, string> = {
  productos: "Productos",
  pedidos: "Pedidos",
  pagos: "Pagos",
  inventario: "Inventario",
  clientes: "Clientes",
};

/** Etiquetas de estado de conexión. */
export const INTEGRATION_STATUS_LABELS: Record<IntegrationStatus, string> = {
  no_disponible: "Próximamente",
  desconectado: "Desconectado",
  conectando: "Conectando",
  conectado: "Conectado",
  error: "Con error",
};

/* ------------------------------------------------------------------ */
/* Canales propios                                                     */
/* ------------------------------------------------------------------ */

export interface NativeChannelDef {
  key: NativeChannelKey;
  label: string;
  description: string;
  legacyKeys: LegacyChannelKey[];
  icon: LucideIcon;
}

export const NATIVE_CHANNELS: NativeChannelDef[] = [
  {
    key: "pos",
    label: "Punto de venta",
    description: "Ventas en el mostrador de cada ubicación.",
    legacyKeys: ["pos"],
    icon: Store,
  },
  {
    key: "web",
    label: "Sitio web",
    description: "Pedidos desde tu web propia.",
    legacyKeys: ["web"],
    icon: Globe,
  },
  {
    key: "marketplace",
    label: "Marketplace Zentro",
    description: "Tu tienda dentro del marketplace de Zentro.",
    legacyKeys: ["marketplace"],
    icon: ShoppingBag,
  },
];

/* ------------------------------------------------------------------ */
/* Resolución de claves legacy                                         */
/* ------------------------------------------------------------------ */

/**
 * Traduce una clave legacy al canal que la representa. `null` cuando la clave
 * no corresponde a un canal de venta real (p. ej. `enlace` e `interno` de
 * Formularios, que son orígenes de captación y no canales).
 */
export const nativeChannelByLegacyKey = (
  key: LegacyChannelKey,
): NativeChannelDef | undefined =>
  NATIVE_CHANNELS.find((channel) => channel.legacyKeys.includes(key));

/* ------------------------------------------------------------------ */
/* Semilla mock                                                        */
/* ------------------------------------------------------------------ */

const nativeChannel = (
  id: string,
  organizationId: string,
  key: NativeChannelKey,
  status: "activo" | "inactivo",
  overrides: Partial<SalesChannel> = {},
): SalesChannel => {
  const def = NATIVE_CHANNELS.find((c) => c.key === key)!;
  return {
    id,
    organizationId,
    kind: "native",
    key,
    name: def.label,
    description: def.description,
    status,
    acceptsOrders: status === "activo",
    legacyKeys: def.legacyKeys,
    ...overrides,
  };
};

/**
 * Semilla: canales propios por organización. Las integraciones externas no se
 * siembran —viven en `INTEGRATION_CATALOG` hasta que exista conector.
 */
export const seedSalesChannels: SalesChannel[] = [
  nativeChannel("ch_001", "org_001", "pos", "activo"),
  nativeChannel("ch_002", "org_001", "web", "activo"),
  nativeChannel("ch_003", "org_001", "marketplace", "inactivo"),
  nativeChannel("ch_004", "org_002", "pos", "activo"),
  nativeChannel("ch_005", "org_002", "web", "activo"),
  nativeChannel("ch_006", "org_002", "marketplace", "activo"),
  nativeChannel("ch_007", "org_003", "pos", "activo"),
  nativeChannel("ch_008", "org_003", "web", "activo"),
];