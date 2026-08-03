"use client";

import { ArrowUpRight, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusChip } from "@/components/dashboard/overview/StatusChip";
import type { HubOrganization } from "@/lib/services/orgs.service";
import type { OrgsStatus } from "@/hooks/use-orgs";

/**
 * Mis organizaciones — grid de tenants del usuario (GET /orgs).
 */
interface OrganizationsGridProps {
  orgs: HubOrganization[];
  status: OrgsStatus;
  onNew: () => void;
}

export const OrganizationsGrid = ({ orgs, status, onNew }: OrganizationsGridProps) => {
  const header = (
    <div className="flex items-center justify-between gap-3">
      <h2 id="orgs-title" className="text-base font-medium">
        Mis organizaciones
      </h2>
      <Button type="button" className="text-sm px-3 rounded-full" onClick={onNew}>
        Nueva <span className="hidden sm:inline">organización</span>
      </Button>
    </div>
  );

  if (status === "loading") {
    return (
      <section data-demo="organizations" aria-labelledby="orgs-title">
        {header}
        <div className="mt-4 flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm">Cargando…</span>
        </div>
      </section>
    );
  }

  if (status === "error" || orgs.length === 0) {
    return (
      <section data-demo="organizations" aria-labelledby="orgs-title">
        {header}
        <div className="mt-4 rounded-xl border border-dashed border-border">
          <EmptyState
            icon={Building2}
            title="Aún no tienes organizaciones"
            description="Crea tu primera organización para empezar a operar con Zentro."
            actionLabel="Crear organización"
            onAction={onNew}
          />
        </div>
      </section>
    );
  }

  return (
    <section data-demo="organizations" aria-labelledby="orgs-title">
      {header}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orgs.map((org) => (
          <li key={org.id}>
            <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Building2 className="size-5" />
                </div>
                <StatusChip status={org.subscriptionStatus} />
              </div>
              <h3 className="mt-4 text-sm font-medium">{org.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {org.plan} · Rol: {org.role}
              </p>
              {/* TODO(0.2#12): href /app/:slug cuando exista el workspace */}
              <a
                href="/dashboard/organizaciones"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Abrir <ArrowUpRight className="size-3.5" />
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};