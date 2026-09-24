"use client";

import {
  Ban,
  Download,
  Eye,
  FilePlus2,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  invoiceTypeLabel,
  invoiceStatusLabel,
  type Invoice,
  type InvoiceStatus,
} from "@/lib/mock/billing";
import { cn } from "@/lib/utils";

interface BillingDetailHeaderProps {
  invoice: Invoice;
  slug: string;
  onSend?: () => void;
  onDownload?: () => void;
  onPreview?: () => void;
  onNote?: () => void;
  onAnnul?: () => void;
}

export function BillingDetailHeader({
  invoice,
  slug,
  onSend,
  onDownload,
  onPreview,
  onNote,
  onAnnul,
}: BillingDetailHeaderProps) {
  const router = useRouter();

  const statusVariant = (status: InvoiceStatus) => {
    switch (status) {
      case "pagado":
        return "success";
      case "emitido":
        return "warning";
      case "enviado":
        return "info";
      case "anulado":
        return "error";
      default:
        return "default";
    }
  };

  const isEmitido = invoice.status === "emitido";
  const isAnulado = invoice.status === "anulado";

  return (
    <header className="space-y-1">
      <Button
        type="button"
        variant="link"
        className="h-fit px-0 text-sm cursor-pointer"
        onClick={() => router.push(`/app/${slug}/facturacion`)}
      >
        Regresar a facturación
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-medium tracking-tight text-foreground">
              {invoice.number}
            </h1>
            <StatusBadge
              status={statusVariant(invoice.status)}
              label={invoiceStatusLabel(invoice.status)}
            />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoiceTypeLabel(invoice.type)} electrónica · Pedido{" "}
            {invoice.orderNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Opción principal */}
          {isEmitido && onSend ? (
            <Button
              type="button"
              onClick={onSend}
              className="rounded-full cursor-pointer gap-1.5"
            >
              Enviar a SUNAT
            </Button>
          ) : onDownload ? (
            <Button
              type="button"
              variant="outline"
              onClick={onDownload}
              className="rounded-full cursor-pointer gap-1.5"
            >
              Descargar PDF
            </Button>
          ) : null}

          {/* Botón de "..." (more) con dropdown de opciones secundarias */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "rounded-full cursor-pointer",
              )}
              aria-label="Más opciones"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 text-sm">
              {onPreview && (
                <DropdownMenuItem
                  onClick={onPreview}
                  className="cursor-pointer gap-2 px-2 py-1.5"
                >
                  <Eye className="size-4" />
                  <span>
                    Ver {invoice.type === "boleta" ? "boleta" : "factura"}
                  </span>
                </DropdownMenuItem>
              )}

              {onNote && !isAnulado && (
                <DropdownMenuItem
                  onClick={onNote}
                  className="cursor-pointer gap-2 px-2 py-1.5"
                >
                  <FilePlus2 className="size-4 text-muted-foreground" />
                  <span>Emitir nota crédito/débito</span>
                </DropdownMenuItem>
              )}

              {isEmitido && onDownload && (
                <DropdownMenuItem
                  onClick={onDownload}
                  className="cursor-pointer gap-2 px-2 py-1.5"
                >
                  <Download className="size-4 text-muted-foreground" />
                  <span>Descargar PDF</span>
                </DropdownMenuItem>
              )}

              {!isEmitido && onSend && (
                <DropdownMenuItem
                  onClick={onSend}
                  className="cursor-pointer gap-2 px-2 py-1.5"
                >
                  <Send className="size-4 text-muted-foreground" />
                  <span>Reenviar a SUNAT</span>
                </DropdownMenuItem>
              )}

              {!isAnulado && onAnnul && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={onAnnul}
                    className="cursor-pointer gap-2 px-2 py-1.5 text-rose-600 focus:text-rose-600 dark:text-rose-400"
                  >
                    <Ban className="size-4" />
                    <span>Anular comprobante</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
