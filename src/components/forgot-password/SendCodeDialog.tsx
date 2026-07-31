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
import { Loader2, Lock } from "lucide-react";
import { forgotPasswordService } from "@/lib/services/auth.service";
import { showError, showInfo, showSuccess } from "@/components/ui/toast-message";

interface SendCodeDialogProps {
  email: string;
}

export function SendCodeDialog({ email }: SendCodeDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!email) return;

    setSending(true);
    try {
      const { devCode } = await forgotPasswordService(email);

      setOpen(false);
      showSuccess("Código enviado", `Te enviamos un código a ${email}.`);
      if (devCode) {
        showInfo(
          "Código de prueba",
          `En desarrollo el código es ${devCode}. Míralo también en la consola del backend.`,
          6000,
        );
      }
      router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "No pudimos enviar el código. Inténtalo de nuevo.";
      showError(message);
    } finally {
      setSending(false);
    }
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
            <DialogTitle className="text-base flex items-center gap-2">
              <Lock size={16} className="text-primary" />
              Restablecer contraseña
            </DialogTitle>
            <DialogDescription className="mt-2 text-base text-muted-foreground">
              Te enviaremos un código a tu correo{" "}
              <span className="font-medium text-foreground">{email}</span>{" "}
              para que puedas restablecer tu contraseña de forma segura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-1">
            <Button
              variant="outline"
              className="rounded-full h-fit px-4 text-base py-2.5 leading-none"
              onClick={() => setOpen(false)}
              disabled={sending}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-full h-fit px-4 text-base py-2.5 leading-none"
              onClick={handleSend}
              disabled={sending}
            >
              {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sending ? "Enviando…" : "Enviar código"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
