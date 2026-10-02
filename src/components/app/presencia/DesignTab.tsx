"use client";

import { Check } from "lucide-react";
import {
  FONT_OPTIONS,
  SITE_TEMPLATES,
  type SiteTheme,
  type WebSite,
} from "@/lib/mock/web-presence";
import { useWebPresenceStore } from "@/stores/web-presence-store";

interface DesignTabProps {
  organizationId: string;
  site: WebSite;
}

/**
 * Pestaña "Diseño": plantilla + tokens de personalización.
 *
 * El prototipo solo expone tokens (colores, fuente, escala, espaciado). La spec
 * prohíbe inyectar HTML, CSS o JS propio, así que no existe campo para eso.
 */
export const DesignTab = ({ organizationId, site }: DesignTabProps) => {
  const applyTemplate = useWebPresenceStore((state) => state.applyTemplate);
  const updateTheme = useWebPresenceStore((state) => state.updateTheme);

  const theme = site.theme;

  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-card border border-border font-heading">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">Plantilla</h2>
          <p className="text-xs text-muted-foreground">
            Cada plantilla define colores, tipografía y espaciado. Se puede
            ajustar después.
          </p>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {(Object.keys(SITE_TEMPLATES) as SiteTheme["templateKey"][]).map(
            (key) => {
              const template = SITE_TEMPLATES[key];
              const selected = theme.templateKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyTemplate(organizationId, key)}
                  className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  {/* Muestra de la paleta de la plantilla */}
                  <div className="mb-3 flex gap-1">
                    <span
                      className="h-6 flex-1 rounded"
                      style={{ backgroundColor: template.theme.primaryColor }}
                    />
                    <span
                      className="h-6 flex-1 rounded"
                      style={{ backgroundColor: template.theme.accentColor }}
                    />
                    <span
                      className="h-6 flex-1 rounded border border-border"
                      style={{ backgroundColor: template.theme.backgroundColor }}
                    />
                  </div>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {template.label}
                    {selected && <Check className="size-3.5" />}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </button>
              );
            },
          )}
        </div>
      </section>

      <section className="rounded-xl bg-card border border-border font-heading">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">
            Personalización
          </h2>
          <p className="text-xs text-muted-foreground">
            Solo tokens de diseño. No se permite HTML, CSS ni JS propio.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
          <ColorField
            label="Color principal"
            value={theme.primaryColor}
            onChange={(value) => updateTheme(organizationId, { primaryColor: value })}
          />
          <ColorField
            label="Color de acento"
            value={theme.accentColor}
            onChange={(value) => updateTheme(organizationId, { accentColor: value })}
          />
          <ColorField
            label="Color de fondo"
            value={theme.backgroundColor}
            onChange={(value) =>
              updateTheme(organizationId, { backgroundColor: value })
            }
          />

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Tipografía
            </span>
            <select
              value={theme.fontFamily}
              onChange={(event) =>
                updateTheme(organizationId, {
                  fontFamily: event.target.value as SiteTheme["fontFamily"],
                })
              }
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
            >
              {Object.entries(FONT_OPTIONS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Escala de títulos
            </span>
            <select
              value={theme.headingScale}
              onChange={(event) =>
                updateTheme(organizationId, {
                  headingScale: event.target.value as SiteTheme["headingScale"],
                })
              }
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
            >
              <option value="sm">Pequeña</option>
              <option value="md">Media</option>
              <option value="lg">Grande</option>
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Espaciado
            </span>
            <select
              value={theme.spacing}
              onChange={(event) =>
                updateTheme(organizationId, {
                  spacing: event.target.value as SiteTheme["spacing"],
                })
              }
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
            >
              <option value="compacto">Compacto</option>
              <option value="amplio">Amplio</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
};

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="size-9 cursor-pointer rounded border border-border bg-background p-1"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm"
      />
    </div>
  </label>
);