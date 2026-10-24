"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useTenantStore } from "@/stores/tenant-store";
import { NewOrganizationDialog } from "@/components/dashboard/organizaciones/NewOrganizationDialog";
import { OrganizationCard } from "@/components/dashboard/organizaciones/OrganizationCard";

const REDIRECT_FLAG = "zentro-hub-redirected";
/** En el overview se muestran como máximo estas cards; el resto en /organizaciones. */
const MAX_VISIBLE = 6;

/**
 * Mis organizaciones — entrada única a los workspaces del usuario.
 * Reemplaza al antiguo selector "Tu organización", que duplicaba esta lista.
 * TODO(0.2): leer desde `GET /me/memberships?include=organization,subscription`.
 */
export const OrganizationsGrid = () => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const setActiveTenant = useTenantStore((state) => state.setActiveTenant);
  const dashboard = useDashboardStore();
  const organizations = dashboard.getOrganizationSummaries();
  const ready = organizations.filter((org) => org.setupStatus !== "DRAFT");
  const pending = organizations.length - ready.length;

  // Con EXACTAMENTE 1 organización lista se entra directo (una vez por sesión).
  const singleReady = ready.length === 1 ? ready[0] : null;
  useEffect(() => {
    if (!singleReady || sessionStorage.getItem(REDIRECT_FLAG)) return;
    sessionStorage.setItem(REDIRECT_FLAG, "1");
    setActiveTenant({
      orgId: singleReady.id,
      slug: singleReady.slug,
      name: singleReady.name,
    });
    router.replace(`/app/${singleReady.slug}`);
  }, [singleReady, router, setActiveTenant]);

  const visible = organizations.slice(0, MAX_VISIBLE);

  return (
    <section
      data-demo="organizations"
      aria-labelledby="orgs-title"
      className="rounded-sm bg-card px-4 py-3 space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="orgs-title" className="font-sans text-base font-medium">
            Mis organizaciones
          </h2>
          <p className="text-sm text-muted-foreground">
            {organizations.length === 0
              ? "Aún no participas en ninguna organización."
              : `${ready.length} activa${ready.length === 1 ? "" : "s"}${pending ? ` · ${pending} por configurar` : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {organizations.length > MAX_VISIBLE && (
            <Link
              href="/dashboard/organizaciones"
              className="rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Ver todas
            </Link>
          )}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex items-center rounded-sm bg-foreground px-2.5 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <p>
              Nueva <span className="hidden sm:inline">organización</span>
            </p>
          </button>
        </div>
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-sm bg-card">
          <EmptyState
            icon={Building2}
            title="Crea tu primera organización"
            description="Es el espacio donde vas a operar tu negocio con Zentro."
            actionLabel="Crear organización"
            onAction={() => setDialogOpen(true)}
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

      <NewOrganizationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};
