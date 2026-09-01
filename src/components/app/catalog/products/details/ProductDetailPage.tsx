"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { toastMsg } from "@/components/ui/toast-message";
import {
  catalogCategories,
  catalogProducts,
  catalogSubcategories,
} from "@/lib/mock/catalog";
import { Charts } from "../../categories/details/Charts";
import { ProductDetailHeader } from "./ProductDetailHeader";
import { ProductActions } from "./ProductActions";
import { ProductInfo } from "./ProductInfo";

interface ProductDetailPageProps {
  slug: string;
  productId: string;
}

export const ProductDetailPage = ({ slug, productId }: ProductDetailPageProps) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOverride, setStatusOverride] = useState<"activo" | "inactivo" | null>(null);
  const product = catalogProducts.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Link
          href={`/app/${slug}/catalogo`}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Regresar al catálogo
        </Link>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos este producto.
        </div>
      </div>
    );
  }

  const category = catalogCategories.find((item) => item.id === product.categoryId);
  const subcategory = catalogSubcategories.find(
    (item) => item.id === product.subcategoryId,
  );
  const currentStatus = statusOverride ?? product.status;
  const isEnabled = currentStatus === "activo";
  const displayedProduct = { ...product, status: currentStatus };

  const handleToggleStatus = () => {
    const nextStatus = isEnabled ? "inactivo" : "activo";
    setStatusOverride(nextStatus);
    toastMsg.success(
      nextStatus === "activo" ? "Producto habilitado" : "Producto deshabilitado",
      `${product.name} ahora está ${nextStatus}.`,
    );
  };

  const handleDelete = () => {
    toastMsg.info("Producto eliminado", `${product.name} se eliminó del prototipo.`);
    router.push(`/app/${slug}/catalogo`);
  };

  const handleExport = () => {
    const file = new Blob([JSON.stringify(displayedProduct, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${product.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toastMsg.success("Producto exportado", "Se descargó la información en formato JSON.");
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <ProductDetailHeader name={product.name} slug={slug} />

      <ProductInfo />

      <Charts
        productCount={1}
        categoryName={product.name}
        scopeLabel={`el producto ${product.name}`}
      />

      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <ProductActions
          isEnabled={isEnabled}
          onEdit={() =>
            toastMsg.info(
              "Edición en preparación",
              "El formulario de productos se conectará en la siguiente etapa.",
            )
          }
          onToggleStatus={handleToggleStatus}
          onDelete={() => setDeleteOpen(true)}
        />
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar producto"
        description={`¿Deseas eliminar ${product.name}? Esta acción lo quitará del catálogo.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
};
