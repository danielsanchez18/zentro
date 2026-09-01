"use client";

import { useState } from "react";
import { LayoutGrid, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Title } from "./Title";
import { KPIS } from "./KPIS";
import { ProductList } from "../products/overview/ProductList";
import { CategoriesTab } from "../categories/overview/CategoriesTab";
import {
  catalogProducts,
  type CatalogProduct,
} from "@/lib/mock/catalog";

interface CatalogModuleProps {
  slug: string;
}

type CatalogTab = "products" | "categories";

const TABS: { id: CatalogTab; label: string; icon: typeof Package }[] = [
  { id: "products", label: "Productos", icon: Package },
  { id: "categories", label: "Categorías", icon: LayoutGrid },
];

/**
 * Contenedor del módulo Catálogo.
 * Mantiene el estado global de productos para KPIs y lista.
 * Tabs: Productos / Categorías.
 */
export const CatalogModule = ({ slug }: CatalogModuleProps) => {
  const [products] = useState<CatalogProduct[]>(catalogProducts);
  const [tab, setTab] = useState<CatalogTab>("products");

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7 space-y-10 lg:space-y-7">
      <Title slug={slug} />
      <KPIS products={products} />

      {/* Tabs */}
      <div>
        <div className="flex w-full items-center gap-1 border-b border-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              onClick={() => setTab(id)}
              aria-selected={tab === id}
              className={cn(
                "relative -mb-px flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                tab === id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          {tab === "products" ? (
            <ProductList initialProducts={products} slug={slug} />
          ) : (
            <CategoriesTab slug={slug} />
          )}
        </div>
      </div>
    </div>
  );
};
