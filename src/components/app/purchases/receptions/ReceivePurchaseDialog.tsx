"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toastMsg } from "@/components/ui/toast-message";
import type { PurchaseOrder } from "@/lib/mock/purchases";
import { useInventoryStore } from "@/stores/inventory-store";
import { usePurchasesStore } from "@/stores/purchases-store";

export function ReceivePurchaseDialog({ order, open, onOpenChange }: { order: PurchaseOrder; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const items = useInventoryStore((state) => state.items);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const addMovement = useInventoryStore((state) => state.addMovement);
  const receive = usePurchasesStore((state) => state.receive);
  const confirm = () => {
    const selected = order.lines.filter((line) => (quantities[line.id] ?? 0) > 0);
    if (!selected.length) { toastMsg.error("Recepción vacía", "Ingresa al menos una cantidad recibida."); return; }
    const now = new Date().toISOString();
    selected.forEach((line) => { const quantity = quantities[line.id]; const item = items.find((candidate) => candidate.id === line.inventoryItemId); if (!item) return; const resultingStock = item.currentStock + quantity; updateItem(item.id, { currentStock: resultingStock, unitCost: line.unitCost, updatedAt: now }); addMovement({ id: `mov_${Date.now()}_${line.id}`, itemId: item.id, type: "entrada", quantity, previousStock: item.currentStock, resultingStock, createdAt: now, reason: "Recepción de compra", documentRef: order.number, notes: `Proveedor: ${order.supplierName}` }); });
    receive(order.id, quantities);
    toastMsg.success("Recepción registrada", `${selected.reduce((sum, line) => sum + quantities[line.id], 0)} unidades ingresaron al inventario.`);
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Registrar recepción</DialogTitle><p className="text-sm text-muted-foreground">Confirma las cantidades recibidas para {order.number}. Se generarán entradas de inventario.</p></DialogHeader><div className="max-h-[55vh] space-y-3 overflow-y-auto py-1">{order.lines.map((line) => { const pending = line.quantity - line.receivedQuantity; return <div key={line.id} className="grid items-center gap-3 rounded-xl border border-border p-4 sm:grid-cols-[1fr_110px_130px]"><div><p className="text-sm font-medium">{line.productName}</p><p className="mt-1 text-xs text-muted-foreground">{line.sku} · {line.receivedQuantity} recibidas · {pending} pendientes</p></div><Button type="button" variant="outline" disabled={!pending} onClick={() => setQuantities((current) => ({ ...current, [line.id]: pending }))} className="rounded-full px-3">Recibir todo</Button><div className="flex flex-col gap-y-2"><label htmlFor={`receive-${line.id}`} className="text-sm font-medium">Cantidad</label><Input id={`receive-${line.id}`} type="number" min={0} max={pending} disabled={!pending} value={quantities[line.id] ?? 0} onChange={(event) => setQuantities((current) => ({ ...current, [line.id]: Math.min(pending, Math.max(0, Number(event.target.value))) }))} /></div></div>; })}</div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-3">Cancelar</Button><Button type="button" onClick={confirm} className="rounded-full px-3">Confirmar recepción</Button></DialogFooter></DialogContent></Dialog>;
}
