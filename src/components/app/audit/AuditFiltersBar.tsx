"use client";

import { X } from "lucide-react";
import { Search } from "@/components/app/shared/Search";
import { FilterSheet } from "@/components/app/shared/FilterSheet";
import {
  AUDIT_EVENT_TYPES,
  AUDIT_SEVERITY_LABELS,
  type AuditEventType,
  type AuditSeverity,
} from "@/lib/mock/audit";
import type { PermissionModuleKey } from "@/lib/mock/team";

/** Períodos relativos al día de hoy. */
export type AuditPeriod = "all" | "hoy" | "7d" | "30d";

export const AUDIT_PERIOD_LABELS: Record<AuditPeriod, string> = {
  all: "Todo el historial",
  hoy: "Hoy",
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
};

export interface AuditFilters {
  query: string;
  module: PermissionModuleKey | "all";
  type: AuditEventType | "all";
  severity: AuditSeverity | "all";
  actor: string | "all";
  period: AuditPeriod;
}

export const DEFAULT_AUDIT_FILTERS: AuditFilters = {
  query: "",
  module: "all",
  type: "all",
  severity: "all",
  actor: "all",
  period: "all",
};

interface AuditFiltersBarProps {
  filters: AuditFilters;
  onChange: (next: AuditFilters) => void;
  /** Módulos presentes en los eventos (evita opciones sin resultados). */
  moduleOptions: { key: PermissionModuleKey; label: string }[];
  actors: string[];
  totalMatching: number;
}

function FilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-2 leading-none text-[13px] font-medium text-foreground hover:bg-accent hover:border-primary/40 transition-colors"
    >
      <span>{label}</span>
      <X className="size-3 text-muted-foreground hover:text-foreground" />
    </button>
  );
}

/**
 * Barra de filtros del módulo Auditoría con FilterSheet (panel lateral deslizante)
 * y búsqueda libre, siguiendo el estándar de Agenda.
 */
export const AuditFiltersBar = ({
  filters,
  onChange,
  moduleOptions,
  actors,
  totalMatching,
}: AuditFiltersBarProps) => {
  const set = <K extends keyof AuditFilters>(key: K, value: AuditFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const activeCount = [
    filters.period !== "all",
    filters.module !== "all",
    filters.type !== "all",
    filters.severity !== "all",
    filters.actor !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-3 font-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full min-w-60 flex-1 md:max-w-md">
          <Search
            placeholder="Buscar por descripción, actor o entidad..."
            value={filters.query}
            onChange={(e) => set("query", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterSheet
            activeCount={activeCount}
            onClear={() =>
              onChange({
                ...DEFAULT_AUDIT_FILTERS,
                query: filters.query,
              })
            }
            title="Filtros de Auditoría"
            description="Refina los registros de auditoría por periodo, módulo, tipo de acción, gravedad y actor."
            groups={[
              {
                label: "Periodo",
                selected: filters.period,
                onSelect: (v) => set("period", v as AuditPeriod),
                options: (
                  Object.keys(AUDIT_PERIOD_LABELS) as AuditPeriod[]
                ).map((p) => ({
                  label: AUDIT_PERIOD_LABELS[p],
                  value: p,
                })),
              },
              {
                label: "Módulo",
                selected: filters.module,
                onSelect: (v) =>
                  set("module", v as PermissionModuleKey | "all"),
                options: [
                  { label: "Todos los módulos", value: "all" },
                  ...moduleOptions.map(({ key, label }) => ({
                    label,
                    value: key,
                  })),
                ],
              },
              {
                label: "Tipo de evento",
                selected: filters.type,
                onSelect: (v) => set("type", v as AuditEventType | "all"),
                options: [
                  { label: "Todos los tipos", value: "all" },
                  ...AUDIT_EVENT_TYPES.map((t) => ({
                    label: t.label,
                    value: t.key,
                  })),
                ],
              },
              {
                label: "Gravedad",
                selected: filters.severity,
                onSelect: (v) => set("severity", v as AuditSeverity | "all"),
                options: [
                  { label: "Toda gravedad", value: "all" },
                  { label: AUDIT_SEVERITY_LABELS.routine, value: "routine" },
                  {
                    label: AUDIT_SEVERITY_LABELS.sensitive,
                    value: "sensitive",
                  },
                ],
              },
              {
                label: "Actor",
                selected: filters.actor,
                onSelect: (v) => set("actor", v),
                options: [
                  { label: "Todos los actores", value: "all" },
                  ...actors.map((actor) => ({
                    label: actor,
                    value: actor,
                  })),
                ],
              },
            ]}
          />
        </div>
      </div>

      {/* Chips de filtros activos */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {filters.period !== "all" && (
            <FilterChip
              label={`Periodo: ${AUDIT_PERIOD_LABELS[filters.period]}`}
              onClear={() => set("period", "all")}
            />
          )}
          {filters.module !== "all" && (
            <FilterChip
              label={`Módulo: ${
                moduleOptions.find((m) => m.key === filters.module)?.label ??
                filters.module
              }`}
              onClear={() => set("module", "all")}
            />
          )}
          {filters.type !== "all" && (
            <FilterChip
              label={`Tipo: ${
                AUDIT_EVENT_TYPES.find((t) => t.key === filters.type)?.label ??
                filters.type
              }`}
              onClear={() => set("type", "all")}
            />
          )}
          {filters.severity !== "all" && (
            <FilterChip
              label={`Gravedad: ${
                AUDIT_SEVERITY_LABELS[filters.severity] ?? filters.severity
              }`}
              onClear={() => set("severity", "all")}
            />
          )}
          {filters.actor !== "all" && (
            <FilterChip
              label={`Actor: ${filters.actor}`}
              onClear={() => set("actor", "all")}
            />
          )}
        </div>
      )}
    </div>
  );
};
