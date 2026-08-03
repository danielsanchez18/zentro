"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog de confirmación de cierre de sesión.
 * Reutilizable (Header, Mi cuenta, etc.): al confirmar limpia el store
 * de auth y redirige a /ingresar.
 */
export const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleConfirm = () => {
    logout();
    onOpenChange(false);
    router.push("/ingresar");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cerrar sesión</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres cerrar tu sesión? Deberás iniciar sesión de nuevo
            para acceder.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}
            className="px-3 rounded-full">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}
            className="px-3 rounded-full">
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};