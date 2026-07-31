"use client";

import { ArrowUpRight, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  StatusChip,
  type SubscriptionStatus,
} from "@/components/dashboard/overview/StatusChip";

/**
 * Mis organizaciones — grid de tenants del usuario.
 * TODO(0.2): leer desde `GET /orgs` (rol, plan, estado de suscripción).
 */
interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
  status: SubscriptionStatus;
}

const ORGS: Organization[] = [
  {
    id: "org_001",
    name: "Las Rocas Restaurante",
    slug: "las-rocas",
    plan: "Esencial",
    role: "Owner",
    status: "TRIAL",
  },
];

export const OrganizationsGrid = () => {
  const header = (
    <div className="flex items-center justify-between gap-3">
      <h2 id="orgs-title" className="text-base font-medium">
        Mis organizaciones
      </h2>
      <Button type="button" className="text-sm px-3 rounded-full">
        Nueva <span className="hidden sm:inline">organización</span>
      </Button>
    </div>
  );

  if (ORGS.length === 0) {
    return (
      <section aria-labelledby="orgs-title">
        {header}
        <div className="mt-4 rounded-xl border border-dashed border-border">
          <EmptyState
            icon={Building2}
            title="Aún no tienes organizaciones"
            description="Crea tu primera organización para empezar a operar con Zentro."
            actionLabel="Crear organización"
            onAction={() => {}}
          />
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="orgs-title">
      {header}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ORGS.map((org) => (
          <li key={org.id}>
            <article className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Building2 className="size-5" />
                </div>
                <StatusChip status={org.status} />
              </div>
              <h3 className="mt-4 text-sm font-medium">{org.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {org.plan} · Rol: {org.role}
              </p>
              <a
                href={`/app/${org.slug}`}
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
