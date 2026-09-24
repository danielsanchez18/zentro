"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Coins,
  Lock,
  TrendingUp,
  User,
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
import { Textarea } from "@/components/ui/textarea";
import { toastMsg } from "@/components/ui/toast-message";
import type { CashSession } from "@/lib/mock/cash";
import { cn } from "@/lib/utils";
import { useCashStore } from "@/stores/cash-store";
import { expectedCash } from "../overview/CashKpis";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function CloseCashDialog({
  session,
  onOpenChange,
}: {
  session: CashSession;
  onOpenChange: (open: boolean) => void;
}) {
  const movements = useCashStore((state) => state.movements);
  const settings = useCashStore((state) => state.settings);
  const closeSession = useCashStore((state) => state.closeSession);

  const expected = expectedCash(session, movements);
  const [counted, setCounted] = useState(() => expected.toFixed(2));
  const [notes, setNotes] = useState("");

  const numericCounted = Number(counted || 0);
  const difference = numericCounted - expected;
  const isBalanced = Math.abs(difference) <= 0.009;
  const notesRequired = settings.requireClosingNotesOnDifference && !isBalanced;

  const submit = () => {
    const amount = Number(counted);
    if (
      !Number.isFinite(amount) ||
      amount < 0 ||
      (notesRequired && !notes.trim())
    )
      return;

    closeSession(
      session.id,
      amount,
      expected,
      session.openedByName,
      notes.trim() || undefined,
    );

    toastMsg.success(
      "Caja cerrada",
      isBalanced
        ? "El arqueo quedó sin diferencias."
        : `Diferencia registrada: ${money.format(difference)}.`,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cerrar {session.terminalName}</DialogTitle>
          <DialogDescription>
            Verifica el efectivo físico disponible en el cajón para contrastarlo
            con las operaciones registradas.
          </DialogDescription>
        </DialogHeader>

        {/* Tarjetas comparativas: Esperado vs Diferencia */}
        <div className="grid grid-cols-2 gap-3 font-heading">
          <div className="rounded-xl border border-border bg-card p-3.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm">Efectivo esperado</span>
              <Coins className="size-4" />
            </div>
            <p className="mt-1 text-lg font-medium tabular-nums text-foreground">
              {money.format(expected)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Fondo + ingresos netos
            </p>
          </div>

          <div
            className={cn(
              "rounded-xl border p-3.5 transition-colors",
              isBalanced
                ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400"
                : difference > 0
                  ? "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400"
                  : "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {isBalanced
                  ? "Arqueo cuadrado"
                  : difference > 0
                    ? "Sobrante (+)"
                    : "Faltante (-)"}
              </span>
              {isBalanced ? (
                <CheckCircle2 className="size-4" />
              ) : difference > 0 ? (
                <TrendingUp className="size-4" />
              ) : (
                <AlertCircle className="size-4" />
              )}
            </div>
            <p className="mt-1 text-lg font-medium tabular-nums">
              {isBalanced
                ? "S/ 0.00"
                : difference > 0
                  ? `+${money.format(difference)}`
                  : money.format(difference)}
            </p>
            <p className="mt-1 text-xs font-medium opacity-85">
              {isBalanced
                ? "Sin diferencias"
                : difference > 0
                  ? "Exceso respecto a lo esperado"
                  : "Monto menor a lo esperado"}
            </p>
          </div>
        </div>

        {/* Input de efectivo contado */}
        <div className="flex flex-col gap-y-2 font-heading">
          <div className="flex items-center justify-between">
            <label
              htmlFor="counted-cash"
              className="text-sm font-medium text-foreground"
            >
              Efectivo contado en cajón
            </label>
            <button
              type="button"
              onClick={() => setCounted(expected.toFixed(2))}
              className="text-sm text-primary hover:underline font-medium cursor-pointer"
            >
              Usar esperado ({money.format(expected)})
            </button>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm font-medium text-muted-foreground pointer-events-none">
              S/.
            </span>
            <Input
              id="counted-cash"
              type="number"
              min="0"
              step="0.10"
              value={counted}
              onChange={(event) => setCounted(event.target.value)}
              className="pl-9 font-medium h-fit py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none "
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Alerta si se requiere justificación */}
        {notesRequired && (
          <div className="font-heading flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">
                Justificación requerida por política de caja
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Se detectó una diferencia de{" "}
                {money.format(Math.abs(difference))}. Detalla la causa en las
                observaciones antes de confirmar.
              </p>
            </div>
          </div>
        )}

        {/* Campo de observaciones */}
        <div className="flex flex-col gap-y-2 font-heading">
          <label
            htmlFor="closing-notes"
            className="text-sm font-medium text-foreground"
          >
            Observaciones{" "}
            {notesRequired ? (
              <span className="text-destructive">*</span>
            ) : (
              <span className="text-sm font-normal text-muted-foreground">
                (opcional)
              </span>
            )}
          </label>
          <Textarea
            id="closing-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder={
              notesRequired
                ? "Explica el motivo del descuadre o la incidencia registrada..."
                : "Detalles adicionales del turno, incidencias o retiro de efectivo..."
            }
            className={cn(
              notesRequired &&
                !notes.trim() &&
                "border-destructive/60 focus-visible:ring-destructive/30",
            )}
          />
        </div>

        {/* Footer con acciones */}
        <DialogFooter className="gap-2 sm:gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            className="rounded-full cursor-pointer font-sans"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="rounded-full cursor-pointer font-sans gap-1.5"
            disabled={
              !Number.isFinite(Number(counted)) ||
              Number(counted) < 0 ||
              (notesRequired && !notes.trim())
            }
            onClick={submit}
          >
            Confirmar cierre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
