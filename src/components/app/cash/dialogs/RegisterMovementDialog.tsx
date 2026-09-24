"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  CreditCard,
  Landmark,
  Package2,
  Smartphone,
  WalletCards,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toastMsg } from "@/components/ui/toast-message";
import {
  cashMovementTypeLabel,
  cashPaymentMethodLabel,
  type CashMovementType,
  type CashPaymentMethod,
} from "@/lib/mock/cash";
import { posStaff } from "@/lib/mock/pos";
import { useCashStore } from "@/stores/cash-store";
import { cn } from "@/lib/utils";
import { StaffSearchSelect } from "./StaffSearchSelect";

const manualTypes: CashMovementType[] = [
  "ingreso",
  "retiro",
  "gasto",
  "reembolso",
  "ajuste",
];

const allMethods: CashPaymentMethod[] = [
  "efectivo",
  "tarjeta",
  "yape",
  "plin",
  "transferencia",
];

function getMethodIcon(method: CashPaymentMethod) {
  switch (method) {
    case "efectivo":
      return Banknote;
    case "tarjeta":
      return CreditCard;
    case "yape":
    case "plin":
      return Smartphone;
    case "transferencia":
      return Landmark;
    default:
      return WalletCards;
  }
}

export function RegisterMovementDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const sessions = useCashStore((state) => state.sessions);
  const settings = useCashStore((state) => state.settings);
  const addMovement = useCashStore((state) => state.addMovement);

  const active = useMemo(
    () => sessions.filter((item) => item.status === "abierta"),
    [sessions],
  );

  const methods = allMethods.filter((item) =>
    settings.acceptedMethods.includes(item),
  );

  const [sessionId, setSessionId] = useState("");
  const [type, setType] = useState<CashMovementType>("ingreso");
  const [method, setMethod] = useState<CashPaymentMethod>("efectivo");
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [reference, setReference] = useState("");
  const [staffId, setStaffId] = useState("staff_3");

  const submit = () => {
    const numeric = Number(amount);
    const staff = posStaff.find((item) => item.id === staffId);
    if (
      !sessionId ||
      !staff ||
      !concept.trim() ||
      !Number.isFinite(numeric) ||
      numeric <= 0
    )
      return;

    const direction = ["retiro", "gasto", "reembolso"].includes(type)
      ? "salida"
      : "entrada";

    addMovement({
      id: `cash_move_${crypto.randomUUID()}`,
      sessionId,
      type,
      method,
      amount: numeric,
      direction,
      concept: concept.trim(),
      reference: reference.trim() || undefined,
      responsibleName: staff.name,
      createdAt: new Date().toISOString(),
    });

    toastMsg.success(
      "Movimiento registrado",
      `${direction === "entrada" ? "Ingreso" : "Salida"} de S/ ${numeric.toFixed(2)}.`,
    );

    onOpenChange(false);
    setAmount("");
    setConcept("");
    setReference("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (value && !sessionId) setSessionId(active[0]?.id ?? "");
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg flex flex-col">
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
          <DialogDescription>
            Usa esta acción para operaciones manuales. Los cobros de POS se
            registrarán automáticamente en integración.
          </DialogDescription>
        </DialogHeader>

        {active.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-medium">Necesitas una caja abierta</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Abre una terminal antes de registrar movimientos.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 font-heading overflow-y-auto">
            {/* Selección de Terminal / Sesión por Chips si son pocas (<= 4) */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Terminal / Caja</span>
                <span className="text-sm text-muted-foreground">
                  {active.length}{" "}
                  {active.length === 1 ? "caja abierta" : "cajas abiertas"}
                </span>
              </div>

              {active.length <= 4 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {active.map((item) => {
                    const isSelected = item.id === sessionId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSessionId(item.id)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span className="p-2 rounded-md bg-accent">
                          <Package2 className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.terminalName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.openedByName}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Select
                  value={sessionId}
                  onValueChange={(value) => setSessionId(String(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {active.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.terminalName} · {item.openedByName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Tipo de movimiento */}
            <label className="flex flex-col gap-2 text-sm font-medium">
              Tipo
              <Select
                value={type}
                onValueChange={(value) => setType(value as CashMovementType)}
              >
                <SelectTrigger className="w-full capitalize px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {manualTypes.map((item) => (
                    <SelectItem key={item} value={item}>
                      {cashMovementTypeLabel(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            {/* Método de pago */}
            <label className="flex flex-col gap-2 text-sm font-medium">
              Método
              <Select
                value={method}
                onValueChange={(value) => setMethod(value as CashPaymentMethod)}
              >
                <SelectTrigger className="w-full capitalize px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {methods.map((item) => {
                    const Icon = getMethodIcon(item);
                    return (
                      <SelectItem key={item} value={item}>
                        <div className="flex items-center gap-2.5 font-heading">
                          <Icon className="size-4 text-muted-foreground" />
                          <span>{cashPaymentMethodLabel(item)}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </label>

            {/* Importe con prefijo S/. */}
            <label className="flex flex-col gap-2 text-sm font-medium">
              Importe
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground select-none pointer-events-none">
                  S/.
                </span>
                <Input
                  type="number"
                  min="0.01"
                  step="0.10"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="pl-9 text-sm h-fit py-2.25"
                />
              </div>
            </label>

            {/* Responsable con foto y búsqueda */}
            <div className="flex flex-col gap-2 text-sm font-medium">
              <span>Responsable</span>
              <StaffSearchSelect
                value={staffId}
                onValueChange={setStaffId}
                placeholder="Seleccionar responsable..."
              />
            </div>

            {/* Concepto */}
            <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
              Concepto
              <Textarea
                value={concept}
                onChange={(event) => setConcept(event.target.value)}
                placeholder="Motivo del movimiento..."
                className="resize-none"
                rows={2}
              />
            </label>

            {/* Referencia opcional */}
            <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
              Referencia opcional
              <Input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="Autorización, documento o comentario"
                className="px-3 h-fit py-2"
              />
            </label>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={
              active.length === 0 ||
              !sessionId ||
              !concept.trim() ||
              Number(amount) <= 0
            }
            onClick={submit}
            className="rounded-full"
          >
            Registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
