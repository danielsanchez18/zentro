"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/organizaciones", label: "Organizaciones" },
  { href: "/dashboard/invitaciones", label: "Invitaciones" },
  { href: "/dashboard/suscripciones", label: "Suscripciones" },
  { href: "/dashboard/ayuda", label: "Ayuda" },
];

export const Navlink = () => {
  const pathname = usePathname();

  // Coincidencia por la ruta MÁS ESPECÍFICA (la más larga gana).
  // Evita que /dashboard (Overview) robe el activo a /dashboard/organizaciones.
  const active = links
    .filter(
      (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  const currentLabel = active?.label ?? "Overview";

  return (
    <div className="w-full border-b border-border">
      <nav className="w-full max-w-350 mx-auto px-5 py-2 md:px-7 xl:px-10 flex items-center gap-x-2">
        {/* Desktop: links horizontales */}
        <div className="hidden md:flex items-center gap-x-2">
          {links.map((link, index) => (
            <Fragment key={link.href}>
              {index > 0 && <div className="w-px h-5 bg-border" />}
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-x-2.5 h-fit px-4 py-2 text-sm rounded-lg hover:bg-secondary text-secondary-foreground",
                  active?.href === link.href && "bg-secondary",
                )}
              >
                {link.label}
              </Link>
            </Fragment>
          ))}
        </div>

        {/* Mobile: breadcrumb + menú de páginas */}
        <div className="flex md:hidden w-full items-center gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Abrir menú de páginas"
                />
              }
            >
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {links.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  render={<Link href={link.href} />}
                  className={cn(
                    active?.href === link.href &&
                      "bg-secondary text-secondary-foreground",
                    "cursor-pointer px-2 py-1.5",
                  )}
                >
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Dashboard</span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="font-medium">{currentLabel}</span>
          </p>
        </div>
      </nav>
    </div>
  );
};
