"use client";

import {
  INTEGRATION_CATALOG,
  INTEGRATION_CAPABILITY_LABELS,
  INTEGRATION_STATUS_LABELS,
  integrationIcon,
  type IntegrationDef,
} from "@/lib/mock/channels";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { cn } from "@/lib/utils";

interface ExternalIntegrationsProps {
  /** Plataformas ya conectadas (hoy ninguna; la entidad ya las contempla). */
  connected: { platform: IntegrationDef["key"]; account?: string | null }[];
}

/**
 * Catálogo de integraciones externas (WhatsApp, TikTok, Instagram, Shopify, Mercado Libre).
 * Cards estilizadas con el diseño estándar de Zentro.
 */
export const ExternalIntegrations = ({
  connected,
}: ExternalIntegrationsProps) => {
  const connectedKeys = new Set(connected.map((c) => c.platform));

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {INTEGRATION_CATALOG.map((integration) => {
        const Icon = integrationIcon(integration.key);
        const isConnected = connectedKeys.has(integration.key);

        return (
          <article
            key={integration.key}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all font-heading",
              "hover:border-primary/60",
            )}
          >
            <div>
              {/* Cabecera: Ícono + Nombre + StatusBadge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors group-hover:text-primary">
                    <Icon className="size-4.5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {integration.label}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">
                      Integración externa
                    </p>
                  </div>
                </div>

                <StatusBadge
                  status={isConnected ? "confirmado" : "default"}
                  label={
                    isConnected
                      ? INTEGRATION_STATUS_LABELS.conectado
                      : INTEGRATION_STATUS_LABELS.no_disponible
                  }
                />
              </div>

              {/* Descripción */}
              <p className="mt-3 mb-1 text-sm text-muted-foreground line-clamp-2">
                {integration.description}
              </p>

              {/* Capacidades / Sincronización */}
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Sincroniza
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {integration.capabilities.map((capability) => (
                    <span
                      key={capability}
                      className="inline-flex items-center rounded-md border border-border/70 bg-accent/40 px-2.25 py-1 text-[13px] font-medium text-foreground"
                    >
                      {INTEGRATION_CAPABILITY_LABELS[capability]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="my-3 border-t border-border" />

              {/* Botón de Conectar / Próximamente */}
              <button
                type="button"
                disabled={!integration.available}
                className={cn(
                  "w-full rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors",
                  integration.available
                    ? "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
                    : "cursor-not-allowed opacity-60 bg-muted/60 text-muted-foreground",
                )}
              >
                {integration.available ? "Conectar plataforma" : "Próximamente"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};
