"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Building2,
  Boxes,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronsUpDownIcon,
  ClipboardList,
  Gift,
  Globe,
  House,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Package,
  ReceiptText,
  ScrollText,
  Settings,
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
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useWorkspaceContext } from "@/stores/workspace-context-store";
import { useWorkspaceNav } from "@/stores/workspace-nav-store";

/**
 * Sidebar del Tenant Workspace (/app/:slug).
 *
 * Arquitectura igual que el dashboard y el hub:
 * - Es un componente de presentación (cliente) que vive en `components/app/shared/`.
 * - No contiene lógica de negocio: la API para obtener el slug de la organización, el ítem
 *   activo y las secciones se resuelven localmente con `usePathname`.
 * - Las páginas (`page.tsx`) NO declaran el sidebar: lo monta el layout.
 *
 * Contexto actual (mockup de flujo): solo ámbito Tenant, un único rol (Owner),
 * sin switchers ni contexto de sucursal.
 *
 * Responsivamente: en desktop (>= lg) se muestra el sidebar estático; en pantallas
 * más pequeñas se oculta y pasa a ser un drawer (Sheet) controlado por
 * `useWorkspaceNav`. Al cruzar a desktop el drawer se cierra automáticamente y el
 * sidebar estático retoma el control.
 */
interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Operación",
    icon: ShoppingBag,
    items: [
      { label: "Punto de venta", href: "/pos", icon: ShoppingCart },
      { label: "Pedidos", href: "/pedidos", icon: ClipboardList },
    ],
  },
  {
    label: "Productos",
    icon: Package,
    items: [
      { label: "Catálogo", href: "/catalogo", icon: Package },
      { label: "Inventario", href: "/inventario", icon: Boxes },
      { label: "Compras", href: "/compras", icon: Truck },
      { label: "Promociones", href: "/promociones", icon: Gift },
    ],
  },
  {
    label: "Clientes",
    icon: Users,
    items: [
      { label: "CRM", href: "/clientes", icon: Users },
      { label: "Agenda", href: "/agenda", icon: CalendarDays },
      { label: "Formularios", href: "/formularios", icon: ClipboardList },
    ],
  },
  {
    label: "Finanzas",
    icon: Wallet,
    items: [
      { label: "Caja", href: "/caja", icon: Wallet },
      { label: "Facturación", href: "/facturacion", icon: ReceiptText },
      { label: "Reportes", href: "/reportes", icon: TrendingUp },
    ],
  },
  {
    label: "Presencia",
    icon: Globe,
    items: [
      { label: "Mi sitio web", href: "/presencia", icon: Globe },
      { label: "Blog", href: "/blog", icon: Newspaper },
      { label: "Marketing", href: "/marketing", icon: Megaphone },
      { label: "Marketplace", href: "/marketplace", icon: Store },
    ],
  },
  {
    label: "Administración",
    icon: Settings,
    items: [
      { label: "Equipo y permisos", href: "/equipo", icon: ShieldCheck },
      { label: "Configuración", href: "/configuracion", icon: Settings },
      { label: "Auditoría", href: "/auditoria", icon: ScrollText },
    ],
  },
];

/**
 * Cuerpo del sidebar (marca + navegación + tenant).
 * Se reutiliza tanto en el sidebar estático de desktop como en el drawer móvil,
 * para que la navegación sea idéntica en ambos tamaños.
 */
