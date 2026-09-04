"use client";

import { useState } from "react";
import { useInventoryStore } from "@/stores/inventory-store";
import { InventoryNav } from "../../shared/InventoryNav";
import { AddBrandDialog } from "../add/AddBrandDialog";
import { BrandsHeader } from "./BrandsHeader";
import { BrandsKpis } from "./BrandsKpis";
import { BrandsList } from "./BrandsList";

export function BrandsModule({ slug }: { slug: string }) {
  const [addOpen, setAddOpen] = useState(false);
  const storedBrands = useInventoryStore((state) => state.brands);
  const items = useInventoryStore((state) => state.items);
  const brands = storedBrands.map((brand) => {
    const related = items.filter((item) => item.brand === brand.name);
    return { ...brand, productCount: related.length, unitsInStock: related.reduce((sum, item) => sum + item.currentStock, 0), inventoryValue: related.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0) };
  });
  return <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10"><InventoryNav slug={slug} /><BrandsHeader onAdd={() => setAddOpen(true)} /><BrandsKpis brands={brands} /><BrandsList slug={slug} brands={brands} /><AddBrandDialog open={addOpen} onOpenChange={setAddOpen} /></div>;
}
