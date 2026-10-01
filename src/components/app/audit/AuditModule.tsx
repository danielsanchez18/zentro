"use client";

import { useMemo, useState } from "react";
import { History, SearchX, ShieldAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Paginator } from "@/components/app/shared/Paginator";
import { useWorkspaceContextView } from "@/hooks/use-workspace-context";
import { PERMISSION_MODULES, type PermissionModuleKey } from "@/lib/mock/team";
import { useAuditStore } from "@/stores/audit-store";
import { useLocationsStore } from "@/stores/locations-store";
import { permissionAtLeast } from "@/lib/workspace/context";
import { AuditKPI } from "./AuditKPI";
import {
  AuditFiltersBar,
  DEFAULT_AUDIT_FILTERS,
  type AuditFilters,
} from "./AuditFiltersBar";
import { AuditTable } from "./AuditTable";

const PAGE_SIZE = 12;

interface AuditModuleProps {
  slug: string;
}

/** Corta el periodo a una fecha ISO a partir del filtro de periodo. */
const periodStart = (period: AuditFilters["period"]): number | null => {
  const now = new Date();
  if (period === "hoy") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }
  if (period === "7d") return now.getTime() - 7 * 24 * 60 * 60 * 1000;
  if (period === "30d") return now.getTime() - 30 * 24 * 60 * 60 * 1000;
  return null;
};

/**
 * Módulo Auditoría del workspace (/app/:slug/auditoria).
 *
 * Registro append-only de actividad: quién hizo qué, cuándo y en qué módulo.
 * Solo lectura por diseño. En el prototipo consume la semilla de
 * `audit-store`; el permiso `auditoria` sigue el mismo modelo del resto de
 * módulos (`none` por defecto, `admin` para Owner/Administrador).
 */
export const AuditModule = ({ slug }: AuditModuleProps) => {
  const view = useWorkspaceContextView(slug);
  const events = useAuditStore((state) => state.events);
  const locations = useLocationsStore((state) => state.locations);

  const [filters, setFilters] = useState<AuditFilters>(DEFAULT_AUDIT_FILTERS);
  const [page, setPage] = useState(1);

  const organizationId = view.organization?.id;
  const canView = view.canViewModule("/auditoria");

  const orgEvents = useMemo(
    () =>
      organizationId
        ? events
            .filter((event) => event.organizationId === organizationId)
            .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
        : [],
    [events, organizationId],
  );

  const actors = useMemo(
    () => [...new Set(orgEvents.map((event) => event.actor))].sort(),
    [orgEvents],
  );

  const moduleOptions = useMemo(() => {
    const present = new Set(orgEvents.map((event) => event.module));
    return PERMISSION_MODULES.filter((m) => present.has(m.key)).map((m) => ({
      key: m.key as PermissionModuleKey,
      label: m.label,
    }));
  }, [orgEvents]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const from = periodStart(filters.period);
    return orgEvents.filter((event) => {
      if (from !== null && new Date(event.at).getTime() < from) return false;
      if (filters.module !== "all" && event.module !== filters.module)
        return false;
      if (filters.type !== "all" && event.type !== filters.type) return false;
      if (filters.severity !== "all" && event.severity !== filters.severity)
        return false;
      if (filters.actor !== "all" && event.actor !== filters.actor)
        return false;
      if (q) {
        const haystack = [
          event.description,
          event.actor,
          event.actorRole ?? "",
          event.target ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [orgEvents, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const locationName = (locationId?: string | null) => {
    if (!locationId) return null;
    return (
      locations.find((location) => location.id === locationId)?.name ?? null
    );
  };

  const handleFiltersChange = (next: AuditFilters) => {
    setFilters(next);
    setPage(1);
  };

  // --- Sin organización o sin permiso: no renderizar el log ---
  if (!organizationId) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <h1 className="text-lg font-medium">Auditoría</h1>
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
            title="Sin acceso a la auditoría"
            description={`Tu rol (${view.role.name}) no tiene permiso para ver el registro de auditoría de esta organización. Solo Owner y Administrador pueden entrar.`}
          />
        </div>
      </div>
    );
  }

  const isAdminLevel = permissionAtLeast(view.permissions.auditoria, "admin");

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">Auditoría</h1>
          <p className="text-sm text-muted-foreground">
            Registro de actividad de {view.organization?.name}: quién hizo qué,
            cuándo y en qué módulo. Los eventos no se pueden editar ni eliminar.
          </p>
        </div>
      </div>

      <AuditKPI events={filtered} />

      <div className="sm:p-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card space-y-5">
        <AuditFiltersBar
          filters={filters}
          onChange={handleFiltersChange}
          moduleOptions={moduleOptions}
          actors={actors}
          totalMatching={filtered.length}
        />

        {orgEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border">
            <EmptyState
              icon={History}
              title="Aún no hay actividad registrada"
              description="Cuando tu equipo registre ventas, cambios de rol o ajustes de inventario, aparecerán aquí."
            />
          </div>
        ) : pageItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border">
            <EmptyState
              icon={SearchX}
              title="Sin resultados"
              description="No encontramos eventos que coincidan con los filtros aplicados. Prueba limpiándolos o ampliando el periodo."
              actionLabel="Limpiar filtros"
              onAction={() => handleFiltersChange({ ...DEFAULT_AUDIT_FILTERS })}
            />
          </div>
        ) : (
          <>
            <AuditTable events={pageItems} locationName={locationName} />

            <Paginator
              totalResults={filtered.length}
              pageSize={PAGE_SIZE}
              currentPage={currentPage}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};
