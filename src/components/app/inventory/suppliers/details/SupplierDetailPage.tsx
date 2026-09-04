"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useInventoryStore } from "@/stores/inventory-store";
import { SupplierDetailHeader } from "./SupplierDetailHeader";
import { SupplierInfo } from "./SupplierInfo";
import { SupplierProducts } from "./SupplierProducts";
import { SupplierRecentActivity } from "./SupplierRecentActivity";

export function SupplierDetailPage({
  slug,
  supplierId,
}: {
  slug: string;
  supplierId: string;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const items = useInventoryStore((state) => state.items);
  const movements = useInventoryStore((state) => state.movements);
  const updateSupplier = useInventoryStore((state) => state.updateSupplier);
  const removeSupplier = useInventoryStore((state) => state.removeSupplier);
  const supplier = suppliers.find((candidate) => candidate.id === supplierId);
  const suppliersHref = `/app/${slug}/inventario/proveedores`;

  if (!supplier)
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Button
          variant="link"
          onClick={() => router.push(suppliersHref)}
          className="h-fit px-0"
        >
          Regresar a proveedores
        </Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos este proveedor.
        </div>
      </div>
    );

  const supplierIndex = Math.max(
    0,
    suppliers.findIndex((candidate) => candidate.id === supplier.id),
  );
  const relatedItems = items.filter(
    (_, index) => (index + supplierIndex) % 3 === 0,
  );
  const relatedIds = new Set(relatedItems.map((item) => item.id));
  const recentEntries = movements.filter(
    (movement) =>
      movement.type === "entrada" && relatedIds.has(movement.itemId),
  );
  const isActive = supplier.status === "activo";

  const toggleStatus = () => {
    const status = isActive ? "inactivo" : "activo";
    updateSupplier(supplier.id, { status });
    toastMsg.success(
      status === "activo" ? "Proveedor habilitado" : "Proveedor deshabilitado",
      `${supplier.tradeName} ahora está ${status}.`,
    );
  };
  const deleteSupplier = () => {
    removeSupplier(supplier.id);
    toastMsg.info(
      "Proveedor eliminado",
      `${supplier.tradeName} se eliminó del prototipo.`,
    );
    router.push(suppliersHref);
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <SupplierDetailHeader
        name={supplier.tradeName}
        onBack={() => router.push(suppliersHref)}
      />
      <div className="grid items-start gap-5 xl:grid-cols-[auto_1fr]">
        <aside className="h-fit xl:sticky xl:top-5 xl:w-sm">
          <SupplierInfo supplier={supplier} />
        </aside>
        <main className="flex min-w-0 flex-col gap-5">
          <SupplierProducts
            items={relatedItems}
            total={supplier.productCount}
          />
          <SupplierRecentActivity movements={recentEntries} />
        </main>
      </div>
      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <Toast ariaLabel="Acciones del proveedor">
          <Button
            type="button"
            variant="link"
            onClick={() =>
              router.push(`${suppliersHref}/${supplier.id}/editar`)
            }
            className="cursor-pointer px-3 text-green-500"
          >
            Editar
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={toggleStatus}
            className="cursor-pointer px-3 text-white"
          >
            {isActive ? "Deshabilitar" : "Habilitar"}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer px-3 text-rose-400"
          >
            Eliminar
          </Button>
        </Toast>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar proveedor"
        description={`¿Deseas eliminar ${supplier.tradeName}? Esta acción solo afectará los datos del prototipo.`}
        confirmLabel="Eliminar"
        onConfirm={deleteSupplier}
      />
    </div>
  );
}
