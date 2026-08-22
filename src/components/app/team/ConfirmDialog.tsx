"use client";

import { AlertTriangle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Título del dialog. */
  title: string;
  /** Descripción / contexto de la acción (texto plano). */
  description: string;
  /** Texto del botón de confirmación. */
  confirmLabel: string;
  /** Icono junto al título. */
  icon?: LucideIcon;
  /** Callback al confirmar. */
  onConfirm: () => void;
}

/**
 * Dialog de confirmación reutilizable para acciones destructivas
 * (deshabilitar acceso, eliminar miembro, revocar invitación, etc.).
 */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  icon: Icon = AlertTriangle,
  onConfirm,
}: ConfirmDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {/* <Icon className="size-5 text-destructive" /> */}
          {title}
        </DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-x-1">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="px-3 rounded-full"
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
          className="px-3 rounded-full"
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);