"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceNav } from "@/stores/workspace-nav-store";

// Nombre legible de cada módulo del sidebar para el breadcrumb.
const MODULE_LABELS: Record<string, string> = {
  pos: "Punto de venta",
  pedidos: "Pedidos",
  catalogo: "Catálogo",
  inventario: "Inventario",
  compras: "Compras",
  promociones: "Promociones",
  clientes: "CRM",
  agenda: "Agenda",
  formularios: "Formularios",
  caja: "Caja",
  facturacion: "Facturación",
  reportes: "Reportes",
  presencia: "Mi sitio web",
  blog: "Blog",
  marketing: "Marketing",
  marketplace: "Marketplace",
  equipo: "Equipo y permisos",
  configuracion: "Configuración",
  auditoria: "Auditoría",
};

const toLabel = (segment: string) => {
  const known = MODULE_LABELS[segment];
  if (known) return known;
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
};

/**
 * Breadcrumb funcional del Tenant Workspace (/app/:slug).
 * - Se monta en el layout (visible en mobile) y se construye SOLO a partir de la
 *   ruta actual (usePathname), así que funciona para cualquier org y módulo.
 * - Genera un enlace por segmento: Overview (/app/:slug) → Módulo → sub-segmento.
 * - El botón «Menu» es el toggle del sidebar en mobile (vea TODOs abajo).
 */
export const Breadcrumb = () => {
  const pathname = usePathname();
  const openMobileSidebar = useWorkspaceNav((s) => s.setMobileOpen);

  const segments = useMemo(() => pathname.split("/").filter(Boolean), [pathname]);
  const slug = segments[1] ?? "org";

  // Traza de migas: cada elemento es { href, label, isLast }.
  const crumbs = useMemo(() => {
    const trail: { href: string; label: string; isLast: boolean }[] = [
      { href: `/app/${slug}`, label: "Overview", isLast: segments.length <= 2 },
    ];

    segments.slice(2).forEach((segment, index) => {
      trail.push({
        href: `/app/${slug}/${segments.slice(2, 3 + index).join("/")}`,
        label: toLabel(segment),
        isLast: index === segments.length - 3,
      });
    });

    return trail;
  }, [segments, slug]);

  return (
    <div className="border-b border-border py-2 px-5 flex items-center gap-x-1 font-heading">
      <Button
        variant="outline"
        size="icon"
        className="mr-2"
        aria-label="Abrir menú"
        onClick={() => openMobileSidebar(true)}
      >
        <Menu />
      </Button>

      {crumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center gap-x-1">
          {crumb.isLast ? (
            <span className="text-foreground font-medium text-sm">
              {crumb.label}
            </span>
          ) : (
            <>
              <Link
                href={crumb.href}
                className="text-muted-foreground font-medium text-sm hover:text-foreground hover:underline"
              >
                {crumb.label}
              </Link>
              <ChevronRight className="size-4 text-muted-foreground" />
            </>
          )}
        </div>
      ))}
    </div>
  );
};