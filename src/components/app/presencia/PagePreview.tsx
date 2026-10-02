"use client";

import { publicUrlFor, type SitePage, type WebSite } from "@/lib/mock/web-presence";
import { useWebPresenceStore } from "@/stores/web-presence-store";

interface PagePreviewProps {
  page: SitePage;
}

/**
 * Vista previa de solo lectura.
 *
 * Aplica los tokens del tema (nunca CSS libre, por la regla de seguridad de la
 * spec) y salta los bloques desactivados, como lo haría el sitio público.
 */
export const PagePreview = ({ page }: PagePreviewProps) => {
  const site = useWebPresenceStore((state) =>
    state.siteByOrganization(page.organizationId),
  );

  const theme = site?.theme;
  const visible = page.blocks.filter((block) => block.enabled);

  const headingSize =
    theme?.headingScale === "lg"
      ? "text-xl"
      : theme?.headingScale === "sm"
        ? "text-base"
        : "text-lg";

  const gap = theme?.spacing === "amplio" ? "space-y-8" : "space-y-5";
  const fontFamily =
    theme?.fontFamily === "serif"
      ? "font-serif"
      : theme?.fontFamily === "redondeada"
        ? "font-sans"
        : "font-sans";

  return (
    <div className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Así se ve {page.name} para el visitante.
        </p>
        {site && (
          <p className="text-xs text-muted-foreground">
            {publicUrlFor(site)}
            {page.isHome ? "" : page.slug}
          </p>
        )}
      </div>

      <div
        className={`overflow-hidden rounded-lg border border-border ${gap} ${fontFamily} p-6`}
        style={{ backgroundColor: theme?.backgroundColor }}
      >
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todos los bloques están ocultos.
          </p>
        ) : (
          visible.map((block) => {
            const config = block.config as Record<string, unknown>;

            if (block.type === "encabezado") {
              return (
                <div
                  key={block.id}
                  className="flex items-center justify-between border-b pb-3"
                  style={{ borderColor: theme?.primaryColor }}
                >
                  <span
                    className={`font-medium ${headingSize}`}
                    style={{ color: theme?.primaryColor }}
                  >
                    {String(config.logoText ?? "Mi negocio")}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: theme?.accentColor,
                      color: "#fff",
                    }}
                  >
                    {String(config.ctaLabel ?? "Contactar")}
                  </span>
                </div>
              );
            }

            if (block.type === "hero") {
              return (
                <div key={block.id} className="space-y-2 py-4">
                  <p
                    className={`${headingSize} font-medium`}
                    style={{ color: theme?.primaryColor }}
                  >
                    {String(config.title ?? "")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {String(config.subtitle ?? "")}
                  </p>
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs"
                    style={{ backgroundColor: theme?.accentColor, color: "#fff" }}
                  >
                    {String(config.ctaLabel ?? "")}
                  </span>
                </div>
              );
            }

            if (block.type === "catalogo" || block.type === "blog") {
              return (
                <div key={block.id} className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {String(config.title ?? "")}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({
                      length: Math.min(Number(config.limit ?? 3), 6),
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="h-16 rounded-md border border-dashed border-border bg-muted/30"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {block.type === "catalogo"
                      ? "Productos del catálogo de Zentro."
                      : "Artículos publicados en Blog."}
                  </p>
                </div>
              );
            }

            if (block.type === "faq") {
              const items = (config.items ?? []) as { question: string }[];
              return (
                <div key={block.id} className="space-y-1.5">
                  <p className="text-sm font-medium text-foreground">
                    {String(config.title ?? "")}
                  </p>
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Sin preguntas cargadas.
                    </p>
                  ) : (
                    items.map((item, index) => (
                      <p
                        key={index}
                        className="rounded-md bg-muted/40 px-2.5 py-1.5 text-xs"
                      >
                        {item.question}
                      </p>
                    ))
                  )}
                </div>
              );
            }

            if (block.type === "footer") {
              return (
                <div
                  key={block.id}
                  className="border-t pt-3 text-xs text-muted-foreground"
                  style={{ borderColor: theme?.primaryColor }}
                >
                  {String(config.address ?? "")}
                  {config.phone ? ` · ${String(config.phone)}` : ""}
                </div>
              );
            }

            if (block.type === "formulario") {
              return (
                <div key={block.id} className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {String(config.title ?? "")}
                  </p>
                  <div className="h-9 rounded-md border border-dashed border-border bg-muted/20" />
                  <div className="h-9 w-24 rounded-md border border-dashed border-border bg-muted/20" />
                </div>
              );
            }

            if (block.type === "galeria") {
              const urls = (config.imageUrls ?? []) as string[];
              return (
                <div key={block.id} className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {String(config.title ?? "")}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(urls.length > 0 ? urls : ["", "", ""]).slice(0, 6).map(
                      (url, index) => (
                        <div
                          key={index}
                          className="h-16 rounded-md border border-dashed border-border bg-muted/30"
                        />
                      ),
                    )}
                  </div>
                </div>
              );
            }

            if (block.type === "testimonios") {
              const items = (config.items ?? []) as {
                author: string;
                quote: string;
              }[];
              return (
                <div key={block.id} className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {String(config.title ?? "")}
                  </p>
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Sin testimonios cargados.
                    </p>
                  ) : (
                    items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-md bg-muted/40 px-2.5 py-1.5 text-xs"
                      >
                        “{item.quote}”
                        <span className="ml-1 text-muted-foreground">
                          — {item.author}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              );
            }

            return (
              <div key={block.id} className="rounded-md border border-dashed border-border p-2.5 text-xs text-muted-foreground">
                Bloque «{block.type}»
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};