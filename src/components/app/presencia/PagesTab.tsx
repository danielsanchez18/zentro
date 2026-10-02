"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  FileText,
  Home,
  Plus,
  Trash2,
} from "lucide-react";
import { toastMsg } from "@/components/ui/toast-message";
import { EmptyState } from "@/components/ui/empty-state";
import { BLOCK_DEFS, type SitePage } from "@/lib/mock/web-presence";
import { useWebPresenceStore } from "@/stores/web-presence-store";
import { BlockEditor } from "./BlockEditor";
import { AddBlockMenu } from "./AddBlockMenu";
import { PagePreview } from "./PagePreview";

interface PagesTabProps {
  organizationId: string;
  pages: SitePage[];
}

/**
 * Pestaña "Páginas": el constructor por bloques.
 *
 * El prototipo no implementa drag & drop (la spec lo pide, pero en mock no
 * aporta); el orden se cambia con ↑/↓. Ver issues.md del módulo.
 */
export const PagesTab = ({ organizationId, pages }: PagesTabProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    pages[0]?.id ?? null,
  );
  const [preview, setPreview] = useState(false);

  const addPage = useWebPresenceStore((state) => state.addPage);
  const removePage = useWebPresenceStore((state) => state.removePage);
  const moveBlock = useWebPresenceStore((state) => state.moveBlock);
  const removeBlock = useWebPresenceStore((state) => state.removeBlock);
  const toggleBlock = useWebPresenceStore((state) => state.toggleBlock);
  const addBlock = useWebPresenceStore((state) => state.addBlock);
  const publish = useWebPresenceStore((state) => state.publish);

  const selected = useMemo(
    () => pages.find((page) => page.id === selectedId) ?? pages[0],
    [pages, selectedId],
  );

  const handleAddPage = () => {
    const name = `Página ${pages.length + 1}`;
    addPage(organizationId, name);
    toastMsg.success("Página creada", `${name} empieza como borrador.`);
  };

  const handleDeletePage = (page: SitePage) => {
    if (page.isHome) {
      toastMsg.info(
        "No se puede eliminar",
        "La portada es obligatoria y no se puede borrar.",
      );
      return;
    }
    removePage(page.id);
    if (selectedId === page.id) setSelectedId(null);
    toastMsg.success("Página eliminada", `${page.name} se quitó del sitio.`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      {/* Lista de páginas */}
      <section className="rounded-xl bg-card border border-border font-heading">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">Páginas</h2>
          <button
            type="button"
            onClick={handleAddPage}
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Nueva
          </button>
        </div>

        <div className="space-y-1 p-2">
          {pages.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              Sin páginas.
            </p>
          ) : (
            pages.map((page) => {
              const active = selected?.id === page.id;
              return (
                <div
                  key={page.id}
                  className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 ${
                    active ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(page.id)}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
                  >
                    {page.isHome ? (
                      <Home className="size-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span
                      className={`truncate text-sm ${
                        active
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {page.name}
                    </span>
                  </button>

                  {!page.isHome && (
                    <button
                      type="button"
                      onClick={() => handleDeletePage(page)}
                      aria-label={`Eliminar ${page.name}`}
                      className="cursor-pointer rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Constructor */}
      <section className="rounded-xl bg-card border border-border font-heading">
        {!selected ? (
          <div className="border-b border-border px-5 py-3">
            <EmptyState
              icon={FileText}
              title="Sin páginas"
              description="Crea tu primera página para empezar a armar el sitio."
              actionLabel="Crear página"
              onAction={handleAddPage}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
              <div>
                <h2 className="text-sm font-medium text-foreground">
                  {selected.name}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {selected.slug}
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selected.status === "publicado"
                    ? "Publicada"
                    : "Borrador · invisible en el sitio"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview((value) => !value)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Eye className="size-3.5" />
                {preview ? "Editar bloques" : "Vista previa"}
              </button>
            </div>

            {preview ? (
              <PagePreview page={selected} />
            ) : (
              <div className="space-y-2 p-5">
                {selected.blocks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-6">
                    <EmptyState
                      icon={FileText}
                      title="Página vacía"
                      description="Agrega bloques para construirla. El catálogo y el blog se alimentan solos."
                    />
                  </div>
                ) : (
                  selected.blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={`rounded-lg border p-3 ${
                        block.enabled
                          ? "border-border bg-card"
                          : "border-dashed border-border bg-muted/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {BLOCK_DEFS[block.type].label}
                            {!block.enabled && (
                              <span className="ml-2 text-xs font-normal text-muted-foreground">
                                oculto
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {BLOCK_DEFS[block.type].description}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              moveBlock(selected.id, block.id, "up")
                            }
                            disabled={index === 0}
                            aria-label="Subir bloque"
                            className="cursor-pointer rounded p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              moveBlock(selected.id, block.id, "down")
                            }
                            disabled={index === selected.blocks.length - 1}
                            aria-label="Bajar bloque"
                            className="cursor-pointer rounded p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleBlock(selected.id, block.id)}
                            aria-label={
                              block.enabled ? "Ocultar bloque" : "Mostrar bloque"
                            }
                            className="cursor-pointer rounded p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          >
                            {block.enabled ? (
                              <Eye className="size-3.5" />
                            ) : (
                              <EyeOff className="size-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              removeBlock(selected.id, block.id);
                              toastMsg.success(
                                "Bloque eliminado",
                                "Se quitó de la página.",
                              );
                            }}
                            aria-label="Eliminar bloque"
                            className="cursor-pointer rounded p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <BlockEditor pageId={selected.id} block={block} />
                    </div>
                  ))
                )}

                <div className="pt-2">
                  <AddBlockMenu
                    onSelect={(type) => {
                      addBlock(selected.id, type);
                      toastMsg.success(
                        "Bloque agregado",
                        BLOCK_DEFS[type].label,
                      );
                    }}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">
                    {selected.blocks.length}{" "}
                    {selected.blocks.length === 1 ? "bloque" : "bloques"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      publish(organizationId);
                      toastMsg.success(
                        "Sitio publicado",
                        "Los cambios ya son visibles.",
                      );
                    }}
                    className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};