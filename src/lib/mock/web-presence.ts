/**
 * Constructor Web — sitio web por bloques.
 *
 * Fuente: `.notion/Zentro/04 - Modelo de Dominio/Capacidades/Constructor Web`
 * y `.notion/Zentro/04 - Modelo de Dominio/Capacidades/Blog`.
 *
 * Decisiones que NO son criterio propio sino reglas de la spec:
 *
 * - R1 "Cada organización puede tener un sitio web activo a la vez" → la
 *   entidad se indexa por `organizationId` (no por sucursal): la spec dice
 *   explícitamente que el sitio "no pertenece a una sucursal".
 * - R2 "dominio personalizado o subdominio zentro.app según el plan" →
 *   `DOMAIN_RULE_BY_PLAN`. Notion no dice qué plan da dominio propio; aquí
 *   Esencial → subdominio, Crecimiento → personalizado (supuesto propio,
 *   ver issues.md).
 * - R3 "los cambios se editan en un entorno de desarrollo y se publican
 *   manualmente" → el sitio tiene `lastPublishedAt` y las páginas `updatedAt`.
 *   Lo editado después de `lastPublishedAt` está pendiente de publicar.
 * - R5 "el catálogo y blog se sincronizan automáticamente" → los bloques
 *   `catalogo` y `blog` no guardan datos propios: leen del catálogo y del blog.
 * - R7 "publicar un catálogo no obliga a habilitar carrito, pagos, inventario
 *   ni pedidos" → el sitio no toca `acceptsOrders` del canal "Sitio web"
 *   (ver `channels.ts`). Son dos cosas separadas a propósito.
 * - "No se permite inyección de HTML, CSS o JS personalizado" → `SiteTheme`
 *   es solo tokens de diseño, nunca cadenas de estilo.
 */

import { dashboardPlans, dashboardSubscriptions } from "./dashboard";

/* -------------------------------------------------------------------------- */
/* Objetivos del sitio                                                          */
/* -------------------------------------------------------------------------- */

/**
 * "Puede ser informativo, captar leads, aceptar reservas, vender o combinar
 *  estos objetivos según las capacidades activadas."
 */
export type SiteObjective =
  | "informativo"
  | "captar_leads"
  | "reservas"
  | "vender";

export const SITE_OBJECTIVES: Record<
  SiteObjective,
  { label: string; description: string; icon: string }
> = {
  informativo: {
    label: "Informativo",
    description: "Presentar el negocio y sus servicios.",
    icon: "Info",
  },
  captar_leads: {
    label: "Captar leads",
    description: "Recibir contactos y solicitudes de información.",
    icon: "UserPlus",
  },
  reservas: {
    label: "Reservas",
    description: "Agendar citas directamente desde el sitio.",
    icon: "CalendarCheck",
  },
  vender: {
    label: "Vender",
    description: "Catálogo con carrito y pedidos en línea.",
    icon: "ShoppingCart",
  },
};

/* -------------------------------------------------------------------------- */
/* Bloques                                                                      */
/* -------------------------------------------------------------------------- */

/** "Bloques disponibles" de la spec. Catálogo y Blog se alimentan solos. */
export type BlockType =
  | "encabezado"
  | "hero"
  | "catalogo"
  | "producto"
  | "formulario"
  | "blog"
  | "testimonios"
  | "galeria"
  | "faq"
  | "footer";

interface BlockBase {
  id: string;
  enabled: boolean;
}

export interface HeaderBlock extends BlockBase {
  type: "encabezado";
  config: {
    logoText: string;
    links: { label: string; href: string }[];
    ctaLabel: string;
  };
}

export interface HeroBlock extends BlockBase {
  type: "hero";
  config: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    imageUrl: string;
  };
}

/** R5: los productos vienen del catálogo de Zentro, no se editan aquí. */
export interface CatalogBlock extends BlockBase {
  type: "catalogo";
  config: {
    title: string;
    limit: number;
    categoryIds: string[];
  };
}

/** Bloque de detalle; `productId` referencia el catálogo. */
export interface ProductBlock extends BlockBase {
  type: "producto";
  config: {
    productId: string | null;
    showGallery: boolean;
    showBuyButton: boolean;
  };
}

/** "Formulario de contacto (conectado a Formularios)". */
export interface FormBlock extends BlockBase {
  type: "formulario";
  config: {
    title: string;
    formId: string | null;
  };
}

/** "Blog: lista de artículos" — los artículos se gestionan en el módulo Blog. */
export interface BlogBlock extends BlockBase {
  type: "blog";
  config: {
    title: string;
    limit: number;
  };
}

export interface TestimonialsBlock extends BlockBase {
  type: "testimonios";
  config: { title: string; items: { author: string; quote: string }[] };
}

