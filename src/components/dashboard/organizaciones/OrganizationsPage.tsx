"use client";

import { useState } from "react";
import { Building2, Search, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { OrganizationCard } from "@/components/dashboard/organizaciones/OrganizationCard";
import { NewOrganizationDialog } from "@/components/dashboard/organizaciones/NewOrganizationDialog";
import { useDashboardStore } from "@/stores/dashboard-store";

type Filter = "ALL" | "READY" | "DRAFT";

export const OrganizationsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const dashboard = useDashboardStore();
  const organizations = dashboard.getOrganizationSummaries();
  const drafts = organizations.filter((org) => org.setupStatus === "DRAFT");
  const ready = organizations.length - drafts.length;

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "ALL", label: "Todas", count: organizations.length },
    { key: "READY", label: "Activas", count: ready },
    { key: "DRAFT", label: "Por configurar", count: drafts.length },
  ];

  const normalized = query.trim().toLowerCase();
  const visible = organizations.filter((org) => {
    if (filter === "READY" && org.setupStatus === "DRAFT") return false;
    if (filter === "DRAFT" && org.setupStatus !== "DRAFT") return false;
    if (!normalized) return true;
    return org.name.toLowerCase().includes(normalized) || org.slug.includes(normalized);
  });

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm bg-card px-4 py-3">
        <div>
          <h1 className="font-sans text-lg font-medium">Organizaciones</h1>
          <p className="text-sm text-muted-foreground">
            Tus espacios de trabajo en Zentro. Entra a una o continúa las que están por configurar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="rounded-sm bg-foreground px-2.5 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Nueva <span className="hidden sm:inline">organización</span>
        </button>
      </div>

      <section aria-label="Listado de organizaciones" className="space-y-5 rounded-sm bg-card px-4 py-3">
        {organizations.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div role="tablist" aria-label="Filtrar organizaciones" className="flex gap-1 rounded-sm bg-muted p-1">
              {filters.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={filter === item.key}
                  onClick={() => setFilter(item.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm font-medium transition-colors",
                    filter === item.key
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                  <span className="text-xs text-muted-foreground">{item.count}</span>
                </button>
              ))}
            </div>

            <label className="relative w-full sm:w-64">
              <span className="sr-only">Buscar organización</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre o slug"
                className="h-9 w-full rounded-sm border border-border bg-card pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
              />
            </label>
          </div>
        )}

        {organizations.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border">
            <EmptyState
              icon={Building2}
              title="Aún no tienes organizaciones"
              description="Crea tu primera organización para empezar a operar con Zentro."
              actionLabel="Crear organización"
              onAction={() => setDialogOpen(true)}
            />
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border">
            <EmptyState
              icon={SearchX}
              title="Sin resultados"
              description="No hay organizaciones que coincidan con la búsqueda o el filtro."
            />
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((org) => (
              <li key={org.id}>
                <OrganizationCard org={org} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <NewOrganizationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};
