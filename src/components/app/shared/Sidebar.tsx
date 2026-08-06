"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, User, MapPin, ChevronDown, Check } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useTenantStore } from "@/stores/tenant-store";
import { useBranchStore } from "@/stores/branch-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAV } from "./navigation";
import { PlanBanner } from "./PlanBanner";

interface SidebarProps {
  /** En móvil el sidebar se oculta detrás de un overlay controlado por el layout. */
  mobile?: boolean;
  onClose?: () => void;
}

/**
 * Sidebar del Tenant Dashboard. Muestra la empresa activa y su sucursal actual
 * (estático, centrado solo en el tenant), la navegación por módulos y el
 * usuario. En móvil se dibuja como panel deslizante (Sheet).
 */
export const Sidebar = ({ mobile = false, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const activeTenant = useTenantStore((s) => s.activeTenant);
  const branches = useBranchStore((s) => s.branches);
  const activeBranchId = useBranchStore((s) => s.activeBranchId);
  const setActiveBranchById = useBranchStore((s) => s.setActiveBranchId);

  const activeBranch =
    branches.find((b) => b.id === activeBranchId) ?? branches[0];

  // Solo cambia de sucursal si el tenant tiene más de una.
  const hasMultipleBranches = branches.length > 1;

  // Rol del usuario en la empresa actual (por ahora "Owner"; TODO 0.2 dinámico).
  const role = "Owner";
  const email = user?.email ?? "[EMAIL_ADDRESS]";

  // La sección activa se deriva del primer segmento después de /app/:slug.
  const segments = pathname.split("/");
  const activeKey = segments.length > 3 ? segments[3] : "overview";

  const tenantName = activeTenant?.name ?? "Mi organización";
  const tenantSlug = activeTenant?.slug ?? "";

  return (
    <>
      <aside
        className={`${
          mobile
            ? "flex h-full w-full flex-col"
            : "hidden lg:flex w-xs flex-col border-r border-border bg-background"
        }`}
      >
        {/* Cabecera: empresa + sucursal activa. Si el tenant tiene varias
            sucursales se muestra un dropdown para cambiar; si no, texto estático. */}
        <div className="px-3 py-2">
          {hasMultipleBranches ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Cambiar de sucursal"
              >
                <div className="flex size-10 min-w-10 items-center justify-center rounded-lg bg-accent">
                  <Store className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium">{tenantName}</p>
                  <p className="line-clamp-1 flex items-center gap-x-1 text-xs font-normal text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    {activeBranch?.name ?? "Sucursal"}
                  </p>
                </div>
                <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right" sideOffset={8} className="w-52 p-1">
                {branches.map((branch) => {
                  const isActive = branch.id === activeBranch?.id;
                  return (
                    <DropdownMenuItem
                      key={branch.id}
                      onSelect={() => setActiveBranchById(branch.id)}
                      className="cursor-pointer px-2 py-2"
                    >
                      <MapPin className="size-4" />
                      <span className="flex-1 line-clamp-1">{branch.name}</span>
                      {isActive && <Check className="ml-auto size-4 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5">
              <div className="flex size-10 min-w-10 items-center justify-center rounded-lg bg-accent">
                <Store className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-medium">{tenantName}</p>
                <p className="line-clamp-1 flex items-center gap-x-1 text-xs font-normal text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {activeBranch?.name ?? "Sucursal"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 flex flex-col gap-y-7 overflow-y-auto px-5 py-5">
          {APP_NAV.map((section, i) => (
            <div key={i} className="flex flex-col">
              {section.title && (
                <p className="mb-2 px-4 text-xs font-heading font-medium uppercase tracking-wide">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const active = item.key === activeKey;
                const Icon = item.icon;
                const href = tenantSlug ? item.href(tenantSlug) : "#";
                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={mobile ? onClose : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-x-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent text-foreground border-l-2 border-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="line-clamp-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Plan actual del tenant: banner compacto descartable */}
        {activeTenant && (
          <div className="border-t border-border px-5 py-5">
            <PlanBanner
              slug={tenantSlug}
              plan={activeTenant.plan ?? "Sin plan"}
              status={activeTenant.subscriptionStatus}
              trialEndsAt={activeTenant.trialEndsAt}
            />
          </div>
        )}
      </aside>
    </>
  );
};
