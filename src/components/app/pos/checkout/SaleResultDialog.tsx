import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SaleResultDialog({
  open,
  slug,
  orderId,
  number,
  total,
  paidAmount,
  onNewSale,
}: {
  open: boolean;
  slug: string;
  orderId: string;
  number: string;
  total: number;
  paidAmount: number;
  onNewSale: () => void;
}) {
  const formatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  });
  const balance = Math.max(0, total - paidAmount);
  const isPaid = balance === 0;

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <BadgeCheck className="size-6" />
        </div>
        <DialogHeader className="text-center">
          <DialogTitle>{isPaid ? "Venta confirmada" : "Pedido abierto"}</DialogTitle>
          <DialogDescription>
            {number} fue enviado a Pedidos. Total {formatter.format(total)}. {paidAmount > 0 ? `Pagado ${formatter.format(paidAmount)} · Saldo ${formatter.format(balance)}.` : `Quedó pendiente de pago por ${formatter.format(balance)}.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            render={<Link href={`/app/${slug}/pedidos/${orderId}`} />}
            nativeButton={false}
            className="rounded-full"
          >
            Abrir pedido
          </Button>
          <Button onClick={onNewSale} className="rounded-full">
            Nueva venta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
