"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusChip } from "@/components/dashboard/overview/StatusChip";
import { useDashboardStore } from "@/stores/dashboard-store";
import { NewOrganizationDialog } from "@/components/dashboard/organizaciones/NewOrganizationDialog";

/**
 * Mis organizaciones — grid de tenants del usuario.
 * TODO(0.2): leer desde `GET /orgs` (rol, plan, estado de suscripción).
 */
export const OrganizationsGrid = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dashboard = useDashboardStore();
  const organizations = dashboard.getOrganizationSummaries();
  const header = (
    <div className="flex items-center justify-between gap-3">
      <h2 id="orgs-title" className="text-base font-medium">
        Mis organizaciones
      </h2>
      <Button type="button" className="text-sm px-3 rounded-full" onClick={() => setDialogOpen(true)}>
        Nueva <span className="hidden sm:inline">organización</span>
      </Button>
    </div>
  );

  if (organizations.length === 0) {
    return (
      <section data-demo="organizations" aria-labelledby="orgs-title">
        {header}
        <div className="mt-4 rounded-xl border border-dashed border-border">
          <EmptyState
            icon={Building2}
            title="Aún no tienes organizaciones"
            description="Crea tu primera organización para empezar a operar con Zentro."
            actionLabel="Crear organización"
            onAction={() => setDialogOpen(true)}
          />
        </div>
        <NewOrganizationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </section>
    );
  }

  return (
    <section data-demo="organizations" aria-labelledby="orgs-title">
      {header}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <li key={org.id}>
            <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Building2 className="size-5" />
                </div>
                {org.setupStatus === "DRAFT" ? (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    Pendiente
                  </span>
                ) : (
                  <StatusChip status={org.status} />
                )}
              </div>
              <h3 className="mt-4 text-sm font-medium">{org.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {org.plan} · Rol: {org.role}
              </p>
              <Link
                href={org.setupStatus === "DRAFT" ? `/dashboard/organizaciones/${org.id}/onboarding` : `/app/${org.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                {org.setupStatus === "DRAFT" ? "Continuar configuración" : "Abrir"} <ArrowUpRight className="size-3.5" />
              </Link>
            </article>
          </li>
        ))}
      </ul>
      <NewOrganizationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};
