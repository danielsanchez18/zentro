"use client";

import { useRouter } from "next/navigation";
import { useInventoryStore } from "@/stores/inventory-store";
import { InventoryNav } from "../../shared/InventoryNav";
import { SuppliersHeader } from "./SuppliersHeader";
import { SuppliersKpis } from "./SuppliersKpis";
import { SuppliersList } from "./SuppliersList";

export function SuppliersModule({ slug }: { slug: string }) {
  const router = useRouter();
  const suppliers = useInventoryStore((state) => state.suppliers);
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <InventoryNav slug={slug} />
      <SuppliersHeader onAdd={() => router.push(`/app/${slug}/inventario/proveedores/agregar`)} />
      <SuppliersKpis suppliers={suppliers} />
      <SuppliersList slug={slug} suppliers={suppliers} />
    </div>
  );
}
