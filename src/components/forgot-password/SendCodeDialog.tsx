"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SendCodeDialogProps {
  email: string;
}

export function SendCodeDialog({ email }: SendCodeDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    setOpen(false);
    router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-primary font-semibold hover:underline cursor-pointer"
      >
        Restablecer
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="px-1 py-1">
            <DialogTitle>Restablecer contraseña</DialogTitle>
            <DialogDescription className="mt-2 text-muted-foreground">
              Te enviaremos un código a tu correo{" "}
              <span className="font-medium text-foreground">{email}</span>{" "}
              para que puedas restablecer tu contraseña de forma segura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-1">
            <Button 
              variant="outline" 
              className="rounded-full h-fit px-3 text-sm py-2 leading-none" 
              onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="rounded-full h-fit px-3 text-sm py-2 leading-none"
              onClick={handleSend}>
              Enviar código
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
