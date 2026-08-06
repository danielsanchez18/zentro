"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CircleHelp, Store } from "lucide-react";
import { ThemeToggle } from "@/components/landing/shared/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Search, User, LogOut, Bell } from "lucide-react";
import { useTenantStore } from "@/stores/tenant-store";
import { useAuthStore } from "@/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutDialog } from "@/components/dashboard/shared/LogoutDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  /** Migas de pan del tenant (Breadcrumb.tsx). Desktop: a la izquierda. */
  breadcrumb?: ReactNode;
}

/**
 * Header del Tenant Dashboard.
 * - Mobile: logo del tenant (igual al sidebar).
 * - Desktop: breadcrumb a la izquierda.
 * - A la derecha: avatar interactivo (dropdown de acciones). El mismo usuario
 *   aparece read-only al pie del sidebar.
 */
export const Header = ({ breadcrumb }: HeaderProps) => {
  const activeTenant = useTenantStore((s) => s.activeTenant);
  const user = useAuthStore((s) => s.user);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const tenantName = activeTenant?.name ?? "Mi organización";
  const tenantSlug = activeTenant?.slug ?? "";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between gap-x-3 px-5 md:px-7 xl:px-10 py-3">
          {/* Mobile: logo del tenant (como el sidebar). Desktop: breadcrumb. */}
          <div className="flex items-center min-w-0">
            <Link
              href={tenantSlug ? `/app/${tenantSlug}` : "/dashboard"}
              className="lg:hidden w-full flex items-center gap-x-3 min-w-0"
            >
              <div className="flex size-10 min-w-10 items-center justify-center rounded-lg bg-accent">
                <Store className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-medium">{tenantName}</p>
                <p className="line-clamp-1 text-xs font-normal text-muted-foreground">
                  {activeTenant ? `/app/${tenantSlug}` : "Sin sucursal"}
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center min-w-0">{breadcrumb}</div>
          </div>

          <div className="flex items-center gap-x-1">
            
            {/* Búsqueda global */}
            <div className="mr-3 hidden lg:flex items-center gap-x-2 rounded-lg border bg-card! border-border px-3 w-60">
              <Search className="size-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar…"
                className="border-0 bg-transparent! px-0 py-1.75 h-fit text-sm focus-visible:ring-0 placeholder:text-muted-foreground"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Barra de búsqueda"
              className="lg:hidden"
            >
              <Search />
            </Button>

            <ThemeToggle />

            {/* Notificaciones (pendientes llegarán desde GET /invitations) */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notificaciones"
            >
              <Bell />
            </Button>

            {/* Avatar interactivo (cierra sesión, va a cuenta). */}
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Menú de usuario"
                className="ml-2 flex size-9 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-foreground outline-none transition-colors hover:bg-accent/80 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg className="size-5"
                  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <g fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="6" r="4" />
                      <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
                  </g>
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    render={
                      <Link href="/dashboard/cuenta" target="_blank" rel="noopener noreferrer" />
                    }
                    className="cursor-pointer px-2 py-2"
                  >
                    <User className="size-4" />
                    Mi cuenta
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={
                      <Link href="/dashboard/ayuda" target="_blank" rel="noopener noreferrer" />
                    }
                    className="cursor-pointer px-2 py-2"
                  >
                    <CircleHelp className="size-4" />
                    Ayuda
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer px-2 py-2"
                  onClick={() => setConfirmOpen(true)}
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <LogoutDialog open={confirmOpen} onOpenChange={setConfirmOpen} />
    </>
  );
};