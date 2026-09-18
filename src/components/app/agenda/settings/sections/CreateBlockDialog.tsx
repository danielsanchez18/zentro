"use client";

import React, { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import { useAgendaSettingsStore } from "@/stores/agenda-settings-store";

interface CreateBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("es-PE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function CreateBlockDialog({
  open,
  onOpenChange,
}: CreateBlockDialogProps) {
  const addBlock = useAgendaSettingsStore((state) => state.addBlock);

  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDate("");
      setReason("");
      setTouched(false);
      setCalendarOpen(false);
    }
  }, [open]);

  const isValid = Boolean(date && reason.trim());
  const showDateError = touched && !date;
  const showReasonError = touched && !reason.trim();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      setTouched(true);
      toastMsg.error(
        "Faltan datos",
        "Por favor especifica la fecha y el motivo de la excepción.",
      );
      return;
    }

    addBlock(date, reason.trim());
    toastMsg.success(
      "Bloqueo registrado",
      "Se añadió la excepción al calendario.",
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo bloqueo o excepción</DialogTitle>
          <DialogDescription>
            Registra feriados, días no laborables o mantenimientos donde no se
            permitirán reservas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
          {/* Fecha del bloqueo con shadcn Calendar */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">
              Fecha del bloqueo <span className="text-destructive">*</span>
            </label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="w-full min-w-0 cursor-pointer flex items-center justify-between gap-2 h-fit py-2 px-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted/40 transition-colors text-left"
                    aria-invalid={showDateError}
                  />
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CalendarDays className="size-4 text-muted-foreground shrink-0" />
                  <span
                    className={cn(
                      "truncate min-w-0 capitalize",
                      !date && "text-muted-foreground font-normal",
                    )}
                  >
                    {date ? formatDisplayDate(date) : "Seleccionar fecha..."}
                  </span>
                </div>
                <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-fit p-0 rounded-xl overflow-hidden shadow-xl border border-border bg-popover z-50"
              >
                <Calendar
                  mode="single"
                  selected={date ? new Date(`${date}T12:00:00`) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      const key = [
                        d.getFullYear(),
                        String(d.getMonth() + 1).padStart(2, "0"),
                        String(d.getDate()).padStart(2, "0"),
                      ].join("-");
                      setDate(key);
                      setCalendarOpen(false);
                    }
                  }}
                  locale={es}
                  defaultMonth={date ? new Date(`${date}T12:00:00`) : new Date()}
                />
              </PopoverContent>
            </Popover>

            {showDateError && (
              <p className="text-xs text-destructive">
                Debes seleccionar una fecha.
              </p>
            )}
          </div>

          {/* Motivo o descripción */}
          <div className="grid gap-1.5">
            <label htmlFor="block-reason" className="text-sm font-medium">
              Motivo o descripción <span className="text-destructive">*</span>
            </label>
            <Input
              id="block-reason"
              placeholder="Ej. Feriado nacional, Mantenimiento de local..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setTouched(true);
              }}
              aria-invalid={showReasonError}
              className="h-fit py-2 px-3 text-sm"
            />
            {showReasonError && (
              <p className="text-xs text-destructive">
                El motivo o descripción es obligatorio.
              </p>
            )}
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
              Guardar bloqueo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
