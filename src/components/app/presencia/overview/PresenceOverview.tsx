"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Compass,
  LayoutTemplate,
  MousePointerClick,
  ShieldAlert,
  Signpost,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { useWorkspaceContextView } from "@/hooks/use-workspace-context";
import { cn } from "@/lib/utils";
import { useWebPresenceStore } from "@/stores/web-presence-store";
import {
  PRESENCE_PERIOD_LABELS,
  analyticsByOrganization,
  type PresencePeriod,
} from "@/lib/mock/presence-analytics";
import { PresenceAnalyticsKPI } from "./PresenceAnalyticsKPI";
import { TrafficChart } from "./TrafficChart";
import { TrafficSources } from "./TrafficSources";
import { RegionsList } from "./RegionsList";
import { TopPages } from "./TopPages";
import { InteractionsList } from "./InteractionsList";

const PERIODS: PresencePeriod[] = ["7d", "30d", "90d"];

interface PresenceOverviewProps {
  slug: string;
}

/**
 * Presencia Digital (/app/:slug/presencia) — overview de analítica.
 *
 * Es la vista de quien administra el negocio: cómo viene el tráfico, de dónde
 * llega, qué páginas rinden y qué hacen los visitantes. El constructor por
 * bloques vive aparte, en `/presencia/constructor`.
 */
export const PresenceOverview = ({ slug }: PresenceOverviewProps) => {
  const view = useWorkspaceContextView(slug);
  const [period, setPeriod] = useState<PresencePeriod>("30d");

  const site = useWebPresenceStore((state) => state.sites);

  const organizationId = view.organization?.id;
  const canView = view.canViewModule("/presencia");

  const orgSite = useMemo(
    () => site.find((item) => item.organizationId === organizationId),
    [site, organizationId],
  );

  const analytics = useMemo(
    () =>
      organizationId
        ? analyticsByOrganization(organizationId, period)
        : undefined,
    [organizationId, period],
  );

  if (!organizationId) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <h1 className="text-lg font-medium">Sitio web</h1>
        <p className="text-sm text-muted-foreground">
          No se encontró la organización activa.
        </p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <div className="rounded-xl border border-dashed border-border bg-card/40">
          <EmptyState
            icon={ShieldAlert}
            title="Sin acceso al sitio web"
            description={`Tu rol (${view.role.name}) no tiene permiso para ver el sitio web de esta organización.`}
          />
        </div>
      </div>
    );
  }

  // Sin sitio no hay nada que medir: el constructor es el siguiente paso.
  if (!orgSite) {
    return (
      <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
        <div>
          <h1 className="text-lg font-medium text-foreground">Sitio web</h1>
          <p className="text-sm text-muted-foreground">
            Analítica de visitas, interacción y orígenes del tráfico.
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-border bg-card/40 font-heading">
          <EmptyState
            icon={Compass}
            title="Todavía no hay un sitio que medir"
            description="Crea tu sitio por bloques y acá vas a ver cómo te va: visitas, de dónde llegan y qué páginas rinden."
            actionLabel="Ir al constructor"
            onAction={() => {
              window.location.href = `/app/${slug}/presencia/constructor`;
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium text-foreground">Sitio web</h1>
          <p className="text-sm line-clamp-1 text-muted-foreground">
            Cómo viene el tráfico y qué hacen los visitantes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/app/${slug}/presencia/constructor`}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "cursor-pointer",
            )}
          >
            Ir al constructor
          </Link>
        </div>
      </header>

      <div className="inline-flex items-center gap-1.5 overflow-x-auto">
        {PERIODS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPeriod(item)}
            className={cn(
              "text-nowrap rounded-md px-3 py-1.5 leading-none text-sm font-medium transition-colors cursor-pointer",
              period === item
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground bg-primary/5",
            )}
          >
            {PRESENCE_PERIOD_LABELS[item]}
          </button>
        ))}
      </div>

      {!analytics ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 font-heading">
          <EmptyState
            icon={Activity}
            title="Sin datos de analítica"
            description="Todavía no hay tráfico registrado para este sitio."
          />
        </div>
      ) : (
        <>
          <PresenceAnalyticsKPI analytics={analytics} />

          {/* Tráfico en el tiempo */}
          <section className="rounded-xl bg-card border border-border p-5 font-heading">
            <TrafficChart daily={analytics.daily} />
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl bg-card border border-border font-heading">
              <div className="border-b border-border px-5 py-3">
                <h2 className="text-sm font-medium text-foreground">
                  De dónde viene el tráfico
                </h2>
                <p className="text-xs text-muted-foreground">
                  Origen de las visitas del periodo.
                </p>
              </div>
              <div className="p-5">
                <TrafficSources sources={analytics.sources} />
              </div>
            </section>

            <section className="rounded-xl bg-card border border-border font-heading">
              <div className="border-b border-border px-5 py-3">
                <h2 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Signpost className="size-3.5" />
                  Regiones
                </h2>
                <p className="text-xs text-muted-foreground">
                  Desde dónde te encuentran.
                </p>
              </div>
              <div className="p-5">
                <RegionsList regions={analytics.regions} />
              </div>
            </section>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl bg-card border border-border font-heading">
              <div className="border-b border-border px-5 py-3">
                <h2 className="text-sm font-medium text-foreground">
                  Páginas con más visitas
                </h2>
                <p className="text-xs text-muted-foreground">
                  Vistas, permanencia y rebote por página.
                </p>
              </div>
              <div className="p-2">
                <TopPages pages={analytics.pages} />
              </div>
            </section>

            <section className="rounded-xl bg-card border border-border font-heading">
              <div className="border-b border-border px-5 py-3">
                <h2 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <MousePointerClick className="size-3.5" />
                  Interacciones
                </h2>
                <p className="text-xs text-muted-foreground">
                  Qué hacen los visitantes y cuántas veces llega a convertir.
                </p>
              </div>
              <div className="space-y-4 p-5">
                <InteractionsList
                  interactions={analytics.interactionBreakdown}
                />

                <div className="border-t border-border pt-3">
                  <p className="text-xs font-medium text-foreground">
                    Páginas de entrada
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {analytics.landings.map((landing) => (
                      <li
                        key={landing.path}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="min-w-0 truncate text-muted-foreground">
                          {landing.label}{" "}
                          <span className="text-muted-foreground/60">
                            {landing.path}
                          </span>
                        </span>
                        <span className="shrink-0 font-medium tabular-nums text-foreground">
                          {landing.entrances}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};
