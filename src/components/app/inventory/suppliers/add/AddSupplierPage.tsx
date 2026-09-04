"use client";

import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useInventoryStore } from "@/stores/inventory-store";
import { SupplierForm } from "../shared/SupplierForm";

export function AddSupplierPage({ slug }: { slug: string }) {
  const router = useRouter();
  const addSupplier = useInventoryStore((state) => state.addSupplier);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const supplierDocuments = suppliers.map(
    (supplier) => supplier.documentNumber,
  );
  const formId = "add-supplier-form";
  const suppliersHref = `/app/${slug}/inventario/proveedores`;

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10">
      <header>
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(suppliersHref)}
          className="h-fit cursor-pointer px-0"
        >
          Regresar
        </Button>
        <h1 className="text-lg font-medium">Nuevo proveedor</h1>
        {/* <p className="text-sm text-muted-foreground">
          Registra su información fiscal, contacto y condiciones comerciales.
        </p> */}
      </header>
      <div className="mt-7">
        <SupplierForm
          id={formId}
          existingDocuments={supplierDocuments}
          onSubmit={(values) => {
            addSupplier({
              id: `sup_${Date.now()}`,
              ...values,
              productCount: 0,
              monthlyEntries: 0,
              lastEntryAt: null,
            });
            toastMsg.success(
              "Proveedor creado",
              `${values.tradeName} se agregó al prototipo.`,
            );
            router.push(suppliersHref);
          }}
        />
      </div>
      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast
          formId={formId}
          submitLabel="Guardar proveedor"
          onCancel={() => router.push(suppliersHref)}
        />
      </div>
    </div>
  );
}
