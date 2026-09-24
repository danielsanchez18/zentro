"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Invoice } from "@/lib/mock/billing";
import { useBillingStore } from "@/stores/billing-store";
import { InvoiceTemplatePreview } from "../settings/InvoiceTemplatePreview";

interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  onDownload?: () => void;
}

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  invoice,
  onDownload,
}: InvoicePreviewDialogProps) {
  const config = useBillingStore((state) => state.config);

  // Los comprobantes ya emitidos usan el snapshot fiscal del momento de emisión
  // (un cambio posterior de la config no debe alterar comprobantes previos).
  const emitter = invoice.fiscalSnapshot ?? config;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden font-heading">
        <DialogHeader>
          <DialogTitle>Vista previa · {invoice.number}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          <InvoiceTemplatePreview
            type={invoice.type}
            config={emitter}
            invoice={invoice}
          />
        </div>

        <DialogFooter className="font-sans">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full cursor-pointer"
          >
            Cerrar
          </Button>
          {onDownload && (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onDownload();
              }}
              className="rounded-full cursor-pointer"
            >
              Descargar PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
