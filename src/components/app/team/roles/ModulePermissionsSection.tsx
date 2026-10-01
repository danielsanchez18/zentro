"use client";

import { useMemo, useState } from "react";
import {
  Antenna,
  BadgePercent,
  Calendar,
  Calculator,
  CheckCheck,
  ChevronRight,
  FileClock,
  FileSpreadsheet,
  Globe,
  Layers,
  Megaphone,
  Newspaper,
  PackageSearch,
  Receipt,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
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
import {
  PERMISSION_MODULES,
  PERMISSION_LEVEL_LABELS,
  PERMISSION_LEVEL_ORDER,
  type ModuleDomain,
  type PermissionLevel,
  type PermissionModuleKey,
} from "@/lib/mock/team";
import { FormSection } from "./FormSection";

export const DOMAIN_LABELS: Record<ModuleDomain, string> = {
  operacion: "Operación y ventas",
  productos: "Productos e inventario",
  clientes: "Clientes y agenda",
  finanzas: "Finanzas",
  presencia: "Canales y contenido",
  administracion: "Administración",
};

export const DOMAIN_DESCRIPTIONS: Record<ModuleDomain, string> = {
  operacion: "Punto de venta, pedidos, caja y facturación del negocio.",
  productos: "Catálogo, inventario de stock, compras y promociones.",
  clientes: "Gestión de clientes (CRM), agenda y formularios de contacto.",
  finanzas: "Informes de ventas, balances y métricas financieras.",
  presencia: "Canales online, sitio web, blog, marketing y marketplaces.",
  administracion: "Gestión del equipo, configuración global y auditoría.",
};

export const DOMAIN_ICONS: Record<ModuleDomain, LucideIcon> = {
  operacion: ShoppingBag,
  productos: PackageSearch,
  clientes: Users,
  finanzas: Calculator,
  presencia: Megaphone,
  administracion: Shield,
};

export const MODULE_ICONS: Record<PermissionModuleKey, LucideIcon> = {
  pos: Store,
  pedidos: ShoppingBag,
  caja: Wallet,
  facturacion: Receipt,
  catalogo: Layers,
  inventario: PackageSearch,
  compras: Truck,
  promociones: BadgePercent,
  clientes: Users,
  agenda: Calendar,
  formularios: FileSpreadsheet,
  reportes: TrendingUp,
  presencia: Globe,
  canales: Antenna,
  blog: Newspaper,
  marketing: Megaphone,
  marketplace: ShoppingCart,
  equipo: ShieldCheck,
  configuracion: Settings,
  auditoria: FileClock,
};

export const MODULE_DESCRIPTIONS: Record<PermissionModuleKey, string> = {
  pos: "Punto de venta y registro rápido de ventas directas.",
  pedidos: "Gestión, estados y seguimiento de pedidos de clientes.",
  caja: "Control de turnos, aperturas, cierres y arqueos de caja.",
  facturacion: "Emisión y gestión de comprobantes tributarios electrónicos.",
  catalogo: "Administración de productos, categorías y variantes.",
  inventario: "Control de stock, alertas y movimientos entre sucursales.",
  compras: "Órdenes de compra y recepción de mercadería de proveedores.",
  promociones: "Creación y aplicación de descuentos, cupones y ofertas.",
  clientes: "Directorio de clientes, historial de compras y preferencias.",
  agenda: "Programación de citas, reservas y gestión de turnos.",
  formularios: "Formularios de contacto, captación y encuestas.",
  reportes: "Informes de ventas, ingresos y métricas del negocio.",
  presencia: "Página web y tienda online propias.",
  canales: "Canales de venta propios e integraciones externas.",
  blog: "Artículos, noticias y contenidos para clientes.",
  marketing: "Campañas de correo, promociones masivas y fidelización.",
  marketplace: "Integraciones con canales de venta externos.",
  equipo: "Gestión de miembros, roles y permisos de acceso.",
  configuracion: "Ajustes generales, sucursales y preferencias del sistema.",
  auditoria: "Historial detallado de acciones y seguridad del equipo.",
};

export const LEVEL_DESCRIPTIONS: Record<PermissionLevel, string> = {
  none: "Sin acceso a este módulo",
  view: "Solo visualización de datos y reportes",
  operate: "Crear, editar y procesar transacciones",
  admin: "Acceso total y configuración avanzada",
};

interface ModulePermissionsSectionProps {
  permissions: Record<PermissionModuleKey, PermissionLevel>;
  onChange: (key: PermissionModuleKey, level: PermissionLevel) => void;
}

export function ModulePermissionsSection({
  permissions,
  onChange,
}: ModulePermissionsSectionProps) {
  const [selectedDomain, setSelectedDomain] = useState<ModuleDomain | null>(
    null,
  );

  const domainKeys = useMemo(
    () => Object.keys(DOMAIN_LABELS) as ModuleDomain[],
    [],
  );

  const assignedCount = useMemo(
    () => Object.values(permissions).filter((lvl) => lvl !== "none").length,
    [permissions],
  );

  const selectedDomainModules = useMemo(() => {
    if (!selectedDomain) return [];
    return PERMISSION_MODULES.filter((m) => m.domain === selectedDomain);
  }, [selectedDomain]);

  return (
    <>
      <FormSection title="Permisos por módulo">
        {/* Cabecera resumen */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border/50">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium">
            <CheckCheck className="size-4 text-primary" />
            <span className="font-semibold text-primary">
              {assignedCount}
            </span>{" "}
            de {PERMISSION_MODULES.length} módulos con acceso activo
          </span>
          <span className="text-xs text-muted-foreground">
            Haz clic en un área para configurar sus módulos
          </span>
        </div> */}

        {/* Grid de Categorías como Cards (estilo FormCard) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {domainKeys.map((domainKey) => {
            const DomainIcon = DOMAIN_ICONS[domainKey];
            const mods = PERMISSION_MODULES.filter(
              (m) => m.domain === domainKey,
            );
            const activeCount = mods.filter(
              (m) => permissions[m.key] && permissions[m.key] !== "none",
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

      {/* Dialog para configurar los módulos de la categoría seleccionada */}
      <Dialog
        open={selectedDomain !== null}
        onOpenChange={(open) => !open && setSelectedDomain(null)}
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
                  const level = permissions[mod.key] ?? "none";
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

                      {/* Footer: Chips para seleccionar nivel de permiso */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {PERMISSION_LEVEL_ORDER.map((lvl) => {
                          const isSelected = level === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => onChange(mod.key, lvl)}
                              className={cn(
                                "inline-flex items-center rounded-md border px-2.25 py-1.75 text-sm leading-none font-medium transition-all cursor-pointer",
                                isSelected
                                  ? lvl === "none"
                                    ? "border-border bg-muted text-foreground font-medium"
                                    : lvl === "admin"
                                      ? "border-primary bg-primary text-primary-foreground font-medium"
                                      : "border-primary bg-primary/10 text-primary font-medium"
                                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-foreground",
                              )}
                            >
                              {PERMISSION_LEVEL_LABELS[lvl]}
                            </button>
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
                  onClick={() => setSelectedDomain(null)}
                  className="px-4 rounded-full cursor-pointer"
                >
                  Listo
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
