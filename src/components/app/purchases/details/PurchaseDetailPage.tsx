"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackageCheck, Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { usePurchasesStore } from "@/stores/purchases-store";
import { ReceivePurchaseDialog } from "../receptions/ReceivePurchaseDialog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { PurchaseInfo } from "./PurchaseInfo";
import { PurchaseProducts } from "./PurchaseProducts";

type Confirmation = "send" | "cancel" | "delete" | null;
export function PurchaseDetailPage({
  slug,
  purchaseId,
}: {
  slug: string;
  purchaseId: string;
}) {
  const router = useRouter();
  const [receiving, setReceiving] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const order = usePurchasesStore((state) =>
    state.orders.find((item) => item.id === purchaseId),
  );
  const setStatus = usePurchasesStore((state) => state.setStatus);
  const removeOrder = usePurchasesStore((state) => state.removeOrder);
  const href = `/app/${slug}/compras`;
  if (!order)
    return (
      <div className="p-7">
        <Button
          variant="link"
          onClick={() => router.push(href)}
          className="px-0"
        >
          Regresar
        </Button>
        <div className="mt-6 rounded-xl border border-dashed p-10 text-sm text-muted-foreground">
          No encontramos esta orden de compra.
        </div>
      </div>
    );
  const execute = () => {
    if (confirmation === "send") {
      setStatus(order.id, "enviada");
      toastMsg.success(
        "Orden enviada",
        `${order.number} quedó pendiente de recepción.`,
      );
    }
    if (confirmation === "cancel") {
      setStatus(order.id, "cancelada");
      toastMsg.info(
        "Orden cancelada",
        `${order.number} ya no admite recepciones.`,
      );
    }
    if (confirmation === "delete") {
      removeOrder(order.id);
      toastMsg.info(
        "Borrador eliminado",
        `${order.number} se eliminó del prototipo.`,
      );
      router.push(href);
    }
    setConfirmation(null);
  };
  const copy =
    confirmation === "send"
      ? [
          "Enviar orden",
          "La orden dejará de ser editable y quedará disponible para recepción.",
        ]
      : confirmation === "cancel"
        ? [
            "Cancelar orden",
            "La orden quedará cerrada y no admitirá nuevas recepciones.",
          ]
        : [
            "Eliminar borrador",
            "Esta acción eliminará la orden del prototipo.",
          ];
  return (
    <div className="w-full space-y-6 px-5 py-7 md:px-7 xl:px-10">
      <header className="flex flex-col gap-2">
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(href)}
          className="h-fit p-0 w-fit"
        >
          Regresar
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-0.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-medium tracking-tight text-foreground font-heading">
              {order.number}
            </h1>
            <StatusBadge status={order.status} />
          </div>

          <div className="hidden md:flex items-center gap-2">
            {order.status === "borrador" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`${href}/${order.id}/editar`)}
                  className="px-3 rounded-full font-sans"
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  onClick={() => setConfirmation("send")}
                  className="px-3 rounded-full font-sans"
                >
                  <Send className="size-3.5" />
                  Enviar orden
                </Button>
              </>
            )}

            {(["enviada", "parcial"] as string[]).includes(order.status) && (
              <>
                {order.receivedUnits === 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setConfirmation("cancel")}
                    className="px-3 rounded-full font-sans"
                  >
                    Cancelar orden
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => setReceiving(true)}
                  className="px-3 rounded-full font-sans"
                >
                  <PackageCheck className="size-4" />
                  Registrar recepción
                </Button>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-sans">
          Abastecimiento con{" "}
          <strong className="text-foreground font-medium">
            {order.supplierName}
          </strong>{" "}
          · Registrada para el seguimiento de compras.
        </p>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-[auto_1fr]">
        <PurchaseInfo order={order} />
        <div className="xl:order-2">
          <PurchaseProducts order={order} />
        </div>
      </div>
      {!(["recibida", "cancelada"] as string[]).includes(order.status) && (
        <div className="sticky bottom-5 z-40 mx-auto w-fit md:hidden">
          <Toast ariaLabel="Acciones de la orden">
            {order.status === "borrador" && (
              <>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push(`${href}/${order.id}/editar`)}
                  className="px-3 text-green-500"
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setConfirmation("send")}
                  className="px-3 text-sky-400"
                >
                  Enviar
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setConfirmation("delete")}
                  className="px-3 text-rose-400"
                >
                  Eliminar
                </Button>
              </>
            )}
            {(["enviada", "parcial"] as string[]).includes(order.status) && (
              <>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setReceiving(true)}
                  className="px-3 text-green-500"
                >
                  Registrar recepción
                </Button>
                {order.receivedUnits === 0 && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setConfirmation("cancel")}
                    className="px-3 text-rose-400"
                  >
                    Cancelar orden
                  </Button>
                )}
              </>
            )}
          </Toast>
        </div>
      )}
      <ReceivePurchaseDialog
        order={order}
        open={receiving}
        onOpenChange={setReceiving}
      />
      <ConfirmDialog
        open={Boolean(confirmation)}
        onOpenChange={(open) => !open && setConfirmation(null)}
        title={copy[0]}
        description={copy[1]}
        confirmLabel={
          confirmation === "delete"
            ? "Eliminar"
            : confirmation === "cancel"
              ? "Cancelar orden"
              : "Enviar"
        }
        onConfirm={execute}
      />
    </div>
  );
}
