"use client";

import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { purchaseTotal } from "@/lib/mock/purchases";
import { useInventoryStore } from "@/stores/inventory-store";
import { usePurchasesStore } from "@/stores/purchases-store";
import { PurchaseForm } from "../shared/PurchaseForm";

export function EditPurchasePage({ slug, purchaseId }: { slug: string; purchaseId: string }) {
  const router = useRouter();
  const items = useInventoryStore((state) => state.items);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const order = usePurchasesStore((state) => state.orders.find((item) => item.id === purchaseId));
  const updateOrder = usePurchasesStore((state) => state.updateOrder);
  const detailHref = `/app/${slug}/compras/${purchaseId}`;
  if (!order) return <div className="p-7"><Button variant="link" onClick={() => router.push(`/app/${slug}/compras`)}>Regresar a compras</Button><p className="mt-6 text-sm text-muted-foreground">No encontramos esta orden.</p></div>;
  if (order.status !== "borrador") return <div className="p-7"><Button variant="link" onClick={() => router.push(detailHref)}>Regresar</Button><div className="mt-6 rounded-xl border border-dashed p-8 text-sm text-muted-foreground">Solo las órdenes en borrador pueden editarse.</div></div>;
  const formId = "edit-purchase-form";
  return <div className="w-full px-5 py-7 md:px-7 xl:px-10"><header className="mb-7"><Button variant="link" onClick={() => router.push(detailHref)} className="h-fit px-0">Regresar</Button><h1 className="text-lg font-medium">Editar {order.number}</h1></header><PurchaseForm id={formId} initial={order} suppliers={suppliers} items={items} onSubmit={(values) => { const supplier = suppliers.find((item) => item.id === values.supplierId); updateOrder(order.id, { supplierId: values.supplierId, supplierName: supplier?.tradeName ?? order.supplierName, issuedAt: new Date(`${values.issuedAt}T12:00:00`).toISOString(), expectedAt: new Date(`${values.expectedAt}T12:00:00`).toISOString(), paymentTerms: values.paymentTerms, reference: values.reference, notes: values.notes, lines: values.lines, itemCount: values.lines.length, orderedUnits: values.lines.reduce((sum, line) => sum + line.quantity, 0), total: purchaseTotal(values.lines) }); toastMsg.success("Orden actualizada", `Los cambios de ${order.number} se guardaron.`); router.push(detailHref); }} /><div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit"><Toast formId={formId} submitLabel="Guardar cambios" onCancel={() => router.push(detailHref)} /></div></div>;
}
