"use client";

import { useState } from "react";
import { Bike, MapPin, Motorbike, Navigation, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastMsg } from "@/components/ui/toast-message";
import {
  availableCouriers,
  type CourierStatus,
  type CustomerOrder,
} from "@/lib/mock/orders";
import { useOrdersStore } from "@/stores/orders-store";
import { cn } from "@/lib/utils";

const deliverySteps: { status: CourierStatus; label: string }[] = [
  { status: "asignado", label: "Asignado" },
  { status: "recogido", label: "Recogido" },
  { status: "en_camino", label: "En camino" },
  { status: "entregado", label: "Entregado" },
];

const nextCourierStatus: Partial<Record<CourierStatus, CourierStatus>> = {
  asignado: "recogido",
  recogido: "en_camino",
  en_camino: "entregado",
};

const actionLabel: Partial<Record<CourierStatus, string>> = {
  asignado: "Marcar como recogido",
  recogido: "Iniciar recorrido",
  en_camino: "Confirmar entrega",
};

export function CourierTracking({ order }: { order: CustomerOrder }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(
    order.courier?.id ?? "",
  );
  const assignCourier = useOrdersStore((state) => state.assignCourier);
  const updateCourierStatus = useOrdersStore(
    (state) => state.updateCourierStatus,
  );

  if (order.serviceType !== "delivery") return null;

  const courier = order.courier;
  const currentStep = courier
    ? deliverySteps.findIndex((step) => step.status === courier.status)
    : -1;
  const canManage = !["entregado", "cancelado"].includes(order.status);

  const confirmAssignment = () => {
    const selected = availableCouriers.find(
      (item) => item.id === selectedCourier,
    );
    if (!selected || !assignCourier(order.id, selected)) return;
    toastMsg.success("Repartidor asignado", selected.name);
    setAssignOpen(false);
  };

  const advanceDelivery = () => {
    if (!courier) return;
    const next = nextCourierStatus[courier.status];
    if (!next || !updateCourierStatus(order.id, next)) return;
    toastMsg.success(
      "Entrega actualizada",
      deliverySteps.find((step) => step.status === next)?.label,
    );
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium">Seguimiento de entrega</h2>
        {canManage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssignOpen(true)}
            className="rounded-full"
          >
            {courier ? "Cambiar" : "Asignar"}
          </Button>
        )}
      </header>

      <div className="p-5">
        {courier ? (
          <>
            <div className="relative h-52 overflow-hidden rounded-xl border border-border bg-muted/30">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute left-[12%] top-[65%] size-4 rounded-full border-4 border-background bg-primary" />
              <div
                className="absolute left-[18%] top-1/2 h-1 -rotate-6 bg-primary/35"
                style={{ width: `${Math.max(12, courier.progress * 0.65)}%` }}
              />
              <div
                className="absolute top-[32%] flex size-9 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground transition-transform"
                style={{
                  left: `${Math.min(82, 16 + courier.progress * 0.66)}%`,
                }}
              >
                <Navigation className="size-4" />
              </div>
              <span className="absolute bottom-3 left-3 rounded-lg bg-background px-3 py-2 text-xs font-medium ring-1 ring-border">
                {courier.status === "entregado"
                  ? "Entrega completada"
                  : `ETA ${courier.etaMinutes} min`}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Bike className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="size-2 rounded-full bg-green-500" />
                      <div className="absolute inset-0 size-2 animate-ping rounded-full bg-green-500" />
                    </div>
                    <p className="text-sm font-medium">{courier.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {courier.vehicle}
                    {courier.plate ? ` · ${courier.plate}` : ""}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${courier.phone}`}
                className="text-sm font-medium text-primary underline underline-offset-4"
              >
                Llamar
              </a>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2 border-t border-border pt-5">
              {deliverySteps.map((step, index) => (
                <div key={step.status} className="min-w-0">
                  <div
                    className={cn(
                      "h-1 rounded-sm",
                      index <= currentStep ? "bg-foreground" : "bg-muted",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-2 truncate text-sm",
                      index === currentStep
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>

            {canManage && courier.status !== "entregado" && (
              <Button
                className="mt-5 w-full rounded-full"
                onClick={advanceDelivery}
              >
                {actionLabel[courier.status]}
              </Button>
            )}
          </>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border font-sans p-5 text-center">
            <div className="size-10 rounded-lg bg-accent flex items-center justify-center">
              <Bike className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-base font-medium">
              Sin repartidor asignado
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Asigna un repartidor para iniciar el seguimiento del delivery.
            </p>
            {canManage && (
              <Button
                className="mt-4 rounded-full"
                size="sm"
                onClick={() => setAssignOpen(true)}
              >
                Asignar repartidor
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {courier ? "Cambiar repartidor" : "Asignar repartidor"}
            </DialogTitle>
            <DialogDescription>
              Selecciona quién realizará la entrega de {order.number}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium">Repartidor disponible</label>
            <Select
              value={selectedCourier}
              onValueChange={(value) => setSelectedCourier(value as string)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un repartidor" />
              </SelectTrigger>
              <SelectContent>
                {availableCouriers.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <span>{item.name}</span>
                    <span className="mx-1">-</span>
                    <span className="text-muted-foreground">
                      {item.vehicle}
                      {item.plate ? ` · ${item.plate}` : ""}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignOpen(false)}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button
              disabled={!selectedCourier}
              onClick={confirmAssignment}
              className="rounded-full"
            >
              Confirmar asignación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
