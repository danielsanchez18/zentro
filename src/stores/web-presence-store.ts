import { create } from "zustand";
import {
  DOMAIN_RULE_BY_PLAN,
  SITE_TEMPLATES,
  getPlanKeyByOrganization,
  seedSitePages,
  seedWebSites,
  slugify,
  type BlockType,
  type SiteObjective,
  type SitePage,
  type SiteTheme,
  type WebSite,
} from "@/lib/mock/web-presence";

/**
 * Constructor Web — store.
 *
 * R3 ("los cambios se editan en un entorno de desarrollo y se publican
 * manualmente") es la razón de que `publish` sea una acción explícita y separada
 * de `touch`: editar una página nunca cambia lo que ve el visitante hasta que
 * alguien publica.
 */
interface WebPresenceStore {
  sites: WebSite[];
  pages: SitePage[];

  // --- Sitio ---
  createSite: (organizationId: string) => void;
  updateTheme: (organizationId: string, theme: Partial<SiteTheme>) => void;
  applyTemplate: (organizationId: string, templateKey: SiteTheme["templateKey"]) => void;
  setObjectives: (organizationId: string, objectives: SiteObjective[]) => void;
  /** R2: cambia el modo de dominio respetando lo que el plan permite. */
  setDomainMode: (
    organizationId: string,
    mode: WebSite["domainMode"],
  ) => void;
  setCustomDomain: (organizationId: string, domain: string | null) => void;
  setSubdomain: (organizationId: string, subdomain: string) => void;

  // --- Páginas ---
  addPage: (organizationId: string, name: string) => void;
  updatePage: (
    pageId: string,
    patch: Partial<Pick<SitePage, "name" | "slug" | "seo">>,
  ) => void;
  removePage: (pageId: string) => void;

  // --- Bloques ---
  addBlock: (pageId: string, type: BlockType) => void;
  updateBlockConfig: (pageId: string, blockId: string, config: unknown) => void;
  removeBlock: (pageId: string, blockId: string) => void;
  /** Sin drag & drop en el prototipo: reordenar con ↑/↓. */
  moveBlock: (pageId: string, blockId: string, direction: "up" | "down") => void;
  toggleBlock: (pageId: string, blockId: string) => void;

  // --- Publicación (R3) ---
  publish: (organizationId: string) => void;

  // --- Selectores ---
  siteByOrganization: (organizationId: string) => WebSite | undefined;
  /**
   * R2: el plan de la organización decide si puede usar dominio propio.
   *
   * Nota: a propósito NO se exponen selectores que devuelvan arrays derivados
   * (`pagesByOrganization`, `pendingPages`). Una función tiene identidad
   * estable, así que un `useMemo` que dependa de ella nunca vuelve a correr y
   * la vista queda desactualizada tras editar o publicar. Los componentes se
   * suscriben a `sites`/`pages` y derivan ellos mismos.
   */
  allowedDomainMode: (organizationId: string) => WebSite["domainMode"];
}

const now = () => new Date().toISOString();

const withSite = (
  sites: WebSite[],
  organizationId: string,
  fn: (site: WebSite) => WebSite,
) =>
  sites.map((site) =>
    site.organizationId === organizationId ? fn(site) : site,
  );

const withPage = (
  pages: SitePage[],
  pageId: string,
  fn: (page: SitePage) => SitePage,
) =>
  pages.map((page) => (page.id === pageId ? fn(page) : page));

/** Bloque nuevo con la configuración por defecto según su tipo. */
export const defaultBlockConfig = (type: BlockType) => {
  switch (type) {
    case "encabezado":
      return {
        logoText: "Mi negocio",
        links: [{ label: "Inicio", href: "/" }],
        ctaLabel: "Contactar",
      };
    case "hero":
      return {
        title: "Tu titular aquí",
        subtitle: "Describe en una línea qué ofreces.",
        ctaLabel: "Ver más",
        imageUrl: "",
      };
    case "catalogo":
      return { title: "Nuestros productos", limit: 8, categoryIds: [] };
    case "producto":
      return { productId: null, showGallery: true, showBuyButton: true };
    case "formulario":
      return { title: "Contáctanos", formId: null };
    case "blog":
      return { title: "Últimos artículos", limit: 3 };
    case "testimonios":
      return { title: "Testimonios", items: [] };
    case "galeria":
      return { title: "Galería", imageUrls: [] };
    case "faq":
      return { title: "Preguntas frecuentes", items: [] };
    case "footer":
      return {
        address: "",
        phone: "",
        socialLinks: [],
      };
  }
};

