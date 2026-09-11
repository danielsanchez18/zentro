import { useState } from "react";
import { HandPlatter, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PosCartLine, PosServiceType } from "../shared/types";
import type { PosCustomer, PosServicePoint } from "@/lib/mock/pos";
import { CartLine } from "./CartLine";
import { CustomerSearchDialog } from "./CustomerSearchDialog";

const money = (value: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    value,
  );
export function CartPanel({
  lines,
  serviceType,
  customer,
  reference,
  discount,
  selectedPoint,
  onServiceType,
  onCustomer,
  onCustomerSelect,
  onReference,
  onQuantity,
  onNote,
  onRemove,
  onDiscount,
  onSelectPoint,
  onSuspend,
  onOpenOrder,
  onCheckout,
}: {
  lines: PosCartLine[];
  serviceType: PosServiceType;
  customer: string;
  reference: string;
  discount: number;
  selectedPoint?: PosServicePoint;
  onServiceType: (value: PosServiceType) => void;
  onCustomer: (value: string) => void;
  onCustomerSelect: (customer: PosCustomer) => void;
  onReference: (value: string) => void;
  onQuantity: (id: string, value: number) => void;
  onNote: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onDiscount: () => void;
  onSelectPoint: () => void;
  onSuspend: () => void;
  onOpenOrder: () => void;
  onCheckout: () => void;
}) {
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const total = Math.max(0, subtotal - discount);
  return (
    <>
    <aside className="w-full rounded-xl border bg-card lg:sticky lg:top-4 lg:w-96">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Venta actual</h2>
          <span className="text-sm text-muted-foreground">
            {lines.reduce((sum, line) => sum + line.quantity, 0)} unidades
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-muted border border-border p-1">
          {(["mesa", "recojo", "delivery"] as PosServiceType[]).map((type) => (
            <Button
              key={type}
              variant={serviceType === type ? "default" : "secondary"}
              onClick={() => onServiceType(type)}
            >
              {type === "mesa"
                ? "Local"
                : type === "recojo"
                  ? "Recojo"
                  : "Delivery"}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {serviceType === "mesa" ? (
            <Button
              type="button"
              variant="outline"
              className="h-auto w-full items-start justify-start whitespace-normal px-4 py-2 text-left gap-2"
              onClick={onSelectPoint}
            >
              <HandPlatter className="mt-0.5" />
              {selectedPoint
                ? `Punto seleccionado: ${selectedPoint.name} - máx. ${selectedPoint.capacity} personas`
                : "Seleccionar punto de atención"}
            </Button>
          ) : null}
          {serviceType === "mesa" ? (
            <div className="flex gap-2">
              <Input placeholder="Cliente o invitado (opcional)" value={customer} onChange={(event) => onCustomer(event.target.value)} className="h-fit min-w-0 flex-1 px-4 py-2 text-sm font-heading" />
              <Button type="button" variant="outline" onClick={() => setCustomerSearchOpen(true)}>Buscar</Button>
            </div>
          ) : (
            <Input placeholder={serviceType === "delivery" ? "Nombre del cliente *" : "Cliente o invitado"} value={customer} onChange={(event) => onCustomer(event.target.value)} className="h-fit px-4 py-2 text-sm font-heading" />
          )}
          {serviceType !== "mesa" && (
            <Input
              placeholder={
                serviceType === "delivery"
                  ? "Teléfono y dirección *"
                  : "Hora estimada de recojo"
              }
              value={reference}
              onChange={(event) => onReference(event.target.value)}
              className="px-4 py-2 h-fit text-sm font-heading"
            />
          )}
        </div>
      </div>
      <div className="max-h-[42vh] overflow-y-auto px-4">
        {lines.length ? (
          lines.map((line) => (
            <CartLine
              key={line.id}
              line={line}
              onQuantity={(value) => onQuantity(line.id, value)}
              onNote={(value) => onNote(line.id, value)}
              onRemove={() => onRemove(line.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center py-12 text-center">
            <ShoppingBag className="mb-3 size-7 text-muted-foreground" />
            <p className="font-medium">La venta está vacía</p>
            <p className="text-sm text-muted-foreground">
              Agrega productos del catálogo.
            </p>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-primary">
              <span>Descuento directo</span>
              <span>-{money(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-medium">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            disabled={!lines.length}
            onClick={onDiscount}
          >
            Descuento
          </Button>
          <Button
            variant="outline"
            disabled={!lines.length}
            onClick={onSuspend}
          >
            Suspender
          </Button>
          <Button
            variant="outline"
            disabled={!lines.length}
            onClick={onOpenOrder}
          >
            Abrir pedido
          </Button>
          <Button disabled={!lines.length} onClick={onCheckout}>
            Cobrar ahora
          </Button>
        </div>
      </div>
    </aside>
    <CustomerSearchDialog open={customerSearchOpen} onOpenChange={setCustomerSearchOpen} onSelect={onCustomerSelect} />
    </>
  );
}
