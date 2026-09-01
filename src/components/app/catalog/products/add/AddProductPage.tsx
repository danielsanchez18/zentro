"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { ProductForm } from "../shared/ProductForm";

interface AddProductPageProps {
  slug: string;
}

/** Página completa para agregar un nuevo producto. */
export const AddProductPage = ({ slug }: AddProductPageProps) => {
  const router = useRouter();
  const formId = "add-product-form";
  const catalogHref = `/app/${slug}/catalogo`;

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10">
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Button type="button" variant="link" onClick={() => router.push(catalogHref)} className="h-auto px-0">Regresar</Button>
          <h1 className="mt-1 text-lg font-medium">Nuevo producto</h1>
        </div>
      </header>

      <div className="">
        <ProductForm id={formId} onSubmit={(values) => { toastMsg.success("Producto creado", `${values.name} se agregó al prototipo.`); router.push(catalogHref); }} />
      </div>

      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast formId={formId} submitLabel="Guardar producto" onCancel={() => router.push(catalogHref)} />
      </div>
    </div>
  );
};
