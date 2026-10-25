"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HUB_NAV_ITEMS, isNavItemActive } from "@/components/dashboard/shared/nav";
import { useLogout, usePendingInvitations } from "@/components/dashboard/shared/Sidebar";
import { hubMenuItem } from "@/components/dashboard/shared/styles";

/** Las 4 secciones de uso frecuente van en la barra; el resto en "Más". */
const PRIMARY_HREFS = [
  "/dashboard",
  "/dashboard/organizaciones",
  "/dashboard/invitaciones",
  "/dashboard/cuenta",
];

const tabClass = (active: boolean) =>
  cn(
    "relative flex flex-1 flex-col items-center gap-1 rounded-(--hub-radius-control) py-1.5 text-[0.7rem] font-medium transition-colors",
    active ? "text-foreground" : "text-muted-foreground",
  );

/**
 * Navegación inferior estilo app (debajo de `lg`).
 */
export const MobileTabBar = () => {
  const pathname = usePathname();
  const pendingInvitations = usePendingInvitations();
  const handleLogout = useLogout();
  const primary = HUB_NAV_ITEMS.filter((item) => PRIMARY_HREFS.includes(item.href));
  const secondary = HUB_NAV_ITEMS.filter((item) => !PRIMARY_HREFS.includes(item.href));
  const moreActive = secondary.some((item) => isNavItemActive(item.href, pathname));

  return (
    <nav
      data-demo="navigation"
      aria-label="Navegación del hub"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-stretch gap-1 px-2 py-1.5">
        {primary.map((item) => {
          const active = isNavItemActive(item.href, pathname);
          const count = item.badge === "invitations" ? pendingInvitations : 0;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={tabClass(active)}>
              <span className={cn("relative flex h-7 w-12 items-center justify-center rounded-full transition-colors", active && "bg-hub-accent text-hub-accent-foreground")}>
                <item.icon className="size-4.5" />
                {count > 0 && (
                  <span className="absolute -top-1 right-1 flex size-4 items-center justify-center rounded-full bg-hub-accent text-[0.6rem] font-semibold text-hub-accent-foreground ring-2 ring-card">
                    {count}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}

        <Drawer>
          <DrawerTrigger className={tabClass(moreActive)}>
            <span className={cn("flex h-7 w-12 items-center justify-center rounded-full", moreActive && "bg-hub-accent text-hub-accent-foreground")}>
              <MoreHorizontal className="size-4.5" />
            </span>
            Más
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Más opciones</DrawerTitle>
            </DrawerHeader>
            <div className="space-y-1 px-3 pb-5">
              {secondary.map((item) => (
                <DrawerClose
                  key={item.href}
                  nativeButton={false}
                  render={<Link href={item.href} />}
                  className={cn(
                    hubMenuItem,
                    isNavItemActive(item.href, pathname) && "bg-muted",
                  )}
                >
                  <item.icon className="size-5 text-muted-foreground" />
                  {item.label}
                </DrawerClose>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className={cn(hubMenuItem, "text-destructive")}
              >
                <LogOut className="size-5" />
                Cerrar sesión
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
};
