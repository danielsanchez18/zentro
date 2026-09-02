"use client";

import { ChevronRight, Package, Tag } from "lucide-react";
import type { CatalogProduct } from "@/lib/mock/catalog";
import { categoryName, subcategoryName } from "@/lib/mock/catalog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { ProductActionsMenu } from "./ProductActionsMenu";

interface ProductTableProps {
  products: CatalogProduct[];
  onPreview: (product: CatalogProduct) => void;
  onEdit: (product: CatalogProduct) => void;
  onRequestToggleStatus: (product: CatalogProduct) => void;
  onRequestRemove: (product: CatalogProduct) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);

/** Vista de tabla del catálogo de productos. */
export const ProductTable = ({
  products,
  onPreview,
  onEdit,
  onRequestToggleStatus,
  onRequestRemove,
}: ProductTableProps) => (
  <div className="overflow-x-auto w-full">
    <table className="min-w-full">
      <thead>
        <tr className="bg-accent">
          <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
            Producto
          </th>
          <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
            Categoría
          </th>
          <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
            Variantes
          </th>
          <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
            Precio
          </th>
          <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
            Estado
          </th>
          <th className="px-5 py-3 text-right text-xs font-heading uppercase font-semibold text-nowrap" />
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {products.map((product) => (
          <tr
            key={product.id}
            className="cursor-pointer hover:bg-muted/30"
            onClick={() => onPreview(product)}
          >
            <td className="px-5 py-3 text-sm text-nowrap">
              <div className="flex items-center gap-3">
                <div className="bg-accent flex justify-center items-center size-12 overflow-hidden rounded-xl">
                  <Package className="size-4.5" />
                </div>
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="block text-muted-foreground text-sm font-sans">
                    {product.description ?? "—"}
                  </span>
                </div>
              </div>
            </td>
            <td className="px-5 py-3 text-sm text-nowrap">
              <div className="inline-flex items-center gap-x-0.5 text-sm">
                <Tag className="size-3.5 text-muted-foreground mr-1" />
                {categoryName(product.categoryId)}
                {product.subcategoryId && (
                  <>
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                    {subcategoryName(product.subcategoryId)}
                  </>
                )}
              </div>
            </td>
            <td className="px-5 py-3 text-sm text-nowrap">
              {product.variants && product.variants.length > 0 ? (
                <div className="flex items-center gap-1">
                  {product.variants.slice(0, 3).map((v) => (
                    <span
                      key={v.id}
                      className="rounded-full bg-muted px-2.5 py-1.5 text-xs"
                    >
                      {v.label}
                    </span>
                  ))}
                  {product.variants.length > 3 && (
                    <span className="text-xs text-muted-foreground/60">
                      +{product.variants.length - 3}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">Sin variantes</span>
              )}
            </td>
            <td className="px-5 py-3 text-sm text-nowrap font-medium">
              {formatPrice(product.basePrice)}
            </td>
            <td className="px-5 py-3 text-sm text-nowrap">
              <StatusBadge status={product.status} />
            </td>
            <td className="px-5 py-3 text-right text-nowrap">
              <ProductActionsMenu
                product={product}
                onPreview={onPreview}
                onEdit={onEdit}
                onRequestToggleStatus={onRequestToggleStatus}
                onRequestRemove={onRequestRemove}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
