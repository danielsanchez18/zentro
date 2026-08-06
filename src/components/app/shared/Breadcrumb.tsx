"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import { useTenantStore } from "@/stores/tenant-store";
import { Button } from "@/components/ui/button";

interface BreadcrumbProps {
  /** Abre el sidebar (Sheet) en mobile. */
  onOpenMenu?: () => void;
}

/**
 * Migas de pan del Tenant Dashboard: tenant activo + sección actual, derivadas
 * del pathname (por debajo de /app/:slug). Componente independiente, se usa:
 * - Desktop: a la izquierda dentro del Header.
 * - Mobile: como barra propia debajo del Header, con el botón "menú" que abre
 *   el sidebar (Sheet).
 */
export const Breadcrumb = ({ onOpenMenu }: BreadcrumbProps) => {
  const pathname = usePathname();
  const activeTenant = useTenantStore((s) => s.activeTenant);

  const tenantName = activeTenant?.name ?? "Tenant";
  const tenantSlug = activeTenant?.slug ?? "";
  const segments = pathname.split("/").filter(Boolean);
  // segments[1] es el slug del tenant; segments[2] es la sección.
  const section = segments.length > 2 ? segments[2] : "overview";

  return (
    <div className="flex items-center gap-x-2 text-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Abrir menú"
        onClick={onOpenMenu}
        className="lg:hidden"
      >
        <Menu className="size-4" />
      </Button>

      <Link
        href={tenantSlug ? `/app/${tenantSlug}` : ""}
        className="hidden sm:inline-flex items-center gap-x-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {tenantName}
      </Link>

      <ChevronRight className="size-4 text-muted-foreground" />

      <span className="font-medium text-foreground capitalize">
        {section === "overview" ? "Resumen general" : section}
      </span>
    </div>
  );
};