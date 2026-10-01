"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight, Shield, Store } from "lucide-react";
import {
  PERMISSION_MODULES,
  PERMISSION_LEVEL_LABELS,
  PERMISSION_LEVEL_ORDER,
  SENSITIVE_ACTIONS,
  type ModuleDomain,
  type TeamRole,
} from "@/lib/mock/team";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTeamStore } from "@/stores/team-store";
import { FormSection } from "../roles/FormSection";
import {
  DOMAIN_LABELS,
  DOMAIN_DESCRIPTIONS,
  DOMAIN_ICONS,
  MODULE_ICONS,
  MODULE_DESCRIPTIONS,
  LEVEL_DESCRIPTIONS,
} from "../roles/ModulePermissionsSection";

const DOMAIN_KEYS: ModuleDomain[] = [
  "operacion",
  "productos",
  "clientes",
  "finanzas",
  "presencia",
  "administracion",
];

interface MemberAccessMatrixProps {
  role: TeamRole | null;
  initialDomain?: ModuleDomain | null;
  onClearInitialDomain?: () => void;
}

/**
 * Vista «Acceso y permisos» del detalle de miembro.
 * Réplica exacta del layout y diseño de cards del Formulario de Rol:
 * 1. Permisos por módulo (cards por categoría + diálogo para ver módulos)
 * 2. Alcance de ubicaciones (todas las sucursales o sucursales específicas autorizadas)
 * 3. Acciones sensibles (lista dividida con badges de estado)
 */
