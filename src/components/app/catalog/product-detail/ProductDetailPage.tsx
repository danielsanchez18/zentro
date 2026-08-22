"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { catalogProducts, categoryName, subcategoryName } from "@/lib/mock/catalog";
import { StatusBadge } from "../../shared/StatusBadge";

interface ProductDetailPageProps {
  slug: string;
  productId: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);

export const ProductDetailPage = ({
  slug,
  productId,
}: ProductDetailPageProps) => {
  const product = catalogProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="w-full px-5 md:px-7 xl:px-10 py-7">
        <Link
          href={`/app/${slug}/catalogo`}
          className="inline-flex items-center gap-1 text-sm font-heading hover:underline underline-offset-4"
        >
          <ChevronLeft className="size-4" />
          Regresar
        </Link>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos este producto.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7 space-y-7">
      {/* Back */}
      <Link
        href={`/app/${slug}/catalogo`}
        className="inline-flex items-center gap-1 text-sm font-heading hover:underline underline-offset-4"
      >
        <ChevronLeft className="size-4" />
        Regresar al catálogo
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {product.description ?? "Sin descripción"}
          </p>
        </div>
        <StatusBadge status={product.status} />
      </div>

      {/* Info grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Categoría">
          {categoryName(product.categoryId)}
          {product.subcategoryId && (
            <span className="text-muted-foreground">
              {" "}&rsaquo; {subcategoryName(product.subcategoryId)}
            </span>
          )}
        </Card>

        <Card label="Precio base">{formatPrice(product.basePrice)}</Card>

        {product.variants && product.variants.length > 0 && (
          <Card label="Variantes">
            <div className="flex flex-wrap gap-1.5 mt-1">
              {product.variants.map((v) => (
                <span
                  key={v.id}
                  className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium"
                >
                  {v.label}
                  {v.priceOverride && (
                    <span className="ml-1 text-muted-foreground">
                      {formatPrice(v.priceOverride)}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

/** Card simple clave/valor para el detalle. */
const Card = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border p-4 space-y-1">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {label}
    </p>
    <div className="text-sm font-medium">{children}</div>
  </div>
);
