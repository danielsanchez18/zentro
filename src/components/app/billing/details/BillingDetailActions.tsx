"use client";

import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import type { InvoiceStatus } from "@/lib/mock/billing";

interface BillingDetailActionsProps {
  status: InvoiceStatus;
  onSend?: () => void;
  onDownload?: () => void;
  onAnnul?: () => void;
  onMarkPaid?: () => void;
}

export function BillingDetailActions({
  status,
  onSend,
  onDownload,
  onAnnul,
  onMarkPaid,
}: BillingDetailActionsProps) {
  const isAnulado = status === "anulado";
  const isEmitido = status === "emitido";
  const isEnviado = status === "enviado";

  return (
    <Toast ariaLabel="Acciones de facturación">
      {/* Opción 1: Acción secundaria / destructiva */}
      {!isAnulado && onAnnul && (
        <Button
          type="button"
          variant="link"
          onClick={onAnnul}
          className="cursor-pointer px-3 text-rose-400 hover:text-rose-300 text-sm font-medium"
        >
          Anular
        </Button>
      )}

      {/* Opción 2: Acción principal según el estado */}
      {isEmitido && onSend ? (
        <Button
          type="button"
          variant="secondary"
          onClick={onSend}
          className="cursor-pointer px-3.5 rounded-full text-sm font-medium"
        >
          Enviar SUNAT
        </Button>
      ) : isEnviado && onMarkPaid ? (
        <Button
          type="button"
          variant="secondary"
          onClick={onMarkPaid}
          className="cursor-pointer px-3.5 rounded-full text-sm font-medium"
        >
          Marcar como pagado
        </Button>
      ) : onDownload ? (
        <Button
          type="button"
          variant="secondary"
          onClick={onDownload}
          className="cursor-pointer px-3.5 rounded-full text-sm font-medium"
        >
          Descargar PDF
        </Button>
      ) : null}
    </Toast>
  );
}
