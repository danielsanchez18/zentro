"use client";

import { useMemo, useState } from "react";
import { Monitor, Package2 } from "lucide-react";
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
import { toastMsg } from "@/components/ui/toast-message";
import { posStaff } from "@/lib/mock/pos";
import { useCashStore } from "@/stores/cash-store";
import { cn } from "@/lib/utils";
import { StaffSearchSelect } from "./StaffSearchSelect";

export function OpenCashDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const terminals = useCashStore((state) => state.terminals);
  const sessions = useCashStore((state) => state.sessions);
  const openSession = useCashStore((state) => state.openSession);

  const available = useMemo(
    () =>
      terminals.filter(
        (terminal) =>
          terminal.active &&
          !sessions.some(
            (session) =>
              session.terminalId === terminal.id &&
              session.status === "abierta",
          ),
      ),
    [terminals, sessions],
  );

  const [terminalId, setTerminalId] = useState("");
  const [staffId, setStaffId] = useState("staff_3");
  const [amount, setAmount] = useState("0");

  const selectedTerminalId = terminalId || available[0]?.id || "";

  const submit = () => {
    const terminal = available.find((item) => item.id === selectedTerminalId);
    const staff = posStaff.find((item) => item.id === staffId);
    const openingAmount = Number(amount);

    if (
      !terminal ||
      !staff ||
      !Number.isFinite(openingAmount) ||
      openingAmount < 0
    )
      return;

    openSession({
      id: `session_${crypto.randomUUID()}`,
      terminalId: terminal.id,
      terminalName: terminal.name,
      locationId: terminal.locationId,
      locationName: terminal.locationName,
      status: "abierta",
      openedById: staff.id,
      openedByName: staff.name,
      openedAt: new Date().toISOString(),
      openingAmount,
    });

    toastMsg.success(
      "Caja abierta",
      `${terminal.name} inició con S/ ${openingAmount.toFixed(2)}.`,
    );

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Abrir caja</DialogTitle>
          <DialogDescription>
            Selecciona la terminal, el responsable y el fondo inicial de
            apertura.
          </DialogDescription>
        </DialogHeader>

        {available.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center flex flex-col">
            <div className="rounded-md bg-accent p-2.5 w-fit mx-auto">
              <Package2 className="size-5" />
            </div>
            <h3 className="mt-3 text-sm font-medium">
              Todas las terminales están abiertas
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cierra una sesión activa o configura otra terminal en el sistema.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 font-heading">
            {/* Terminal por Chips si son pocas (<= 4) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Terminal</span>
                <span className="text-sm text-muted-foreground">
                  {available.length}{" "}
                  {available.length === 1 ? "disponible" : "disponibles"}
                </span>
              </div>

              {available.length <= 4 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {available.map((item) => {
                    const isSelected = item.id === selectedTerminalId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTerminalId(item.id)}
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
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.locationName}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Select
                  value={selectedTerminalId}
                  onValueChange={(value) => setTerminalId(String(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {available.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} · {item.locationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Responsable con foto y buscador */}
            <div className="flex flex-col gap-2 text-sm font-medium">
              <span>Responsable</span>
              <StaffSearchSelect
                value={staffId}
                onValueChange={setStaffId}
                placeholder="Seleccionar responsable..."
              />
            </div>

            {/* Fondo inicial con prefijo S/. */}
            <label className="flex flex-col gap-2 text-sm font-medium">
              Fondo inicial
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground select-none pointer-events-none">
                  S/.
                </span>
                <Input
                  type="number"
                  min="0"
                  step="0.10"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="pl-9 text-sm"
                />
              </div>
              <span className="text-xs font-normal text-muted-foreground">
                Efectivo físico disponible al iniciar el turno.
              </span>
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
            disabled={available.length === 0 || !selectedTerminalId}
            onClick={submit}
            className="rounded-full"
          >
            Abrir sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