export interface GalleryBlock extends BlockBase {
  type: "galeria";
  config: { title: string; imageUrls: string[] };
}

export interface FaqBlock extends BlockBase {
  type: "faq";
  config: { title: string; items: { question: string; answer: string }[] };
}

export interface FooterBlock extends BlockBase {
  type: "footer";
  config: {
    address: string;
    phone: string;
    socialLinks: { platform: string; href: string }[];
  };
}

export type SiteBlock =
  | HeaderBlock
  | HeroBlock
  | CatalogBlock
  | ProductBlock
  | FormBlock
  | BlogBlock
  | TestimonialsBlock
  | GalleryBlock
  | FaqBlock
  | FooterBlock;

/** Metadatos de UI: etiqueta, descripción y si el bloque trae datos propios. */
export const BLOCK_DEFS: Record<
  BlockType,
  { label: string; description: string; icon: string; configurable: boolean }
> = {
  encabezado: {
    label: "Encabezado",
    description: "Navegación, logo y llamada a la acción.",
    icon: "PanelTop",
    configurable: true,
  },
  hero: {
    label: "Hero",
    description: "Imagen, título y botón principal.",
    icon: "Image",
    configurable: true,
  },
  catalogo: {
    label: "Catálogo",
    description: "Productos del catálogo de Zentro, automático.",
    icon: "ShoppingBag",
    configurable: true,
  },
  producto: {
    label: "Producto",
    description: "Detalle de un producto con botón de compra.",
    icon: "Package",
    configurable: true,
  },
  formulario: {
    label: "Formulario",
    description: "Formulario de contacto conectado a Formularios.",
    icon: "MessageSquare",
    configurable: true,
  },
  blog: {
    label: "Blog",
    description: "Últimos artículos publicados.",
    icon: "Newspaper",
    configurable: true,
  },
  testimonios: {
    label: "Testimonios",
    description: "Opiniones de clientes.",
    icon: "Quote",
    configurable: true,
  },
  galeria: {
    label: "Galería",
    description: "Imágenes del local o productos.",
    icon: "Images",
    configurable: true,
  },
  faq: {
    label: "FAQ",
    description: "Preguntas frecuentes.",
    icon: "HelpCircle",
    configurable: true,
  },
  footer: {
    label: "Footer",
    description: "Datos de contacto y redes.",
    icon: "PanelBottom",
    configurable: true,
  },
};

/* -------------------------------------------------------------------------- */
/* Tema                                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Solo tokens. La spec prohíbe explícitamente inyectar HTML, CSS o JS propio,
 * así que este tipo no admite cadenas de estilo.
 */
export interface SiteTheme {
  templateKey: TemplateKey;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: FontKey;
  headingScale: "sm" | "md" | "lg";
  spacing: "compacto" | "amplio";
  logoUrl: string | null;
}

export type FontKey = "sans" | "serif" | "redondeada";
export type TemplateKey = "moderna" | "clásica" | "artesanal" | "minimalista";

/** "El diseño se basa en plantillas pre-diseñadas seleccionables desde la UI". */
export const SITE_TEMPLATES: Record<
  TemplateKey,
  { label: string; description: string; theme: SiteTheme }
> = {
  moderna: {
    label: "Moderna",
    description: "Tipografía sans, colores vivos y mucho espacio en blanco.",
    theme: {
      templateKey: "moderna",
      primaryColor: "#1f2937",
      accentColor: "#f97316",
      backgroundColor: "#ffffff",
      fontFamily: "sans",
      headingScale: "lg",
      spacing: "amplio",
      logoUrl: null,
    },
  },
  clásica: {
    label: "Clásica",
    description: "Serif sobrio, tonos cálidos y aire contenido.",
    theme: {
      templateKey: "clásica",
      primaryColor: "#3f2d1f",
      accentColor: "#a16207",
      backgroundColor: "#faf7f2",
      fontFamily: "serif",
      headingScale: "md",
      spacing: "compacto",
      logoUrl: null,
    },
  },
  artesanal: {
    label: "Artesanal",
    description: "Tipografía redondeada y paleta cálida.",
    theme: {
      templateKey: "artesanal",
      primaryColor: "#4a2c1a",
      accentColor: "#c2703a",
      backgroundColor: "#fdf6ee",
      fontFamily: "redondeada",
      headingScale: "md",
      spacing: "amplio",
      logoUrl: null,
    },
  },
  minimalista: {
    label: "Minimalista",
    description: "Poco color, mucho aire, foco en el producto.",
    theme: {
      templateKey: "minimalista",
      primaryColor: "#111827",
      accentColor: "#6b7280",
      backgroundColor: "#ffffff",
      fontFamily: "sans",
      headingScale: "sm",
      spacing: "amplio",
      logoUrl: null,
    },
  },
};

