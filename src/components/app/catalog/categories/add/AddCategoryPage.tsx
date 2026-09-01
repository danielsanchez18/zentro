"use client";

import { useRouter } from "next/navigation";
import { CategoryForm } from "../shared/CategoryForm";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { Toast } from "@/components/app/shared/Toast";

interface AddCategoryPageProps {
  slug: string;
}

/** Página completa para agregar una nueva categoría. */
export const AddCategoryPage = ({ slug }: AddCategoryPageProps) => {
  const router = useRouter();
  const formId = "add-category-form";
  const catalogHref = `/app/${slug}/catalogo`;

  return (
    <div className="flex w-full flex-col gap-y-7 px-5 py-7 md:px-7 xl:px-10">

      {/* Header */}
      <div>
        {/* Back */}
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(catalogHref)}
          className="px-0 h-fit cursor-pointer"
        >
          Regresar
        </Button>
        <h1 className="text-lg font-medium">Nueva Categoría</h1>
      </div>

      {/* Form */}
      <div className="w-full">
        <div className="rounded-xl border border-border bg-card">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-medium">Información</h2>
          </div>
          <div className="p-5">
            <CategoryForm
              id={formId}
              showActions={false}
              onSubmit={(v) => {
                toastMsg.success("Categoría creada", `${v.name} se agregó al prototipo.`);
                router.push(catalogHref);
              }}
            />
          </div>
        </div>

      </div>

      <div className="sticky bottom-5 mx-auto">
        <Toast
          formId={formId}
          submitLabel="Guardar categoría"
          onCancel={() => router.push(catalogHref)}
        />
      </div>

    </div>
  );
};
