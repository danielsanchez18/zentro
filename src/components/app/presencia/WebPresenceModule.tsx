"use client";

import { useMemo, useState } from "react";
import { Globe, ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useWorkspaceContextView } from "@/hooks/use-workspace-context";
import { useWebPresenceStore } from "@/stores/web-presence-store";
import { toastMsg } from "@/components/ui/toast-message";
import { PresenceKPI } from "./PresenceKPI";
import { SiteTab } from "./SiteTab";
import { PagesTab } from "./PagesTab";
import { DesignTab } from "./DesignTab";
import { PresenceTabs } from "./shared/PresenceTabs";

export type PresenceTabId = "sitio" | "paginas" | "diseno";

interface WebPresenceModuleProps {
  slug: string;
}

/**
 * Constructor Web (/app/:slug/presencia).
 *
 * El sitio pertenece a la organización, no a una sucursal, así que este módulo
 * no usa `activeLocation` a propósito. Publicar es una acción explícita: los
 * cambios quedan en borrador hasta que alguien pulsa Publicar.
 */
export const WebPresenceModule = ({ slug }: WebPresenceModuleProps) => {
  const view = useWorkspaceContextView(slug);
  const [tab, setTab] = useState<PresenceTabId>("sitio");

  // Se suscribe a los arrays crudos, no a las funciones selector del store:
  // una función tiene identidad estable, así que el useMemo nunca volvería a
  // correr y la vista quedaría desactualizada tras publicar o editar.
  const sites = useWebPresenceStore((state) => state.sites);
  const pages = useWebPresenceStore((state) => state.pages);
  const createSite = useWebPresenceStore((state) => state.createSite);
  const publish = useWebPresenceStore((state) => state.publish);

  const organizationId = view.organization?.id;
  const canView = view.canViewModule("/presencia");

  const orgSite = useMemo(
    () => sites.find((site) => site.organizationId === organizationId),
    [sites, organizationId],
  );

  const orgPages = useMemo(
    () =>
      pages
        .filter((page) => page.organizationId === organizationId)
        .sort((a, b) => {
          // La portada siempre primero.
          if (a.isHome !== b.isHome) return a.isHome ? -1 : 1;
          return a.name.localeCompare(b.name, "es");
        }),
    [pages, organizationId],
  );

  /** R3: lo editado después del último publish sigue sin verse público. */
  const pendingPages = useMemo(() => {
    if (!organizationId || !orgSite) return [];
    if (!orgSite.lastPublishedAt) return orgPages;
    return orgPages.filter((page) => page.updatedAt > orgSite.lastPublishedAt!);
  }, [orgPages, orgSite, organizationId]);

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
            description={`Tu rol (${view.role.name}) no tiene permiso para editar el sitio web de esta organización.`}
          />
        </div>
      </div>
    );
  }

  // R1: una sola web por organización. Si no existe, se ofrece crearla.
  if (!orgSite) {
    return (
      <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
        <div>
          <h1 className="text-lg font-medium text-foreground">Sitio web</h1>
          <p className="text-sm text-muted-foreground">
            Publica tu página sin programar, con el catálogo siempre sincronizado.
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-border bg-card/40 font-heading">
          <EmptyState
            icon={Globe}
            title="Todavía no tienes un sitio web"
            description="Crea tu sitio por bloques. El catálogo de Zentro se alimenta automáticamente."
            actionLabel="Crear sitio web"
            onAction={() => {
              createSite(organizationId);
              toastMsg.success(
                "Sitio web creado",
                "Ahora elige plantilla y arma tus páginas.",
              );
            }}
          />
        </div>
      </div>
    );
  }

  const handlePublish = () => {
    publish(organizationId);
    toastMsg.success(
      "Sitio publicado",
      `${orgPages.length} ${orgPages.length === 1 ? "página publicada" : "páginas publicadas"}.`,
    );
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">Sitio web</h1>
          <p className="text-sm text-muted-foreground">
            Constructor por bloques. El catálogo y el blog se sincronizan solos.
          </p>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            onClick={handlePublish}
            className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled={pendingPages.length === 0}
          >
            {pendingPages.length > 0
              ? `Publicar ${pendingPages.length} ${pendingPages.length === 1 ? "cambio" : "cambios"}`
              : "Todo publicado"}
          </button>
        </div>
      </div>

      <PresenceKPI pages={orgPages} pendingCount={pendingPages.length} />

      <PresenceTabs activeTab={tab} onTabChange={setTab} />

      {tab === "sitio" && <SiteTab organizationId={organizationId} site={orgSite} />}
      {tab === "paginas" && <PagesTab organizationId={organizationId} pages={orgPages} />}
      {tab === "diseno" && <DesignTab organizationId={organizationId} site={orgSite} />}
    </div>
  );
};