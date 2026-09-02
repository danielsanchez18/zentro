"use client";

import { Banknote, CheckCheck, ClipboardList, Package, Truck, Wallet } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { availableStock, inventoryStatus } from "@/lib/mock/inventory";
import type { CommonDialogProps } from "./types";


export function InventoryPreviewDialog({
  item,
  open,
  onOpenChange,
}: CommonDialogProps) {
  if (!item) return null;
  const available = availableStock(item);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" font-heading">
        
        <DialogHeader>
          <div className="flex size-12 items-center justify-center rounded-xl bg-accent">
            <Package className="size-5 text-muted-foreground" />
          </div>
          <DialogTitle className="pt-2 font-medium">{item.productName}</DialogTitle>
          <DialogDescription className="text-sm">
            {item.sku} · {item.brand}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-x-2">
            <Package className="text-muted-foreground size-4" />
            <p className="text-muted-foreground text-sm">Físico:</p>
            <p className="text-sm">{item.currentStock}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <ClipboardList className="text-muted-foreground size-4" />
            <p className="text-muted-foreground text-sm">Reservado:</p>
            <p className="text-sm">{item.reservedStock}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <CheckCheck className="text-muted-foreground size-4" />
            <p className="text-muted-foreground text-sm">Disponible:</p>
            <p className="text-sm">{available}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <Package className="text-muted-foreground size-4" />
            <p className="text-muted-foreground text-sm">Mínimo:</p>
            <p className="text-sm">{item.minimumStock}</p>
          </div>
        </div>

        <div className="grid gap-3 border-t border-border pt-5 text-sm">
          <p className="flex items-center gap-2">
            <Truck className="size-4 text-muted-foreground" />
            <span>
              <span className="text-muted-foreground">Proveedor:</span>{" "}
              {item.supplier}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Wallet className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Costo unitario:</span> S/{" "}
            {item.unitCost.toFixed(2)}
          </p>
          <p className="flex items-center gap-2">
            <Banknote className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Valor en stock:</span> S/{" "}
            {(item.currentStock * item.unitCost).toFixed(2)}
          </p>
          <div>
            <StatusBadge status={inventoryStatus(item)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
