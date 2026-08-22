import { Package, PackageCheck, PackageX, Tag } from "lucide-react";
import type { CatalogProduct } from "@/lib/mock/catalog";

interface KPISProps {
  products: CatalogProduct[];
}

/** KPIs del módulo Catálogo — mismo patrón visual que Equipo. */
export const KPIS = ({ products }: KPISProps) => {
  const stats = [
    {
      title: "Total productos",
      value: products.length,
      icon: Package,
      subtitle: "En el catálogo",
    },
    {
      title: "Productos activos",
      value: products.filter((p) => p.status === "activo").length,
      icon: PackageCheck,
      subtitle: "Disponibles para venta",
    },
    {
      title: "Inactivos",
      value: products.filter((p) => p.status === "inactivo").length,
      icon: PackageX,
      subtitle: "No visibles en POS",
    },
    {
      title: "Con variantes",
      value: products.filter((p) => p.variants && p.variants.length > 0).length,
      icon: Tag,
      subtitle: "Tallas, tamaños, etc.",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="border border-border bg-card rounded-xl px-5 py-4 font-heading"
        >
          <div className="space-y-2">
            <div className="flex justify-between text-primary/70 items-center">
              <p className="text-sm">{item.title}</p>
              <item.icon className="size-4.5" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-xl">
                {item.value}{" "}
                <span className="text-sm">
                  {item.value === 1 ? "producto" : "productos"}
                </span>
              </p>
              <p className="text-xs text-primary/70">{item.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};