export const FONT_OPTIONS: Record<FontKey, string> = {
  sans: "Sans (system-ui)",
  serif: "Serif (Georgia)",
  redondeada: "Redondeada (Nunito)",
};

/* -------------------------------------------------------------------------- */
/* Dominio (R2)                                                                 */
/* -------------------------------------------------------------------------- */

export type DomainMode = "subdominio" | "personalizado";

/** R2. Notion no especifica qué plan incluye dominio propio: supuesto propio. */
export const DOMAIN_RULE_BY_PLAN: Record<string, DomainMode> = {
  ESSENTIAL: "subdominio",
  GROWTH: "personalizado",
};

export const getPlanKeyByOrganization = (organizationId: string): string => {
  const subscription = dashboardSubscriptions.find(
    (item) => item.organizationId === organizationId,
  );
  const plan = dashboardPlans.find((item) => item.id === subscription?.planId);
  return plan?.key ?? "ESSENTIAL";
};

export const ZENTRO_SUBDOMAIN_SUFFIX = "zentro.app";

/* -------------------------------------------------------------------------- */
/* Páginas                                                                      */
/* -------------------------------------------------------------------------- */

/** "Cada página tiene un slug único por organización" (regla 1 de Blog). */
export interface SitePage {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  isHome: boolean;
  blocks: SiteBlock[];
  seo: { metaTitle: string; metaDescription: string };
  updatedAt: string;
  /** R4 de Blog: un borrador no es visible en el sitio público. */
  status: "borrador" | "publicado";
  publishedAt: string | null;
}

/* -------------------------------------------------------------------------- */
/* Sitio                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * R1: "Cada organización puede tener un sitio web activo a la vez" → la entidad
 * está indexada por organización, nunca por sucursal.
 */
