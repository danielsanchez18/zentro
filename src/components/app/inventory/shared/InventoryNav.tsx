"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function InventoryNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/app/${slug}/inventario`;
  const items = [
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
      disabled: true,
    },
    {
      label: "Marcas",
      href: `${base}/marcas`,
      active: pathname.startsWith(`${base}/marcas`),
      disabled: true,
    },
  ];

  return (
    <nav
      aria-label="Secciones de inventario"
      className="flex gap-1 overflow-x-auto border-b border-border"
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
              "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              item.active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
