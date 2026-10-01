"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { SalesChannel } from "@/lib/mock/channels";
import type { UpsertChannelInput } from "@/stores/channels-store";

interface ChannelFormDialogProps {
  channel: SalesChannel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (input: UpsertChannelInput) => void;
}

/** Edición de un canal propio: nombre, descripción, estado y pedidos entrantes. */
export const ChannelFormDialog = ({
  channel,
  open,
  onOpenChange,
  onConfirm,
}: ChannelFormDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"activo" | "inactivo">("activo");
  const [acceptsOrders, setAcceptsOrders] = useState(false);

  useEffect(() => {
    if (!channel) return;
    setName(channel.name);
    setDescription(channel.description ?? "");
    setStatus(channel.status);
    setAcceptsOrders(channel.acceptsOrders ?? false);
  }, [channel]);

  if (!channel) return null;

  const canSubmit = name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar canal</DialogTitle>
          <DialogDescription>
            Ajusta cómo se presenta y opera este canal de venta.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-5 font-heading">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="channel-name">Nombre</Label>
            <Input
              id="channel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Punto de venta"
              className="px-3 py-2 h-fit"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="channel-description">Descripción</Label>
            <Textarea
              id="channel-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ventas en el mostrador de cada ubicación."
              className="px-3 py-2 h-fit resize-none"
            />
          </div>

          <div className="divide-y divide-border">
            <div className="flex items-center justify-between pb-4">
              <div>
                <Label htmlFor="channel-status">Canal activo</Label>
                <p className="text-sm font-sans text-muted-foreground">
                  Un canal inactivo deja de admitir pedidos.
                </p>
              </div>
              <Switch
                id="channel-status"
                checked={status === "activo"}
                onCheckedChange={(checked) => {
                  const next = checked ? "activo" : "inactivo";
                  setStatus(next);
                  if (!checked) setAcceptsOrders(false);
                }}
              />
            </div>

            {status === "activo" && (
              <div className="flex items-center justify-between pt-4 pb-2">
                <div>
                  <Label htmlFor="channel-orders">Recibe pedidos</Label>
                  <p className="text-sm font-sans text-muted-foreground">
                    Permite registrar pedidos entrantes por este canal.
                  </p>
                </div>
                <Switch
                  id="channel-orders"
                  checked={acceptsOrders}
                  onCheckedChange={setAcceptsOrders}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full cursor-pointer"
          >
            <span>Cancelar</span>
          </Button>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              onConfirm({
                id: channel.id,
                name: name.trim(),
                description: description.trim() || undefined,
                status,
                acceptsOrders,
              });
              onOpenChange(false);
            }}
            className="rounded-full cursor-pointer"
          >
            <span>Guardar cambios</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
