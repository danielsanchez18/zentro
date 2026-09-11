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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PosServicePoint } from "@/lib/mock/pos";

type PointKind = PosServicePoint["kind"];

export function AddEditPointDialog({
  open,
  point,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  point?: PosServicePoint;
  onOpenChange: (open: boolean) => void;
  onSave: (point: PosServicePoint) => void;
}) {
  const [name, setName] = useState(point?.name ?? "");
  const [capacity, setCapacity] = useState(String(point?.capacity ?? 4));
  const [kind, setKind] = useState<PointKind>(point?.kind ?? "mesa");
  const save = () => {
    const cleanName = name.trim();
    if (!cleanName) return;
    onSave({
      ...(point ?? {
        id: `point_custom_${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
        status: "disponible" as const,
      }),
      name: cleanName,
      kind,
      capacity: Math.max(1, Number(capacity) || 1),
    });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{point ? "Editar punto" : "Agregar punto"}</DialogTitle>
          <DialogDescription>
            Define cómo se identificará este espacio dentro del local.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Nombre</label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Mesa 05"
              className="px-4 py-2 h-fit"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={kind}
              onValueChange={(value) => setKind(String(value) as PointKind)}
            >
              <SelectTrigger className="w-full h-fit px-4 py-2 capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mesa">Mesa</SelectItem>
                <SelectItem value="mostrador">Mostrador</SelectItem>
                <SelectItem value="box">Box</SelectItem>
                <SelectItem value="cabina">Cabina</SelectItem>
                <SelectItem value="silla">Silla</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Capacidad máxima</label>
            <Input
              type="number"
              min={1}
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              className="px-4 py-2 h-fit [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            onClick={save}
            disabled={!name.trim()}
            className="rounded-full"
          >
            {point ? "Guardar cambios" : "Agregar punto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
