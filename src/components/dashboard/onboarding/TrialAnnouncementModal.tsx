"use client";

import { useState, useEffect } from "react";
import { Gift, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Modal de bienvenida al plan Trial.
 * Se muestra automáticamente al cargar la página de onboarding.
 * Props:
 *   - open: controlado externamente (el padre decide cuándo mostrarlo).
 *   - onClose: callback al cerrar.
 */
interface TrialAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
}

export const TrialAnnouncementModal = ({
  open,
  onClose,
}: TrialAnnouncementModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md gap-0 p-0 overflow-hidden"
        /* Evita que el usuario cierre con clic fuera — debe leerlo */
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header decorativo */}
        <div className="relative flex flex-col items-center gap-3 bg-primary/5 px-8 pt-10 pb-6 text-center border-b border-border">
          {/* Ícono central */}
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/10">
            <Gift className="size-7 text-primary" />
          </div>

          <DialogHeader className="mt-1 space-y-1">
            <DialogTitle className="text-xl font-semibold leading-snug">
              30 días gratis para explorar
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Tu organización empieza en <span className="font-medium text-foreground">plan Trial</span>
            </p>
          </DialogHeader>
        </div>

        {/* Cuerpo */}
        <div className="px-8 py-6 space-y-4 text-sm text-muted-foreground">
          <p>
            Durante tu período de prueba tienes acceso completo a los módulos que elijas.
            Úsalos sin restricciones y descubre cuál es el plan ideal para tu negocio.
          </p>

          <ul className="space-y-2">
            {[
              "Sin tarjeta de crédito requerida",
              "Cambia de plan cuando quieras desde Suscripciones",
              "Tu progreso se guarda aunque cambies de plan",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <Button
            className="w-full rounded-full"
            onClick={onClose}
          >
            Entendido, configurar mi negocio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
