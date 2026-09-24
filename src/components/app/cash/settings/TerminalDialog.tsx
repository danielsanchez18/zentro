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
import { Switch } from "@/components/ui/switch";
import { toastMsg } from "@/components/ui/toast-message";
import type { CashTerminal } from "@/lib/mock/cash";
import { useCashStore } from "@/stores/cash-store";
import { Package2 } from "lucide-react";

export function TerminalDialog({
  onOpenChange,
  terminal,
}: {
  onOpenChange: (open: boolean) => void;
  terminal?: CashTerminal | null;
}) {
  const add = useCashStore((state) => state.addTerminal);
  const update = useCashStore((state) => state.updateTerminal);
  const [name, setName] = useState(terminal?.name ?? "");
  const [active, setActive] = useState(terminal?.active ?? true);
  const submit = () => {
    if (!name.trim()) return;
    if (terminal) update(terminal.id, { name: name.trim(), active });
    else
      add({
        id: `terminal_${crypto.randomUUID()}`,
        name: name.trim(),
        locationId: "loc_1",
        locationName: "Monsefú",
        active,
      });
    toastMsg.success(
      terminal ? "Terminal actualizada" : "Terminal creada",
      name.trim(),
    );
    onOpenChange(false);
  };
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {terminal ? "Editar terminal" : "Nueva terminal"}
          </DialogTitle>
          <DialogDescription>
            Las terminales organizan sesiones y cobros dentro de la ubicación
            activa.
          </DialogDescription>
        </DialogHeader>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Nombre
          <div className="relative">
            <Package2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Caja principal"
              className="pl-9 py-2 h-fit"
            />
          </div>
        </label>
        <div className="flex items-center justify-between rounded-lg font-heading border border-border px-3 py-3">
          <div>
            <p className="text-sm font-medium">Terminal habilitada</p>
            <p className="text-xs text-muted-foreground">
              Puede utilizarse para abrir nuevas sesiones.
            </p>
          </div>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="rounded-full"
            disabled={!name.trim()}
            onClick={submit}
          >
            Guardar terminal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
