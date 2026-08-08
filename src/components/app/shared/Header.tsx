"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Home, Bell, CreditCard, LogOut, User, Search, Inbox } from "lucide-react";
import { ThemeToggle } from "@/components/landing/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Header del Tenant Workspace (/app/:slug).
 *
 * Arquitectura igual que el hub/dashboard: componente de presentación que vive en
 * `components/app/shared/`, sin lógica de negocio. El slug de la org se deriva de la
 * ruta actual con `usePathname`.
 *
 * Contexto actual (mockup de flujo): solo ámbito Tenant, un único rol (Owner), sin
 * switchers de tenant/sucursal (solo vínculo conceptual al hub personalizado).
 */
export const Header = () => {
  const pathname = usePathname();

  const slug = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] ?? "org";
  }, [pathname]);

  // TODO(0.2): leer pendientes desde GET /invitations + notificaciones reales.
  const MOCK_PENDING_INVITATIONS = 0;

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="px-5 md:px-7 xl:px-10 py-2.5 flex items-center gap-x-5">
        
        {/* Search Input Button */}
        <div className="relative max-lg:hidden text-muted-foreground hover:text-primary transition">
          <Search className="size-4 absolute left-4 top-2.75" />
          <input type="search" placeholder="Buscar" className="pl-10 px-4 text-sm rounded-lg border-border py-2 border bg-card placeholder:text-muted-foreground" disabled />
        </div>

        {/* TODO: Identidad del workspace */}
        <Link
          href={`/app/${slug}`}
          className="lg:hidden"
        >
          <span className="font-semibold text-xl">Zentro</span>
        </Link>

        <div className="ml-auto flex items-center gap-x-1">
          
          <Button variant="ghost" size="icon" aria-label="Buscar" className="lg:hidden">
            <Search />
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" aria-label="Notificaciones">
            <Bell />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Mensajes">
            <Inbox />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 relative size-10 rounded-full flex items-center justify-center p-0 cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <svg
                className="size-4.5"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="6" r="4" />
                  <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
                </g>
              </svg>
              {MOCK_PENDING_INVITATIONS > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-white flex size-4 items-center justify-center rounded-full bg-red-500 dark:bg-destructive text-[0.6rem] font-semibold text-destructive-foreground ring-2 ring-background">
                  {MOCK_PENDING_INVITATIONS}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1">
              <DropdownMenuItem
                render={<Link href="/dashboard/cuenta" />}
                className="cursor-pointer px-3 py-2"
              >
                <User className="size-4" />
                Mi cuenta
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/dashboard/suscripciones" />}
                className="cursor-pointer px-3 py-2"
              >
                <CreditCard className="size-4" />
                Suscripciones
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/dashboard" />}
                className="cursor-pointer px-3 py-2"
              >
                <Home className="size-4" />
                Volver al hub
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer px-3 py-2">
                <LogOut className="size-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};