export interface WebSite {
  organizationId: string;
  objectives: SiteObjective[];
  domainMode: DomainMode;
  subdomain: string;
  customDomain: string | null;
  theme: SiteTheme;
  /** R3: todo lo editado después de esta fecha está sin publicar. */
  lastPublishedAt: string | null;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Semilla                                                                      */
/* -------------------------------------------------------------------------- */

const block = (
  id: string,
  value: Omit<SiteBlock, "id" | "enabled">,
): SiteBlock => ({ id, enabled: true, ...value }) as SiteBlock;

export const seedWebSites: WebSite[] = [
  {
    organizationId: "org_001",
    objectives: ["informativo", "vender"],
    domainMode: "subdominio",
    subdomain: "las-rocas",
    customDomain: null,
    theme: { ...SITE_TEMPLATES.moderna.theme },
    lastPublishedAt: "2026-08-28T10:00:00.000Z",
    createdAt: "2026-08-10T09:00:00.000Z",
  },
  {
    organizationId: "org_002",
    objectives: ["informativo", "reservas"],
    domainMode: "personalizado",
    subdomain: "cafe-del-valle",
    customDomain: "cafedelvalle.pe",
    theme: { ...SITE_TEMPLATES.clásica.theme },
    lastPublishedAt: "2026-09-10T08:30:00.000Z",
    createdAt: "2026-07-22T14:00:00.000Z",
  },
  {
    organizationId: "org_003",
    objectives: ["informativo", "captar_leads"],
    domainMode: "subdominio",
    subdomain: "fonda-la-abuela",
    customDomain: null,
    theme: { ...SITE_TEMPLATES.artesanal.theme },
    lastPublishedAt: null,
    createdAt: "2026-09-05T11:00:00.000Z",
  },
];

export const seedSitePages: SitePage[] = [
  {
    id: "page_001",
    organizationId: "org_001",
    name: "Portada",
    slug: "/",
    isHome: true,
    blocks: [
      block("blk_001", {
        type: "encabezado",
        config: {
          logoText: "Las Rocas",
          links: [
            { label: "Carta", href: "/carta" },
            { label: "Tienda", href: "/tienda" },
            { label: "Nosotros", href: "/nosotros" },
          ],
          ctaLabel: "Reservar mesa",
        },
      }),
      block("blk_002", {
        type: "hero",
        config: {
          title: "Cocina de autor en el corazón de Miraflores",
          subtitle:
            "Cafetería y restaurante con productos de temporada y carta corta.",
          ctaLabel: "Ver carta",
          imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
        },
      }),
      block("blk_003", {
        type: "catalogo",
        config: { title: "Nuestra carta", limit: 8, categoryIds: [] },
      }),
      block("blk_004", {
        type: "footer",
        config: {
          address: "Av. José Larco 1234, Miraflores, Lima",
          phone: "+51 999 111 222",
          socialLinks: [
            { platform: "instagram", href: "https://instagram.com/lasrocas" },
            { platform: "facebook", href: "https://facebook.com/lasrocas" },
          ],
        },
      }),
    ],
    seo: {
      metaTitle: "Las Rocas — Cocina de autor en Miraflores",
      metaDescription:
        "Cafetería y restaurante en Miraflores. Carta de temporada, repostería propia y reservas online.",
    },
    updatedAt: "2026-08-28T10:00:00.000Z",
    status: "publicado",
    publishedAt: "2026-08-28T10:00:00.000Z",
  },
  {
    id: "page_002",
    organizationId: "org_001",
    name: "Nosotros",
    slug: "/nosotros",
    isHome: false,
    blocks: [
      block("blk_005", {
        type: "hero",
        config: {
          title: "Desde 2018 en Miraflores",
          subtitle: "Un equipo pequeño con producto de temporada.",
          ctaLabel: "Reservar",
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        },
      }),
      block("blk_006", {
        type: "testimonios",
        config: {
          title: "Lo que dicen",
          items: [
            {
              author: "Camila R.",
              quote: "El mejor lomo saltado de la zona, sin discusión.",
            },
            {
              author: "Andrés P.",
              quote: "Llevamos tres cumpleaños aquí. Nunca fallan.",
            },
          ],
        },
      }),
      block("blk_007", {
        type: "faq",
        config: {
          title: "Preguntas frecuentes",
          items: [
            {
              question: "¿Aceptan reservas?",
              answer: "Sí, por el sitio y también por teléfono.",
            },
            {
              question: "¿Tienen opciones vegetarianas?",
              answer: "Tres platos de la carta y una opción de postre.",
            },
          ],
        },
      }),
    ],
    seo: {
      metaTitle: "Nosotros — Las Rocas",
      metaDescription: "Conoce el equipo y la cocina de Las Rocas.",
    },
    updatedAt: "2026-08-20T16:00:00.000Z",
    status: "publicado",
    publishedAt: "2026-08-28T10:00:00.000Z",
  },
  {
    id: "page_003",
    organizationId: "org_001",
    name: "Contacto",
    slug: "/contacto",
    isHome: false,
    blocks: [
      block("blk_008", {
        type: "formulario",
        config: { title: "Escríbenos", formId: "form_001" },
      }),
    ],
    seo: { metaTitle: "Contacto — Las Rocas", metaDescription: "Datos y formulario." },
    // R3: editado después de la última publicación → pendiente de publicar.
    updatedAt: "2026-09-26T11:20:00.000Z",
    status: "publicado",
    publishedAt: "2026-08-28T10:00:00.000Z",
  },
  {
    id: "page_004",
    organizationId: "org_002",
    name: "Portada",
    slug: "/",
    isHome: true,
    blocks: [
      block("blk_009", {
        type: "encabezado",
        config: {
          logoText: "Café del Valle",
          links: [{ label: "Menú", href: "/menu" }],
          ctaLabel: "Reservar mesa",
        },
      }),
      block("blk_010", {
        type: "hero",
        config: {
          title: "Café de especialidad en Barranco",
          subtitle: "Tueste propio, repostería diaria y wifi.",
          ctaLabel: "Ver menú",
          imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e",
        },
      }),
      block("blk_011", {
        type: "galeria",
        config: {
          title: "El local",
          imageUrls: [
            "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
            "https://images.unsplash.com/photo-1559496417-e7f25cb247f3",
          ],
        },
      }),
    ],
    seo: {
      metaTitle: "Café del Valle — Cafetería en Barranco",
      metaDescription: "Café de especialidad y repostería en Barranco.",
    },
    updatedAt: "2026-09-10T08:30:00.000Z",
    status: "publicado",
    publishedAt: "2026-09-10T08:30:00.000Z",
  },
  {
    id: "page_005",
    organizationId: "org_003",
    name: "Portada",
    slug: "/",
    isHome: true,
    blocks: [
      block("blk_012", {
        type: "hero",
        config: {
          title: "Cocina criolla desde 1974",
          subtitle: "Recetas de la familia, horno de barro y repeladas.",
          ctaLabel: "Ver carta",
          imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
        },
      }),
      block("blk_013", {
        type: "blog",
        config: { title: "Del cuaderno de la abuela", limit: 3 },
      }),
    ],
    seo: {
      metaTitle: "Fonda La Abuela — Cocina criolla",
      metaDescription: "Cocina criolla en el centro de Lima.",
    },
    // Borrador puro: nunca publicado.
    updatedAt: "2026-09-20T10:00:00.000Z",
    status: "borrador",
    publishedAt: null,
  },
];

/** Slug único por organización (regla 1 de Blog / de páginas). */
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** R2: la URL pública se deriva del modo de dominio. */
export const publicUrlFor = (site: WebSite): string =>
  site.domainMode === "personalizado" && site.customDomain
    ? `https://${site.customDomain}`
    : `https://${site.subdomain}.${ZENTRO_SUBDOMAIN_SUFFIX}`;