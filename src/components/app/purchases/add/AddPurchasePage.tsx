"use client";

import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { purchaseTotal } from "@/lib/mock/purchases";
import { useInventoryStore } from "@/stores/inventory-store";
import { usePurchasesStore } from "@/stores/purchases-store";
import { PurchaseForm } from "../shared/PurchaseForm";

export function AddPurchasePage({ slug }: { slug: string }) {
  const router = useRouter();
  const items = useInventoryStore((state) => state.items);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const orders = usePurchasesStore((state) => state.orders);
  const addOrder = usePurchasesStore((state) => state.addOrder);
  const href = `/app/${slug}/compras`;
  const formId = "add-purchase-form";
  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10">
      <header className="mb-7">
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(href)}
          className="h-fit px-0"
        >
          Regresar
        </Button>
        <h1 className="text-lg font-medium">Nueva orden de compra</h1>
        <p className="text-sm text-muted-foreground">
          Registra lo que solicitarás al proveedor. El stock cambiará cuando
          confirmes la recepción.
        </p>
      </header>
      <PurchaseForm
        id={formId}
        suppliers={suppliers}
        items={items}
        onSubmit={(values) => {
          const supplier = suppliers.find(
            (item) => item.id === values.supplierId,
          );
          const orderedUnits = values.lines.reduce(
            (sum, line) => sum + line.quantity,
            0,
          );
          const number = `OC-2026-${String(82 + orders.length).padStart(4, "0")}`;
          const id = `pur_${Date.now()}`;
          addOrder({
            id,
            number,
            supplierId: values.supplierId,
            supplierName: supplier?.tradeName ?? "Proveedor",
            issuedAt: new Date(`${values.issuedAt}T12:00:00`).toISOString(),
            expectedAt: new Date(`${values.expectedAt}T12:00:00`).toISOString(),
            itemCount: values.lines.length,
            orderedUnits,
            receivedUnits: 0,
            total: purchaseTotal(values.lines),
            currency: "PEN",
            status: "borrador",
            paymentStatus: "pendiente",
            reference: values.reference,
            paymentTerms: values.paymentTerms,
            notes: values.notes,
            lines: values.lines,
          });
          toastMsg.success(
            "Orden creada",
            `${number} se guardó como borrador.`,
          );
          router.push(`${href}/${id}`);
        }}
      />
      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast
          formId={formId}
          submitLabel="Guardar borrador"
          onCancel={() => router.push(href)}
        />
      </div>
    </div>
  );
}
