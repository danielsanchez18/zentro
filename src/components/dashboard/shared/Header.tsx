"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, LogOut, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/shared/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useDashboardStore } from "@/stores/dashboard-store";
import { HubLogo } from "@/components/dashboard/shared/HubLogo";
import { UserAvatar } from "@/components/dashboard/shared/UserAvatar";
import { getActiveNavItem } from "@/components/dashboard/shared/nav";
import {
  useLogout,
  usePendingInvitations,
} from "@/components/dashboard/shared/Sidebar";

const ACCOUNT_LINKS = [
  { href: "/dashboard/cuenta", label: "Mi cuenta", icon: UserRound },
  {
    href: "/dashboard/suscripciones",
    label: "Suscripciones",
    icon: CreditCard,
  },
];

const AccountMenu = () => {
  const isDesktop = useIsDesktop();
  const user = useDashboardStore((state) => state.currentUser);
  const handleLogout = useLogout();
  const trigger = (
    <span className="flex size-10 items-center justify-center rounded-full">
      <UserAvatar name={user.name} />
    </span>
  );

  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Menú de cuenta"
          className="cursor-pointer rounded-full"
        >
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <DropdownMenuSeparator />
          {ACCOUNT_LINKS.map((link) => (
            <DropdownMenuItem
              key={link.href}
              render={<Link href={link.href} />}
              className="cursor-pointer px-3 py-2"
            >
              <link.icon className="size-4" />
              {link.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger
        aria-label="Menú de cuenta"
        className="cursor-pointer rounded-full"
      >
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex-row items-center gap-3">
          <UserAvatar name={user.name} className="size-11" />
          <div className="min-w-0">
            <DrawerTitle className="truncate">{user.name}</DrawerTitle>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DrawerHeader>
        <div className="space-y-1 px-3 pb-5">
          {ACCOUNT_LINKS.map((link) => (
            <DrawerClose
              key={link.href}
              render={<Link href={link.href} />}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted"
            >
              <link.icon className="size-5 text-muted-foreground" />
              {link.label}
            </DrawerClose>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-destructive hover:bg-muted"
          >
            <LogOut className="size-5" />
            Cerrar sesión
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const pendingInvitations = usePendingInvitations();
  const current = getActiveNavItem(pathname);

  return (
    <div className="p-2">
      <header className="sticky top-0 z-30 bg-card rounded-sm">
        <div className="flex items-center gap-3 px-4 py-2">
          <HubLogo className="lg:hidden" />
          {/* <h1 className="hidden text-lg font-semibold lg:block">
            {current?.label ?? "Hub"}
          </h1> */}

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              href="/dashboard/invitaciones"
              aria-label={
                pendingInvitations > 0
                  ? "Notificaciones: tienes novedades sin leer"
                  : "Notificaciones"
              }
              className="relative flex size-10 items-center justify-center rounded-sm bg-muted text-foreground transition-colors hover:bg-muted"
            >
              <Bell className="size-4.5" />
              {/* Notificaciones: solo un punto de "sin leer"; el número vive en Invitaciones.
                  TODO(0.2): usar el conteo real cuando exista la entidad de notificaciones. */}
              {pendingInvitations > 0 && (
                <span className="absolute top-2 right-2 size-2.5 rounded-full bg-(--hub-accent) ring-2 ring-muted" />
              )}
            </Link>
            <AccountMenu />
          </div>
        </div>
      </header>
    </div>
  );
};
