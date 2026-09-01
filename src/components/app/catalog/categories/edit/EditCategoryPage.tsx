"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { catalogCategories, catalogSubcategories } from "@/lib/mock/catalog";
import { Toast } from "@/components/app/shared/Toast";
import { CategoryForm } from "../shared/CategoryForm";

interface EditCategoryPageProps {
  slug: string;
  categoryId: string;
}

export function EditCategoryPage({ slug, categoryId }: EditCategoryPageProps) {
  const router = useRouter();
  const category =
    catalogCategories.find((item) => item.id === categoryId) ??
    catalogSubcategories.find((item) => item.id === categoryId);

  if (!category) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Button variant="link" className="h-auto px-0" onClick={() => router.push(`/app/${slug}/catalogo`)}>Regresar</Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No encontramos esta categoría.</div>
      </div>
    );
  }

  const detailHref = `/app/${slug}/catalogo/categoria/${category.id}`;
  const formId = "edit-category-form";
  const subcategories = catalogSubcategories.filter((item) => item.parentId === category.id).map((item) => item.id);

  return (
    <div className="flex w-full flex-col gap-y-7 px-5 py-7 md:px-7 xl:px-10">
      <div>
        <Button type="button" variant="link" onClick={() => router.push(detailHref)} className="h-fit px-0">Regresar</Button>
        <h1 className="text-lg font-medium">Editar categoría</h1>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3"><h2 className="text-sm font-medium">Información</h2></div>
        <div className="p-5">
          <CategoryForm
            id={formId}
            showActions={false}
            initial={{ name: category.name, slug: category.slug, description: category.description, subcategories }}
            onSubmit={() => {
              toastMsg.success("Categoría actualizada", "Los cambios se aplicaron en el prototipo.");
              router.push(detailHref);
            }}
          />
        </div>
      </div>

      <div className="sticky bottom-5 mx-auto">
        <Toast
          formId={formId}
          submitLabel="Guardar cambios"
          onCancel={() => router.push(detailHref)}
        />
      </div>
    </div>
  );
}
