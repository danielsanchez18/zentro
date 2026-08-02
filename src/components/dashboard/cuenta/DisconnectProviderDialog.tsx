"use client";

import { TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DisconnectProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerName: string;
  onConfirm: () => void;
}

export const DisconnectProviderDialog = ({
  open,
  onOpenChange,
  providerName,
  onConfirm,
}: DisconnectProviderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="sm:px-1">
          <DialogTitle className="font-sans">¿Desconectar {providerName}?</DialogTitle>
          <DialogDescription>
            Dejarás de poder iniciar sesión con {providerName}. Seguirás
            teniendo acceso con tu correo y contraseña.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 my-1 text-sm text-amber-700 dark:text-amber-400">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>Esta acción no elimina tu cuenta, solo quita el acceso con {providerName}.</span>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-sm px-3 py-1.5 h-fit rounded-full">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="text-sm px-3 rounded-full py-1.5 h-fit"
          >
            Desconectar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
