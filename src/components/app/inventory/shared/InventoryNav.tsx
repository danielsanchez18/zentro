"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function InventoryNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/app/${slug}/inventario`;
  interface NavItem {
    label: string;
    href: string;
    active: boolean;
    disabled?: boolean;
  }

  const items: NavItem[] = [
    { label: "Existencias", href: base, active: pathname === base },
    {
      label: "Movimientos",
      href: `${base}/movimientos`,
      active: pathname.startsWith(`${base}/movimientos`),
    },
    {
      label: "Proveedores",
      href: `${base}/proveedores`,
      active: pathname.startsWith(`${base}/proveedores`),
    },
    {
      label: "Marcas",
      href: `${base}/marcas`,
      active: pathname.startsWith(`${base}/marcas`),
    },
  ];

  return (
    <nav
      aria-label="Secciones de inventario"
      className="flex gap-2 overflow-x-auto"
    >
      {items.map((item) =>
        item.disabled ? (
          <span
            key={item.label}
            className="cursor-not-allowed whitespace-nowrap px-3 py-2 text-sm text-muted-foreground/50"
            title="Próximamente"
          >
            {item.label}
          </span>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-lg px-2.5 py-1.5 leading-none text-sm font-medium transition-colors",
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground bg-muted/50",
            )}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
