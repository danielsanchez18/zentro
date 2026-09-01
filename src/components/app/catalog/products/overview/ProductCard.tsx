"use client";

import { ChevronRight, Package, Tag } from "lucide-react";
import type { CatalogProduct } from "@/lib/mock/catalog";
import { categoryName, subcategoryName } from "@/lib/mock/catalog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { ProductActionsMenu } from "./ProductActionsMenu";

interface ProductCardProps {
  product: CatalogProduct;
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

/**
 * Vista «cards» del producto.
 * Estructura: [Imagen] · Nombre · Categoría · Precio · Estado · Variantes
 */
export const ProductCard = ({
  product,
  onPreview,
  onEdit,
  onRequestToggleStatus,
  onRequestRemove,
}: ProductCardProps) => (
  <div
    onClick={() => onPreview(product)}
    className="group cursor-pointer rounded-xl border border-border p-4 transition-all hover:border-primary"
  >
    {/* Header: imagen + acciones */}
    <div className="flex items-start justify-between gap-3">
      <div className="bg-accent flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        <Package className="size-6 text-muted-foreground group-hover:text-foreground" />
      </div>
      <ProductActionsMenu
        product={product}
        onPreview={onPreview}
        onEdit={onEdit}
        onRequestToggleStatus={onRequestToggleStatus}
        onRequestRemove={onRequestRemove}
      />
    </div>

    <div className="mt-3" />

    {/* Info */}
    <div className="space-y-1">
      <p className="truncate text-sm font-heading font-medium">{product.name}</p>
      <span className="block text-muted-foreground text-sm font-sans line-clamp-1">
        {product.description ?? "Sin descripción"}
      </span>
    </div>

    <div className="my-3 border-t border-border" />

    <div className="mb-1.5 inline-flex items-center gap-x-0.5 text-sm fontsan text-muted-foreground">
      <Tag className="size-3.5 text-muted-foreground mr-2" />
      {categoryName(product.categoryId)}
      {product.subcategoryId && (
        <>
          <ChevronRight className="size-3.5 text-muted-foreground" />
          {subcategoryName(product.subcategoryId)}
        </>
      )}
      </div>

    {/* Precio + estado */}
    <div className="flex items-center justify-between gap-3">
      <p className="font-medium">{formatPrice(product.basePrice)}</p>
      <StatusBadge status={product.status} />
    </div>

    {/* Variantes */}
    {product.variants && product.variants.length > 0 && (
      <>
        <div className="my-3 border-t border-border" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {product.variants.length}{" "}
            {product.variants.length === 1 ? "variante" : "variantes"}
          </p>
          <div className="flex gap-1">
            {product.variants.slice(0, 3).map((v) => (
              <span
                key={v.id}
                className="rounded-full bg-muted px-2.5 py-1.5 text-xs"
              >
                {v.label}
              </span>
            ))}
          </div>
        </div>
      </>
    )}
  </div>
);
