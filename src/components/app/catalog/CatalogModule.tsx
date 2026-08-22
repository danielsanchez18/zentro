"use client";

import { useState } from "react";
import { Title } from "./Title";
import { KPIS } from "./KPIS";
import { ProductList } from "./ProductList";
import {
  catalogProducts,
  type CatalogProduct,
} from "@/lib/mock/catalog";

interface CatalogModuleProps {
  slug: string;
}

/**
 * Contenedor del módulo Catálogo.
 * Mantiene el estado global de productos para KPIs y lista.
 */
export const CatalogModule = ({ slug }: CatalogModuleProps) => {
  const [products] = useState<CatalogProduct[]>(catalogProducts);

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7 space-y-10 lg:space-y-7">
      <Title slug={slug} />
      <KPIS products={products} />
      <ProductList initialProducts={products} slug={slug} />
    </div>
  );
};