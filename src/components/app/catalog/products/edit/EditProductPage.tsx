"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { catalogProducts } from "@/lib/mock/catalog";
import { ProductForm } from "../shared/ProductForm";
import type { ProductFormValues } from "../shared/types";

interface EditProductPageProps {
  slug: string;
  productId: string;
}

export function EditProductPage({ slug, productId }: EditProductPageProps) {
  const router = useRouter();
  const product = catalogProducts.find((item) => item.id === productId);
  const catalogHref = `/app/${slug}/catalogo`;

  if (!product) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Button type="button" variant="link" onClick={() => router.push(catalogHref)} className="h-auto px-0">Regresar</Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No encontramos este producto.</div>
      </div>
    );
  }

  const detailHref = `/app/${slug}/catalogo/producto/${product.id}`;
  const formId = "edit-product-form";
  const initial: Partial<ProductFormValues> = {
    name: product.name,
    sku: product.id.toUpperCase(),
    description: product.description ?? "",
    price: String(product.basePrice),
    available: product.status === "activo",
    categoryId: product.categoryId,
    subcategoryId: product.subcategoryId ?? "",
    variants: product.variants?.map((variant, index) => ({
      id: variant.id,
      name: variant.label,
      sku: `${product.id}-${index + 1}`.toUpperCase(),
      price: String(variant.priceOverride ?? product.basePrice),
      stock: "0",
    })) ?? [],
  };

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10">
      <header className="mb-7">
        <Button type="button" variant="link" onClick={() => router.push(detailHref)} className="h-auto px-0">Regresar</Button>
        <h1 className="mt-1 text-lg font-medium tracking-tight">Editar producto</h1>
      </header>

      <ProductForm
        id={formId}
        initial={initial}
        onSubmit={(values) => {
          toastMsg.success("Producto actualizado", `Los cambios de ${values.name} se aplicaron en el prototipo.`);
          router.push(detailHref);
        }}
      />

      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast formId={formId} submitLabel="Guardar cambios" onCancel={() => router.push(detailHref)} />
      </div>
    </div>
  );
}