export const useWebPresenceStore = create<WebPresenceStore>((set, get) => ({
  sites: [...seedWebSites],
  pages: [...seedSitePages],

  createSite: (organizationId) =>
    set((state) => {
      // R1: una sola web por organización.
      if (state.sites.some((site) => site.organizationId === organizationId)) {
        return state;
      }
      const subdomain = organizationId.replace(/^org_/, "mi-negocio");
      return {
        sites: [
          ...state.sites,
          {
            organizationId,
            objectives: ["informativo"],
            domainMode: get().allowedDomainMode(organizationId),
            subdomain,
            customDomain: null,
            theme: { ...SITE_TEMPLATES.moderna.theme },
            lastPublishedAt: null,
            createdAt: now(),
          },
        ],
      };
    }),

  updateTheme: (organizationId, theme) =>
    set((state) => ({
      sites: withSite(state.sites, organizationId, (site) => ({
        ...site,
        theme: { ...site.theme, ...theme },
      })),
    })),

  applyTemplate: (organizationId, templateKey) =>
    set((state) => ({
      sites: withSite(state.sites, organizationId, (site) => ({
        ...site,
        // Se conserva el logo que el negocio ya haya subido.
        theme: {
          ...SITE_TEMPLATES[templateKey].theme,
          logoUrl: site.theme.logoUrl,
        },
      })),
    })),

  setObjectives: (organizationId, objectives) =>
    set((state) => ({
      sites: withSite(state.sites, organizationId, (site) => ({
        ...site,
        objectives,
      })),
    })),

  setDomainMode: (organizationId, mode) =>
    set((state) => ({
      sites: withSite(state.sites, organizationId, (site) => ({
        ...site,
        // Al volver a subdominio se descarta el dominio propio: si no queda
        // guardado, la URL pública mentiría.
        customDomain: mode === "subdominio" ? null : site.customDomain,
        domainMode: mode,
      })),
    })),

  setCustomDomain: (organizationId, domain) =>
    set((state) => ({
      sites: withSite(state.sites, organizationId, (site) => ({
        ...site,
        customDomain: domain,
      })),
    })),

  setSubdomain: (organizationId, subdomain) =>
    set((state) => ({
      sites: withSite(state.sites, organizationId, (site) => ({
        ...site,
        subdomain: slugify(subdomain),
      })),
    })),

  addPage: (organizationId, name) =>
    set((state) => {
      const base = slugify(name) || "pagina";
      // Slug único por organización.
      const taken = new Set(
        state.pages
          .filter((page) => page.organizationId === organizationId)
          .map((page) => page.slug),
      );
      let slug = `/${base}`;
      let counter = 2;
      while (taken.has(slug)) slug = `/${base}-${counter++}`;

      return {
        pages: [
          ...state.pages,
          {
            id: `page_${Date.now()}`,
            organizationId,
            name,
            slug,
            isHome: false,
            blocks: [],
            seo: { metaTitle: name, metaDescription: "" },
            updatedAt: now(),
            status: "borrador",
            publishedAt: null,
          },
        ],
      };
    }),

  updatePage: (pageId, patch) =>
    set((state) => ({
      pages: withPage(state.pages, pageId, (page) => ({
        ...page,
        ...patch,
        updatedAt: now(),
      })),
    })),

  removePage: (pageId) =>
    set((state) => ({
      pages: state.pages.filter((page) => page.id !== pageId),
    })),

  addBlock: (pageId, type) =>
    set((state) => ({
      pages: withPage(state.pages, pageId, (page) => ({
        ...page,
        blocks: [
          ...page.blocks,
          {
            id: `blk_${Date.now()}_${page.blocks.length}`,
            type,
            enabled: true,
            config: defaultBlockConfig(type),
          } as SitePage["blocks"][number],
        ],
        updatedAt: now(),
      })),
    })),

  updateBlockConfig: (pageId, blockId, config) =>
    set((state) => ({
      pages: withPage(state.pages, pageId, (page) => ({
        ...page,
        blocks: page.blocks.map((block) =>
          block.id === blockId
            ? ({ ...block, config } as SitePage["blocks"][number])
            : block,
        ),
        updatedAt: now(),
      })),
    })),

  removeBlock: (pageId, blockId) =>
    set((state) => ({
      pages: withPage(state.pages, pageId, (page) => ({
        ...page,
        blocks: page.blocks.filter((block) => block.id !== blockId),
        updatedAt: now(),
      })),
    })),

  moveBlock: (pageId, blockId, direction) =>
    set((state) => ({
      pages: withPage(state.pages, pageId, (page) => {
        const index = page.blocks.findIndex((block) => block.id === blockId);
        const target =
          direction === "up" ? index - 1 : index + 1;
        if (index < 0 || target < 0 || target >= page.blocks.length) {
          return page;
        }
        const blocks = [...page.blocks];
        [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
        return { ...page, blocks, updatedAt: now() };
      }),
    })),

  toggleBlock: (pageId, blockId) =>
    set((state) => ({
      pages: withPage(state.pages, pageId, (page) => ({
        ...page,
        blocks: page.blocks.map((block) =>
          block.id === blockId ? { ...block, enabled: !block.enabled } : block,
        ),
        updatedAt: now(),
      })),
    })),

  publish: (organizationId) => {
    const publishedAt = now();
    set((state) => ({
      sites: withSite(state.sites, organizationId, (site) => ({
        ...site,
        lastPublishedAt: publishedAt,
      })),
      // R4 de Blog: publicar mueve los borradores a publicados y sella la fecha.
      pages: state.pages.map((page) =>
        page.organizationId === organizationId
          ? { ...page, status: "publicado", publishedAt, updatedAt: publishedAt }
          : page,
      ),
    }));
  },

  siteByOrganization: (organizationId) =>
    get().sites.find((site) => site.organizationId === organizationId),

  allowedDomainMode: (organizationId) =>
    DOMAIN_RULE_BY_PLAN[getPlanKeyByOrganization(organizationId)] ??
    "subdominio",
}));