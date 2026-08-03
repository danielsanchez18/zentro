"use client";

import { useState } from "react";
import { AlertCircle, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OrganizationCard } from "@/components/dashboard/organizaciones/OrganizationCard";
import { NewOrganizationDialog } from "@/components/dashboard/organizaciones/NewOrganizationDialog";
import { useOrgs } from "@/hooks/use-orgs";

export const OrganizationsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { orgs, status, error, refetch } = useOrgs();

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

      {status === "loading" && (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm">Cargando organizaciones…</span>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 text-destructive" />
            <div className="space-y-2">
              <p className="text-sm font-medium">No pudimos cargar tus organizaciones</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                type="button"
                variant="outline"
                className="text-sm px-3 rounded-full"
                onClick={() => refetch()}
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === "empty" && (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={Building2}
            title="Aún no tienes organizaciones"
            description="Crea tu primera organización para empezar a operar con Zentro."
            actionLabel="Crear organización"
            onAction={() => setDialogOpen(true)}
          />
        </div>
      )}

      {status === "success" && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <li key={org.id}>
              <OrganizationCard org={org} />
            </li>
          ))}
        </ul>
      )}

      <NewOrganizationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={() => refetch()}
      />
    </div>
  );
};