"use client";

import { Check, Globe, Info, Lock, ExternalLink } from "lucide-react";
import { toastMsg } from "@/components/ui/toast-message";
import {
  SITE_OBJECTIVES,
  publicUrlFor,
  ZENTRO_SUBDOMAIN_SUFFIX,
  type SiteObjective,
  type WebSite,
} from "@/lib/mock/web-presence";
import { useWebPresenceStore } from "@/stores/web-presence-store";

interface SiteTabProps {
  organizationId: string;
  site: WebSite;
}

/**
 * Pestaña "Sitio": objetivos del sitio y dominio público.
 *
 * R2: el plan de la organización decide si puede usar dominio propio. Cuando el
 * plan no lo permite, la opción se muestra bloqueada en vez de ocultarse, para
 * que se entienda por qué no está disponible.
 */
export const SiteTab = ({ organizationId, site }: SiteTabProps) => {
  const setObjectives = useWebPresenceStore((state) => state.setObjectives);
  const setDomainMode = useWebPresenceStore((state) => state.setDomainMode);
  const setSubdomain = useWebPresenceStore((state) => state.setSubdomain);
  const setCustomDomain = useWebPresenceStore(
    (state) => state.setCustomDomain,
  );
  const allowedMode = useWebPresenceStore(
    (state) => state.allowedDomainMode,
  );

  const allowed = allowedMode(organizationId);
  const canUseCustomDomain = allowed === "personalizado";

  const toggleObjective = (objective: SiteObjective) => {
    const has = site.objectives.includes(objective);
    // "Informativo" es el mínimo: un sitio sin objetivo no tiene sentido.
    if (has && site.objectives.length === 1) {
      toastMsg.info(
        "Debe quedar un objetivo",
        "El sitio necesita al menos un objetivo.",
      );
      return;
    }
    const next = has
      ? site.objectives.filter((item) => item !== objective)
      : [...site.objectives, objective];
    setObjectives(organizationId, next);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Objetivos */}
      <section className="rounded-xl bg-card border border-border font-heading">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">
            Objetivos del sitio
          </h2>
          <p className="text-xs text-muted-foreground">
            Se pueden combinar según lo que venda el negocio.
          </p>
        </div>
        <div className="space-y-2 p-5">
          {(Object.keys(SITE_OBJECTIVES) as SiteObjective[]).map((key) => {
            const objective = SITE_OBJECTIVES[key];
            const selected = site.objectives.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleObjective(key)}
                className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <span
                  className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {selected && <Check className="size-3" />}
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    {objective.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {objective.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dominio */}
      <section className="rounded-xl bg-card border border-border font-heading">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">
            Dominio público
          </h2>
          <p className="text-xs text-muted-foreground">
            Dónde vive el sitio y qué permite tu plan.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setDomainMode(organizationId, "subdominio")}
              className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
                site.domainMode === "subdominio"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/40"
              }`}
            >
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Globe className="size-3.5" />
                Subdominio Zentro
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {site.subdomain}.{ZENTRO_SUBDOMAIN_SUFFIX}
              </span>
            </button>

            <button
              type="button"
              disabled={!canUseCustomDomain}
              onClick={() => setDomainMode(organizationId, "personalizado")}
              className={`rounded-lg border p-3 text-left transition-colors ${
                !canUseCustomDomain
                  ? "cursor-not-allowed border-border opacity-60"
                  : site.domainMode === "personalizado"
                    ? "cursor-pointer border-primary bg-primary/5"
                    : "cursor-pointer border-border hover:bg-muted/40"
              }`}
            >
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {canUseCustomDomain ? (
                  <Globe className="size-3.5" />
                ) : (
                  <Lock className="size-3.5" />
                )}
                Dominio propio
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {canUseCustomDomain
                  ? site.customDomain ?? "Sin configurar"
                  : "Disponible en el plan Crecimiento"}
              </span>
            </button>
          </div>

          {site.domainMode === "subdominio" ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">
                Subdominio
              </span>
              <div className="flex items-center gap-2">
                <input
                  value={site.subdomain}
                  onChange={(event) =>
                    setSubdomain(organizationId, event.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <span className="shrink-0 text-xs text-muted-foreground">
                  .{ZENTRO_SUBDOMAIN_SUFFIX}
                </span>
              </div>
            </label>
          ) : (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">
                Dominio
              </span>
              <input
                value={site.customDomain ?? ""}
                onChange={(event) =>
                  setCustomDomain(
                    organizationId,
                    event.target.value.trim() || null,
                  )
                }
                placeholder="tu-negocio.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <span className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3 shrink-0" />
                El certificado SSL se emite al guardar. En el prototipo solo se
                registra el dominio.
              </span>
            </label>
          )}

          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-xs text-muted-foreground">
              URL pública
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              {publicUrlFor(site)}
              <ExternalLink className="size-3" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};