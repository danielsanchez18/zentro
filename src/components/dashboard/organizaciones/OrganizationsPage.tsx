"use client";

import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OrganizationCard } from "@/components/dashboard/organizaciones/OrganizationCard";
import { NewOrganizationDialog } from "@/components/dashboard/organizaciones/NewOrganizationDialog";
import type { Organization } from "@/components/dashboard/organizaciones/types";

// TODO(0.2): leer desde GET /orgs
const ORGS: Organization[] = [
  {
    id: "org_001",
    name: "Las Rocas Restaurante",
    slug: "las-rocas",
    plan: "Esencial",
    role: "Owner",
    status: "TRIAL",
    members: 3,
    branches: 1,
  },
  {
    id: "org_002",
    name: "Café del Valle",
    slug: "cafe-del-valle",
    plan: "Crecimiento",
    role: "Admin",
    status: "ACTIVE",
    members: 5,
    branches: 2,
  },
  {
    id: "org_003",
    name: "Fonda La Abuela",
    slug: "fonda-la-abuela",
    plan: "Esencial",
    role: "Miembro",
    status: "ACTIVE",
    members: 2,
    branches: 1,
  },
];

export const OrganizationsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-medium">Organizaciones</h1>
          <p className="text-sm text-muted-foreground">
            Tus espacios de trabajo en Zentro.
          </p>
        </div>
        <Button 
          type="button" 
          className="text-sm px-3 rounded-full"
          onClick={() => setDialogOpen(true)}
          >
          Nueva <span className="hidden sm:inline">organización</span>
        </Button>
      </div>

      {ORGS.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={Building2}
            title="Aún no tienes organizaciones"
            description="Crea tu primera organización para empezar a operar con Zentro."
            actionLabel="Crear organización"
            onAction={() => setDialogOpen(true)}
          />
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORGS.map((org) => (
            <li key={org.id}>
              <OrganizationCard org={org} />
            </li>
          ))}
        </ul>
      )}

      <NewOrganizationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};
