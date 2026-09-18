"use client";

import React, { useEffect, useState, type FormEvent } from "react";
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
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import { useAgendaSettingsStore } from "@/stores/agenda-settings-store";

const RESOURCE_KINDS: {
  id: "cabina" | "sala" | "silla" | "equipo";
  label: string;
}[] = [
  { id: "cabina", label: "Cabina" },
  { id: "sala", label: "Sala de atención" },
  { id: "silla", label: "Silla / Sillón" },
  { id: "equipo", label: "Equipo / Aparatología" },
];

interface CreateResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateResourceDialog({
  open,
  onOpenChange,
}: CreateResourceDialogProps) {
  const addResource = useAgendaSettingsStore((state) => state.addResource);

  const [name, setName] = useState("");
  const [kind, setKind] = useState<"cabina" | "sala" | "silla" | "equipo">(
    "cabina",
  );
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setKind("cabina");
      setTouched(false);
    }
  }, [open]);

  const isValid = Boolean(name.trim());
  const showError = touched && !isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      setTouched(true);
      toastMsg.error("Falta el nombre", "Ingresa el nombre del recurso.");
      return;
    }

    addResource({
      name: name.trim(),
      kind,
      status: "activo",
    });

    toastMsg.success(
      "Recurso agregado",
      `Se agregó «${name.trim()}» exitosamente.`,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo recurso</DialogTitle>
          <DialogDescription>
            Registra una sala, cabina, sillón o equipamiento para tus servicios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
          {/* Nombre del recurso */}
          <div className="grid gap-1.5">
            <label htmlFor="resource-name" className="text-sm font-medium">
              Nombre del recurso <span className="text-destructive">*</span>
            </label>
            <Input
              id="resource-name"
              placeholder="Ej. Cabina 1, Sillón Dental 2, Láser Diodo"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setTouched(true);
              }}
              aria-invalid={showError}
              autoFocus
              className="h-fit py-2 px-3 text-sm"
            />
            {showError && (
              <p className="text-xs text-destructive">
                El nombre del recurso es obligatorio.
              </p>
            )}
          </div>

          {/* Tipo de recurso */}
          <div className="grid gap-2">
            <span className="text-sm font-medium">Tipo de recurso</span>
            <div className="flex flex-wrap gap-2">
              {RESOURCE_KINDS.map((item) => {
                const isSelected = kind === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setKind(item.id)}
                    className={cn(
                      "cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="rounded-full cursor-pointer"
            >
              Guardar recurso
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
