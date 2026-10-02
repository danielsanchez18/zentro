"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useWebPresenceStore } from "@/stores/web-presence-store";
import type { SiteBlock } from "@/lib/mock/web-presence";

interface BlockEditorProps {
  pageId: string;
  block: SiteBlock;
}

/**
 * Edición del contenido de un bloque.
 *
 * Solo ofrece campos de texto y opciones. Nunca HTML, CSS ni JS: la spec lo
 * prohíbe explícitamente por seguridad.
 */
export const BlockEditor = ({ pageId, block }: BlockEditorProps) => {
  const [open, setOpen] = useState(false);
  const updateBlockConfig = useWebPresenceStore(
    (state) => state.updateBlockConfig,
  );

  const config = block.config as Record<string, unknown>;
  const set = (key: string, value: unknown) =>
    updateBlockConfig(pageId, block.id, { ...config, [key]: value });

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {open ? (
          <ChevronDown className="size-3.5" />
        ) : (
          <ChevronRight className="size-3.5" />
        )}
        Editar contenido
      </button>

      {open && (
        <div className="mt-3 space-y-2.5">
          {block.type === "hero" && (
            <>
              <TextField
                label="Título"
                value={String(config.title ?? "")}
                onChange={(value) => set("title", value)}
              />
              <TextField
                label="Subtítulo"
                value={String(config.subtitle ?? "")}
                onChange={(value) => set("subtitle", value)}
              />
              <TextField
                label="Botón"
                value={String(config.ctaLabel ?? "")}
                onChange={(value) => set("ctaLabel", value)}
              />
            </>
          )}

          {block.type === "encabezado" && (
            <>
              <TextField
                label="Nombre del logo"
                value={String(config.logoText ?? "")}
                onChange={(value) => set("logoText", value)}
              />
              <TextField
                label="Botón de acción"
                value={String(config.ctaLabel ?? "")}
                onChange={(value) => set("ctaLabel", value)}
              />
              <p className="text-xs text-muted-foreground">
                Los enlaces de navegación se editan en el constructor visual.
              </p>
            </>
          )}

          {block.type === "catalogo" && (
            <>
              <TextField
                label="Título de la sección"
                value={String(config.title ?? "")}
                onChange={(value) => set("title", value)}
              />
              <NumberField
                label="Cantidad de productos"
                value={Number(config.limit ?? 8)}
                onChange={(value) => set("limit", value)}
              />
              <p className="text-xs text-muted-foreground">
                Los productos vienen del catálogo de Zentro y se sincronizan
                solos.
              </p>
            </>
          )}

          {block.type === "blog" && (
            <>
              <TextField
                label="Título de la sección"
                value={String(config.title ?? "")}
                onChange={(value) => set("title", value)}
              />
              <NumberField
                label="Cantidad de artículos"
                value={Number(config.limit ?? 3)}
                onChange={(value) => set("limit", value)}
              />
              <p className="text-xs text-muted-foreground">
                Se mostrarán los artículos publicados en Blog.
              </p>
            </>
          )}

          {(block.type === "formulario" || block.type === "faq" || block.type === "testimonios" || block.type === "galeria") && (
            <TextField
              label="Título"
              value={String(config.title ?? "")}
              onChange={(value) => set("title", value)}
            />
          )}

          {block.type === "footer" && (
            <>
              <TextField
                label="Dirección"
                value={String(config.address ?? "")}
                onChange={(value) => set("address", value)}
              />
              <TextField
                label="Teléfono"
                value={String(config.phone ?? "")}
                onChange={(value) => set("phone", value)}
              />
            </>
          )}

          {block.type === "producto" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Este bloque muestra un producto del catálogo. La selección del
                producto se hace en el constructor visual.
              </p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(config.showBuyButton)}
                  onChange={(event) =>
                    set("showBuyButton", event.target.checked)
                  }
                  className="size-4"
                />
                Mostrar botón de compra
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TextField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="block space-y-1">
    <span className="text-xs font-medium text-foreground">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
    />
  </label>
);

const NumberField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => (
  <label className="block space-y-1">
    <span className="text-xs font-medium text-foreground">{label}</span>
    <input
      type="number"
      min={1}
      value={value}
      onChange={(event) => onChange(Math.max(1, Number(event.target.value)))}
      className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
    />
  </label>
);