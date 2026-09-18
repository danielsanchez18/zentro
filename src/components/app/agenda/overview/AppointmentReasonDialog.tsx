"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toastMsg } from "@/components/ui/toast-message";

export function AppointmentReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  const confirm = () => {
    if (!reason.trim()) {
      toastMsg.error("Falta el motivo", "Escribe un motivo para conservar la trazabilidad.");
      return;
    }
    onConfirm(reason.trim());
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="appointment-action-reason">Motivo</Label>
          <Textarea
            id="appointment-action-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Describe brevemente lo ocurrido..."
            rows={4}
            className="rounded-xl resize-none"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full cursor-pointer"
          >
            Volver
          </Button>
          <Button
            variant="destructive"
            onClick={confirm}
            className="rounded-full cursor-pointer"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
