import {
  ArrowDownToLine,
  ArrowUpFromLine,
  PackageX,
  SlidersHorizontal,
} from "lucide-react";
import type { InventoryMovementRecord } from "@/lib/mock/inventory-movements";

export function MovementsKpis({
  movements,
}: {
  movements: InventoryMovementRecord[];
}) {
  const stats = [
    {
      label: "Entradas",
      value: movements
        .filter((item) => item.type === "entrada")
        .reduce((sum, item) => sum + Math.abs(item.quantity), 0),
      description: "Unidades recibidas",
      icon: ArrowDownToLine,
    },
    {
      label: "Salidas",
      value: movements
        .filter((item) => item.type === "salida")
        .reduce((sum, item) => sum + Math.abs(item.quantity), 0),
      description: "Unidades retiradas",
      icon: ArrowUpFromLine,
    },
    {
      label: "Mermas",
      value: movements
        .filter((item) => item.type === "merma")
        .reduce((sum, item) => sum + Math.abs(item.quantity), 0),
      description: "Pérdidas registradas",
      icon: PackageX,
    },
    {
      label: "Ajustes",
      value: movements.filter((item) => item.type === "ajuste").length,
      description: "Conteos regularizados",
      icon: SlidersHorizontal,
    },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, description, icon: Icon }) => (
        <article
          key={label}
          className="rounded-xl border border-border bg-card px-5 py-4 font-heading"
        >
          <div className="flex items-center justify-between text-primary/70">
            <p className="text-sm">{label}</p>
            <Icon className="size-4.5" />
          </div>
          <p className="mt-2 text-xl font-medium tabular-nums">
            {value.toLocaleString("es-PE")}{" "}
            <span className="text-sm font-normal">unidades</span>
          </p>
          <p className="mt-1 text-xs text-primary/70">{description}</p>
        </article>
      ))}
    </section>
  );
}
