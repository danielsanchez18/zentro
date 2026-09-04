import { BadgeCheck, Boxes, CircleDollarSign, Tags } from "lucide-react";
import type { InventoryBrand } from "@/lib/mock/inventory-brands";

export function BrandsKpis({ brands }: { brands: InventoryBrand[] }) {
  const active = brands.filter((brand) => brand.status === "activo");
  const stats = [
    { title: "Marcas registradas", value: brands.length, suffix: "marcas", subtitle: "Directorio de inventario", icon: Tags },
    { title: "Marcas activas", value: active.length, suffix: "marcas", subtitle: "Disponibles para productos", icon: BadgeCheck },
    { title: "Productos vinculados", value: active.reduce((sum, brand) => sum + brand.productCount, 0), suffix: "productos", subtitle: "Relaciones activas", icon: Boxes },
    { title: "Valor por marcas", value: new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(brands.reduce((sum, brand) => sum + brand.inventoryValue, 0)), subtitle: "Inventario valorizado", icon: CircleDollarSign },
  ];
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item) => <article key={item.title} className="rounded-xl border border-border bg-card px-5 py-4 font-heading"><div className="space-y-2"><div className="flex items-center justify-between text-primary/70"><p className="text-sm">{item.title}</p><item.icon className="size-4.5" /></div><div className="space-y-1"><p className="text-xl font-medium">{typeof item.value === "number" ? item.value.toLocaleString("es-PE") : item.value}{item.suffix && <> <span className="text-sm">{item.suffix}</span></>}</p><p className="text-xs text-primary/70">{item.subtitle}</p></div></div></article>)}</section>;
}
