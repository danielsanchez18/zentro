"use client";

import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useInventoryStore } from "@/stores/inventory-store";
import { SupplierForm } from "../shared/SupplierForm";

export function EditSupplierPage({ slug, supplierId }: { slug: string; supplierId: string }) {
  const router = useRouter();
  const suppliers = useInventoryStore((state) => state.suppliers);
  const updateSupplier = useInventoryStore((state) => state.updateSupplier);
  const supplier = suppliers.find((candidate) => candidate.id === supplierId);
  const detailHref = `/app/${slug}/inventario/proveedores/${supplierId}`;
  const formId = "edit-supplier-form";

  if (!supplier) return <div className="w-full px-5 py-7 md:px-7 xl:px-10"><Button variant="link" onClick={() => router.push(`/app/${slug}/inventario/proveedores`)} className="h-fit px-0">Regresar a proveedores</Button><div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No encontramos este proveedor.</div></div>;

  return <div className="w-full px-5 py-7 md:px-7 xl:px-10">
    <header><Button type="button" variant="link" onClick={() => router.push(detailHref)} className="h-fit cursor-pointer px-0">Regresar</Button><h1 className="text-lg font-medium">Editar proveedor</h1><p className="text-sm text-muted-foreground">Actualiza la información fiscal, el contacto y las condiciones comerciales.</p></header>
    <div className="mt-7"><SupplierForm id={formId} initial={supplier} existingDocuments={suppliers.filter((candidate) => candidate.id !== supplier.id).map((candidate) => candidate.documentNumber)} onSubmit={(values) => { updateSupplier(supplier.id, values); toastMsg.success("Proveedor actualizado", `Los cambios de ${values.tradeName} se guardaron en el prototipo.`); router.push(detailHref); }} /></div>
    <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit"><Toast formId={formId} submitLabel="Guardar cambios" onCancel={() => router.push(detailHref)} /></div>
  </div>;
}
