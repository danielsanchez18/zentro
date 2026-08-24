"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConfirmDialog } from "../../team/ConfirmDialog";
import { toastMsg } from "@/components/ui/toast-message";
import { catalogCategories, catalogProducts, catalogSubcategories } from "@/lib/mock/catalog";
import { CategoryDetailHeader } from "./details/CategoryDetailHeader";
import { Info } from "./details/Info";
import { ProductsRelated } from "./details/ProductsRelated";
import { Charts } from "./details/Charts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";

interface CategoryDetailPageProps { slug: string; categoryId: string; }

export const CategoryDetailPage = ({ slug, categoryId }: CategoryDetailPageProps) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOverride, setStatusOverride] = useState<"activo" | "inactivo" | null>(null);
  const category =
    catalogCategories.find((item) => item.id === categoryId) ??
    catalogSubcategories.find((item) => item.id === categoryId);

  if (!category) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Link href={`/app/${slug}/catalogo`} className="text-sm font-medium text-primary hover:underline">Regresar al catálogo</Link>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No encontramos esta categoría.</div>
      </div>
    );
  }

  const isSubcategory = category.parentId !== null;
  const products = catalogProducts.filter((product) =>
    isSubcategory
      ? product.subcategoryId === category.id
      : product.categoryId === category.id,
  );
  const subcategories = isSubcategory
    ? []
    : catalogSubcategories.filter((subcategory) => subcategory.parentId === category.id);
  const parentCategory = isSubcategory
    ? catalogCategories.find((item) => item.id === category.parentId)
    : undefined;
  const currentStatus = statusOverride ?? category.status;
  const isEnabled = currentStatus === "activo";
  const displayedCategory = { ...category, status: currentStatus };

  const handleDelete = () => {
    toastMsg.info("Categoría eliminada", `${category.name} se eliminó del prototipo.`);
    router.push(`/app/${slug}/catalogo`);
  };

  const handleToggleStatus = () => {
    const nextStatus = isEnabled ? "inactivo" : "activo";
    setStatusOverride(nextStatus);
    toastMsg.success(
      nextStatus === "activo" ? "Categoría habilitada" : "Categoría deshabilitada",
      `${category.name} ahora está ${nextStatus}.`,
    );
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <CategoryDetailHeader name={category.name} slug={slug} />
      <div className="grid gap-5">
        <Info
          category={displayedCategory}
          productCount={products.length}
          subcategories={subcategories}
          parentCategory={parentCategory}
          slug={slug}
        />
        <ProductsRelated products={products} slug={slug} />
      </div>
      <Charts productCount={products.length} categoryName={category.name} />
      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <Toast ariaLabel="Acciones de la categoría">
          <Button
            variant="link"
            render={<Link href={`/app/${slug}/catalogo/categoria/${category.id}/editar`} />}
            className="px-3 text-green-500"
          >
            Editar
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={handleToggleStatus}
            className={isEnabled
              ? "px-3 text-white cursor-pointer"
              : "px-3 text-white cursor-pointer"}
          >
            {isEnabled ? "Deshabilitar" : "Habilitar"}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => setDeleteOpen(true)}
            className="px-2 text-rose-400 cursor-pointer"
          >
            Eliminar
          </Button>
        </Toast>
      </div>
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Eliminar categoría" description={`¿Deseas eliminar ${category.name}? Los productos asociados quedarán sin categoría.`} confirmLabel="Eliminar" onConfirm={handleDelete} />
    </div>
  );
};
