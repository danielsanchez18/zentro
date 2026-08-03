import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MODULE_MAP, type ModuleKey } from "./constants";

interface IndispensableDialogProps {
  moduleKey: ModuleKey | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmación al intentar desmarcar un módulo indispensable del rubro.
 */
export const IndispensableDialog = ({
  moduleKey,
  onCancel,
  onConfirm,
}: IndispensableDialogProps) => {
  return (
    <Dialog
      open={!!moduleKey}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans text-base">
            <AlertTriangle className="size-4 text-amber-600" />
            Módulo indispensable
          </DialogTitle>
          <DialogDescription className="text-sm">
            El módulo{" "}
            <strong className="font-medium text-foreground">
              {moduleKey ? MODULE_MAP[moduleKey].label : ""}
            </strong>{" "}
            es indispensable para tu rubro. ¿Seguro que quieres continuar sin él?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            className="text-sm px-4 py-2 h-fit rounded-full"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            className="text-sm px-4 py-2 h-fit rounded-full"
            onClick={onConfirm}
          >
            Seguir sin él
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};