export function MemberAccessMatrix({
  role,
  initialDomain,
  onClearInitialDomain,
}: MemberAccessMatrixProps) {
  const branches = useTeamStore((s) => s.branches);
  const [selectedDomain, setSelectedDomain] = useState<ModuleDomain | null>(
    initialDomain ?? null,
  );

  useEffect(() => {
    if (initialDomain) {
      setSelectedDomain(initialDomain);
    }
  }, [initialDomain]);

  const handleCloseDialog = () => {
    setSelectedDomain(null);
    onClearInitialDomain?.();
  };

  if (!role) return null;

  const isAllLocations =
    role.locationScope === "ALL" ||
    !role.locationIds ||
    role.locationIds.length === 0;

  const selectedDomainModules = selectedDomain
    ? PERMISSION_MODULES.filter((m) => m.domain === selectedDomain)
    : [];

  return (
    <div className="grid gap-6">
      {/* 1. Permisos por módulo */}
      <FormSection title="Permisos por módulo">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOMAIN_KEYS.map((domainKey) => {
            const DomainIcon = DOMAIN_ICONS[domainKey];
            const mods = PERMISSION_MODULES.filter(
              (m) => m.domain === domainKey,
            );
            const activeCount = mods.filter(
              (m) =>
                role.permissions[m.key] && role.permissions[m.key] !== "none",
            ).length;
            const isAllActive = activeCount === mods.length && mods.length > 0;
            const coverageRate =
              mods.length > 0
                ? Math.round((activeCount / mods.length) * 100)
                : 0;

            return (
              <article
                key={domainKey}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedDomain(domainKey)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedDomain(domainKey);
                  }
                }}
                className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary flex flex-col justify-between"
              >
                <div>
                  {/* Header: Ícono + Título + Módulos y Chevron */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <DomainIcon className="size-4.5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                          {DOMAIN_LABELS[domainKey]}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {mods.length}{" "}
                          {mods.length === 1 ? "módulo" : "módulos"}
                        </p>
                      </div>
                    </div>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors group-hover:bg-accent group-hover:text-primary">
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="mt-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                    {DOMAIN_DESCRIPTIONS[domainKey]}
                  </p>

                  {/* Estadísticas */}
                  <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Con acceso
                      </p>
                      <p className="mt-1 font-medium">
                        {activeCount} de {mods.length}{" "}
                        {activeCount > 0 && (
                          <span className="text-primary">· activos</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cobertura</p>
                      <p className="mt-1 font-medium">{coverageRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Footer: Resumen de módulos y StatusBadge */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <StatusBadge
                    status={
                      isAllActive
                        ? "activo"
                        : activeCount > 0
                          ? "parcial"
                          : "inactivo"
                    }
                    label={
                      isAllActive
                        ? "Acceso total"
                        : activeCount > 0
                          ? `${activeCount}/${mods.length} activos`
                          : "Sin acceso"
                    }
                  />
                </div>
              </article>
            );
          })}
        </div>
      </FormSection>

      {/* 2. Alcance de ubicaciones */}
      <FormSection title="Alcance de ubicaciones">
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-9 items-center justify-center rounded-lg text-muted-foreground">
                <Store className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isAllLocations
                    ? "Todas las ubicaciones"
                    : "Ubicaciones seleccionadas"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAllLocations
                    ? "Acceso total a sucursales y puntos de venta de la empresa"
                    : `${role.locationIds?.length ?? 0} de ${branches.length} sucursales autorizadas`}
                </p>
              </div>
            </div>
            <StatusBadge
              status={isAllLocations ? "activo" : "parcial"}
              label={
                isAllLocations
                  ? "Todas las sucursales"
                  : `${role.locationIds?.length ?? 0} asignadas`
              }
            />
          </div>

          {!isAllLocations && (
            <div className="space-y-2 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Sucursales autorizadas para este perfil:
              </p>
              <div className="flex flex-wrap gap-2">
                {branches.map((b) => {
                  const isAllowed = role.locationIds?.includes(b.id);
                  return (
                    <span
                      key={b.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 leading-none text-sm font-medium transition-all select-none",
                        isAllowed
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 bg-muted/40 text-muted-foreground/60 opacity-60",
                      )}
                    >
                      {isAllowed && <Check className="size-3.5 stroke-3" />}
                      <span>{b.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* 3. Acciones sensibles */}
      <FormSection
        title="Acciones sensibles"
        classNameCustom="py-2"
        action={
          <span className="text-xs text-muted-foreground">
            {role.sensitiveActions.length} de {SENSITIVE_ACTIONS.length}{" "}
            autorizadas
          </span>
        }
      >
        <div className="divide-y divide-border">
          {SENSITIVE_ACTIONS.map((action) => {
            const isAllowed = role.sensitiveActions.includes(action.key);
            return (
              <div
                key={action.key}
                className="flex items-start justify-between gap-3 py-3"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-medium text-foreground">
                    {action.label}
                  </p>
                  <p className="text-sm font-sans text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </div>
                <StatusBadge
                  status={isAllowed ? "activo" : "inactivo"}
                  label={isAllowed ? "Autorizado" : "No autorizado"}
                />
              </div>
            );
          })}
        </div>
      </FormSection>

      {/* Dialog para consultar los módulos de la categoría seleccionada */}
      <Dialog
        open={selectedDomain !== null}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-2xl max-h-[95vh] flex flex-col">
          {selectedDomain && (
            <>
              <DialogHeader>
                <DialogTitle>{DOMAIN_LABELS[selectedDomain]}</DialogTitle>
                <DialogDescription>
                  {DOMAIN_DESCRIPTIONS[selectedDomain]}
                </DialogDescription>
              </DialogHeader>

              {/* Grid de módulos como cards (estilo Permisos por módulo) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
                {selectedDomainModules.map((mod) => {
                  const Icon = MODULE_ICONS[mod.key] ?? Shield;
                  const level = role.permissions[mod.key] ?? "none";
                  const isNone = level === "none";

                  return (
                    <article
                      key={mod.key}
                      className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Ícono + Título + Subtítulo y StatusBadge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-2">
                            <span
                              className={cn(
                                "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                                !isNone
                                  ? "bg-accent text-primary"
                                  : "bg-accent text-muted-foreground group-hover:text-primary",
                              )}
                            >
                              <Icon className="size-4" />
                            </span>
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-medium group-hover:text-primary transition-colors text-foreground">
                                {mod.label}
                              </h4>
                              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                                Módulo del sistema
                              </p>
                            </div>
                          </div>

                          <StatusBadge
                            status={
                              isNone
                                ? "inactivo"
                                : level === "admin"
                                  ? "activo"
                                  : "parcial"
                            }
                            label={
                              level === "none"
                                ? "Sin acceso"
                                : level === "view"
                                  ? "Solo lectura"
                                  : level === "operate"
                                    ? "Operar"
                                    : "Control total"
                            }
                          />
                        </div>

                        {/* Descripción del módulo */}
                        <p className="mt-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                          {MODULE_DESCRIPTIONS[mod.key] ??
                            LEVEL_DESCRIPTIONS[level]}
                        </p>
                      </div>

                      {/* Footer: Chips de nivel (con el asignado resaltado) */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {PERMISSION_LEVEL_ORDER.map((lvl) => {
                          const isSelected = level === lvl;
                          return (
                            <span
                              key={lvl}
                              className={cn(
                                "inline-flex items-center rounded-md border px-2.25 py-1.75 text-sm leading-none font-medium transition-all select-none",
                                isSelected
                                  ? lvl === "none"
                                    ? "border-border bg-muted text-foreground font-medium"
                                    : lvl === "admin"
                                      ? "border-primary bg-primary text-primary-foreground font-medium"
                                      : "border-primary bg-primary/10 text-primary font-medium"
                                  : "border-border/60 bg-card text-muted-foreground/60 opacity-60",
                              )}
                            >
                              {PERMISSION_LEVEL_LABELS[lvl]}
                            </span>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>

              <DialogFooter className="gap-x-1 pt-2 border-t border-border/50">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleCloseDialog}
                  className="px-4 rounded-full cursor-pointer"
                >
                  Listo
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Resumen de acceso del miembro (vista Resumen): tarjetas por dominio estilo
 * Permisos por módulo con contador de módulos activos, cobertura y StatusBadge.
 */
export function MemberAccessSummary({
  role,
  onOpenAccess,
  onOpenDomain,
}: {
  role: TeamRole | null;
  onOpenAccess?: () => void;
  onOpenDomain?: (domain: ModuleDomain) => void;
}) {
  if (!role) return null;

  return (
    <FormSection title="Accesos">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DOMAIN_KEYS.map((domainKey) => {
          const DomainIcon = DOMAIN_ICONS[domainKey];
          const mods = PERMISSION_MODULES.filter((m) => m.domain === domainKey);
          const activeCount = mods.filter(
            (m) =>
              role.permissions[m.key] && role.permissions[m.key] !== "none",
          ).length;
          const isAllActive = activeCount === mods.length && mods.length > 0;
          const coverageRate =
            mods.length > 0 ? Math.round((activeCount / mods.length) * 100) : 0;

          const handleClick = () => {
            if (onOpenDomain) {
              onOpenDomain(domainKey);
            } else if (onOpenAccess) {
              onOpenAccess();
            }
          };

          return (
            <article
              key={domainKey}
              role="button"
              tabIndex={0}
              onClick={handleClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              }}
              className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary flex flex-col justify-between"
            >
              <div>
                {/* Header: Ícono + Título + Módulos y Chevron */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                      <DomainIcon className="size-4.5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                        {DOMAIN_LABELS[domainKey]}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {mods.length} {mods.length === 1 ? "módulo" : "módulos"}
                      </p>
                    </div>
                  </div>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors group-hover:bg-accent group-hover:text-primary">
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>

                {/* Descripción */}
                <p className="mt-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                  {DOMAIN_DESCRIPTIONS[domainKey]}
                </p>

                {/* Estadísticas */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Con acceso</p>
                    <p className="mt-1 font-medium">
                      {activeCount} de {mods.length}{" "}
                      {activeCount > 0 && (
                        <span className="text-primary">· activos</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cobertura</p>
                    <p className="mt-1 font-medium">{coverageRate}%</p>
                  </div>
                </div>
              </div>

              {/* Footer: Resumen de módulos y StatusBadge */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <StatusBadge
                  status={
                    isAllActive
                      ? "activo"
                      : activeCount > 0
                        ? "parcial"
                        : "inactivo"
                  }
                  label={
                    isAllActive
                      ? "Acceso total"
                      : activeCount > 0
                        ? `${activeCount}/${mods.length} activos`
                        : "Sin acceso"
                  }
                />
              </div>
            </article>
          );
        })}
      </div>
    </FormSection>
  );
}
