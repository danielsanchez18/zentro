"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderReceipt } from "@/lib/mock/orders";

type ReceiptDraft = Omit<OrderReceipt, "number" | "issuedAt">;

export function IssueReceiptDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (receipt: ReceiptDraft) => void;
}) {
  const [type, setType] = useState<OrderReceipt["type"]>("boleta");
  const [document, setDocument] = useState("");
  const [businessName, setBusinessName] = useState("");
  const invoiceValid =
    type === "boleta" ||
    (document.trim().length === 11 && businessName.trim().length > 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Emitir comprobante</DialogTitle>
          <DialogDescription>
            Registra los datos fiscales del comprobante del pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as OrderReceipt["type"])}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boleta">Boleta de venta</SelectItem>
              <SelectItem value="factura">Factura</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="receipt-document" className="text-sm font-medium">
            {type === "factura" ? "RUC" : "Documento"}{" "}
            <span className="font-normal text-muted-foreground">
              {type === "boleta" ? "(opcional)" : ""}
            </span>
          </label>
          <Input
            id="receipt-document"
            value={document}
            onChange={(event) =>
              setDocument(event.target.value.replace(/\D/g, ""))
            }
            maxLength={type === "factura" ? 11 : 8}
            placeholder={type === "factura" ? "11 dígitos" : "DNI"}
          />
        </div>
        {type === "factura" && (
          <div className="flex flex-col gap-y-2">
            <label htmlFor="business-name" className="text-sm font-medium">
              Razón social
            </label>
            <Input
              id="business-name"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Nombre fiscal"
            />
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            disabled={!invoiceValid}
            onClick={() =>
              onConfirm({
                type,
                customerDocument: document.trim() || undefined,
                businessName:
                  type === "factura" ? businessName.trim() : undefined,
              })
            }
            className="rounded-full"
          >
            Emitir comprobante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