const SidebarContent = () => {
  const pathname = usePathname();
  const setMobileOpen = useWorkspaceNav((s) => s.setMobileOpen);

  // Slug del tenant desde la ruta (p. ej. /app/las-rocas/pos → las-rocas).
  const slug = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] ?? "org";
  }, [pathname]);

  const organizations = useDashboardStore((state) => state.organizations);
  const memberships = useDashboardStore((state) => state.memberships);
  const branches = useDashboardStore((state) => state.branches);
  const currentUser = useDashboardStore((state) => state.currentUser);
  const activeLocationByOrganization = useWorkspaceContext(
    (state) => state.activeLocationByOrganization,
  );
  const setActiveLocation = useWorkspaceContext(
    (state) => state.setActiveLocation,
  );

  const organization = organizations.find((item) => item.slug === slug);
  const membership = memberships.find(
    (item) =>
      item.organizationId === organization?.id &&
      item.userId === currentUser.id &&
      item.status === "ACTIVE",
  );
  const availableLocations = branches.filter(
    (item) =>
      item.organizationId === organization?.id && item.status === "ACTIVE",
  );
  const canUseGeneralView = membership?.roleKey === "OWNER" || membership?.roleKey === "ADMIN";
  const storedLocationId = organization
    ? activeLocationByOrganization[organization.id]
    : null;
  const activeLocation = availableLocations.find(
    (item) => item.id === storedLocationId,
  );
  const activeContextLabel = activeLocation?.name ?? "Vista general";

  useEffect(() => {
    if (!organization || canUseGeneralView || activeLocation) return;
    const firstLocation = availableLocations[0];
    if (firstLocation) setActiveLocation(organization.id, firstLocation.id);
  }, [activeLocation, availableLocations, canUseGeneralView, organization, setActiveLocation]);

  // Detección del ítem activo: la raíz del workspace (/app/:slug) activa
  // solamente «Resumen». El resto activa para sí mismo y sus sub-rutas.
  const isActive = (href: string) =>
    href === ""
      ? pathname === `/app/${slug}`
      : pathname === `/app/${slug}${href}` ||
        pathname.startsWith(`/app/${slug}${href}/`);

  const groupActive = (group: NavGroup) =>
    group.items.some((i) => isActive(i.href));

  // Grupos colapsados. Por defecto solo el grupo de la ruta activa comienza
  // desplegado; el resto inicia cerrado.
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    const closed = navGroups
      .filter((g) => !groupActive(g))
      .map((g) => g.label);
    return new Set(closed);
  });

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  // Al navegar desde el drawer móvil, cerrarlo (el layout/route cambia de página).
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="px-5">
        <h1 className="text-lg pt-4 mb-2 px-4 font-semibold font-sans">Zentro</h1>
      </div>

      <div className="flex h-full flex-1 flex-col gap-1.5 overflow-y-auto px-5 pt-2 py-5">
        {/* Resumen (landing de la org) */}
        <Link
          href={`/app/${slug}`}
          onClick={closeMobile}
          className={cn(
            "flex items-center gap-x-3 rounded-lg px-4 py-2.25 text-sm font-heading transition-colors text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-secondary",
            isActive("") && "bg-secondary text-primary!",
          )}
        >
          <LayoutDashboard className="size-4" />
          Overview
        </Link>

        {/* Grupo de secciones */}
        {navGroups.map((group) => {
          const opened = groupActive(group) || !collapsed.has(group.label);
          return (
            <div key={group.label} className="">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "flex items-center justify-between w-full gap-x-2.5 rounded-lg px-4 py-2.25 text-sm font-heading transition-colors text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white",
                  groupActive(group)
                    ? "text-primary"
                    : "hover:bg-secondary hover:text-primary",
                  opened && "bg-secondary text-primary!",
                )}
              >
                <div className="flex items-center gap-x-3">
                  <group.icon className="size-4" />
                  {group.label}
                </div>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    opened && "rotate-180",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                  opened ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="min-h-0">
                  <ul className="mt-2 flex flex-col gap-1 ml-6 pl-2 border-l border-border">
                    {group.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={`/app/${slug}${item.href}`}
                            onClick={closeMobile}
                            className={cn(
                              "flex items-center gap-x-2.5 rounded-lg px-4 pl-2.75 py-2.25 text-sm font-heading transition-colors hover:bg-secondary text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white",
                              active && "bg-secondary text-primary!",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Organización y contexto operativo */}
      <div className="border-t border-border p-5">
        <Popover>
          <PopoverTrigger
            className="flex w-full cursor-pointer items-center gap-x-2 rounded-lg p-1 text-start font-heading outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {organization?.name ?? "Organización"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {activeContextLabel}
              </p>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="start"
            sideOffset={10}
            className="w-64 p-2"
          >
            <div className="px-2 pb-2 pt-1">
              <p className="truncate text-sm font-medium">
                {organization?.name ?? "Organización"}
              </p>
              <p className="text-xs text-muted-foreground">Contexto de trabajo</p>
            </div>

            <div className="flex flex-col gap-0.5">
              {canUseGeneralView && organization && (
                <PopoverClose
                  className="flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary"
                  onClick={() => setActiveLocation(organization.id, null)}
                >
                  <House className="size-4 text-muted-foreground" />
                  <span>Vista general</span>
                  {!activeLocation && <Check className="ml-auto size-4 text-primary" />}
                </PopoverClose>
              )}

              {availableLocations.map((location) => (
                <PopoverClose
                  key={location.id}
                  className="flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary"
                  onClick={() =>
                    organization && setActiveLocation(organization.id, location.id)
                  }
                >
                  <Store className="size-4 text-muted-foreground" />
                  <span className="truncate">{location.name}</span>
                  {activeLocation?.id === location.id && (
                    <Check className="ml-auto size-4 text-primary" />
                  )}
                </PopoverClose>
              ))}
            </div>

            <div className="my-2 border-t border-border" />

            <div className="flex flex-col gap-0.5">
              <PopoverClose
                render={<Link href={`/app/${slug}/configuracion`} />}
                nativeButton={false}
                onClick={closeMobile}
                className="flex items-center gap-x-2 rounded-md px-2 py-2 text-sm hover:bg-secondary"
              >
                <Settings className="size-4 text-muted-foreground" />
                Configuración del negocio
              </PopoverClose>
              <PopoverClose
                render={<Link href="/dashboard/organizaciones" />}
                nativeButton={false}
                onClick={closeMobile}
                className="flex items-center gap-x-2 rounded-md px-2 py-2 text-sm hover:bg-secondary"
              >
                <Building2 className="size-4 text-muted-foreground" />
                Cambiar organización
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const mobileOpen = useWorkspaceNav((s) => s.mobileOpen);
  const setMobileOpen = useWorkspaceNav((s) => s.setMobileOpen);

  // Cierra el drawer al pasar a desktop (>= lg): el sidebar estático retoma el
  // control y el Sheet nunca queda abierto por encima de él.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => mql.matches && setMobileOpen(false);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [setMobileOpen]);

  return (
    <>
      <aside className="hidden w-70 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Drawer móvil (solo se controla desde pantallas < lg). */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-72 max-w-xs p-0 gap-0 lg:hidden"
          showCloseButton={false}
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};
