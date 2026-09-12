"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { CustomerAddress } from "@/lib/mock/crm";
import { useCrmStore } from "@/stores/crm-store";
import { toastMsg } from "@/components/ui/toast-message";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomerAddressesProps {
  addresses: CustomerAddress[];
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
}

export function CustomerAddresses({
  addresses: propAddresses,
  customerId,
}: CustomerAddressesProps) {
  const storeCustomer = useCrmStore((state) =>
    customerId ? state.customers.find((c) => c.id === customerId) : null,
  );
  const updateCustomer = useCrmStore((state) => state.updateCustomer);
  const [localAddresses, setLocalAddresses] =
    useState<CustomerAddress[]>(propAddresses);

  const items =
    storeCustomer?.addresses ?? (customerId ? propAddresses : localAddresses);

  // Estado para el diálogo de agregar / editar
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );
  const [formCity, setFormCity] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formDistrict, setFormDistrict] = useState("");
  const [formReference, setFormReference] = useState("");
  const [formIsDefault, setFormIsDefault] = useState(false);

  const syncStore = (newAddresses: CustomerAddress[]) => {
    if (customerId) {
      updateCustomer(customerId, { addresses: newAddresses });
    } else {
      setLocalAddresses(newAddresses);
    }
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormCity("");
    setFormAddress("");
    setFormDistrict("");
    setFormReference("");
    setFormIsDefault(items.length === 0);
    setDialogOpen(true);
  };

  const handleOpenEdit = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setFormCity(addr.city || addr.label);
    setFormAddress(addr.address);
    setFormDistrict(addr.district);
    setFormReference(addr.reference || "");
    setFormIsDefault(addr.isDefault);
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAddress.trim() || !formCity.trim()) {
      toastMsg.error(
        "Campos requeridos",
        "Por favor ingresa la ciudad y la dirección.",
      );
      return;
    }

    let updated: CustomerAddress[];
    if (editingAddress) {
      updated = items.map((a) => {
        if (a.id === editingAddress.id) {
          return {
            ...a,
            city: formCity.trim(),
            label: formCity.trim(),
            address: formAddress.trim(),
            district: formDistrict.trim(),
            reference: formReference.trim() || undefined,
            isDefault: formIsDefault,
          };
        }
        return formIsDefault ? { ...a, isDefault: false } : a;
      });
      toastMsg.success(
        "Dirección actualizada",
        "Los cambios han sido guardados.",
      );
    } else {
      const newAddress: CustomerAddress = {
        id: `addr_${Date.now()}`,
        label: formCity.trim(),
        city: formCity.trim(),
        address: formAddress.trim(),
        district: formDistrict.trim(),
        reference: formReference.trim() || undefined,
        isDefault: formIsDefault || items.length === 0,
      };
      updated = formIsDefault
        ? [...items.map((a) => ({ ...a, isDefault: false })), newAddress]
        : [...items, newAddress];
      toastMsg.success(
        "Dirección agregada",
        "Se ha registrado la nueva dirección.",
      );
    }

    syncStore(updated);
    setDialogOpen(false);
  };

  const handleSetDefault = (addressId: string) => {
    const updated = items.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    syncStore(updated);
    toastMsg.success(
      "Dirección predeterminada",
      "Se ha establecido como la dirección principal.",
    );
  };

  const handleRemove = (addressId: string) => {
    const remaining = items.filter((a) => a.id !== addressId);
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true;
    }
    syncStore(remaining);
    toastMsg.success("Dirección eliminada", "La dirección ha sido removida.");
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      {/* Cabecera de la sección */}
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">
          Direcciones de entrega
        </h2>
      </div>

      {/* Grid de tarjetas con estilo idéntico al diseño */}
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {items.map((address) => (
            <article
              key={address.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-black/3 dark:bg-background transition-all p-1.5"
            >
              {/* Contenido principal */}
              <div className="p-4 bg-card rounded-xl h-full">
                {/* Título y Badge Default */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium tracking-tight text-foreground">
                    {address.city || address.label}
                  </h3>
                  {address.isDefault && (
                    <span className="inline-flex items-center rounded-md leading-none bg-muted px-2.5 py-2 text-xs font-medium">
                      Default
                    </span>
                  )}
                </div>

                {/* Datos de contacto y dirección */}
                <div className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                  <p>{address.address}</p>
                  <p>
                    {address.district ? `${address.district}, ` : ""}
                    {address.city}
                    {address.reference ? ` · Ref: ${address.reference}` : ""}
                  </p>
                </div>
              </div>

              {/* Barra inferior de acciones */}
              <div className="grid grid-cols-3 justify-center divide-x divide-border text-sm font-medium py-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(address)}
                  className="w-full text-center cursor-pointer font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(address.id)}
                  className="w-full text-center cursor-pointer font-normal text-muted-foreground underline underline-offset-4 transition-colors hover:text-destructive"
                >
                  Quitar
                </button>
                {address.isDefault ? (
                  <span className="mx-auto w-full text-center cursor-default select-none text-muted-foreground/45">
                    Principal
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    className="mx-auto w-full text-center cursor-pointer font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    Principal
                  </button>
                )}
              </div>
            </article>
          ))}

          {/* Tarjeta "+ Add address" con borde punteado */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border/90 bg-card p-6 text-center transition-all hover:border-primary/60 hover:bg-muted/30"
          >
            <span className="p-2 rounded-lg bg-accent">
              <Plus className="size-5 text-muted-foreground transition-transform group-hover:scale-110 group-hover:text-foreground" />
            </span>
            <span className="mt-3 mb-1 text-sm font-medium transition-colors group-hover:text-foreground">
              Agregar dirección
            </span>
            <span className="text-sm font-normal font-sans text-muted-foreground transition-colors group-hover:text-foreground">
              Puedes agregar múltiples direcciones de entrega para tus clientes.
            </span>
          </button>
        </div>
      </div>

      {/* Diálogo interactivo para Agregar / Editar dirección */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="font-heading sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Editar dirección" : "Nueva dirección"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="mt-2 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground">
                Ciudad / Título
              </label>
              <input
                type="text"
                placeholder="Ej. Chiclayo, Breannabury, Portland..."
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">
                Dirección exacta
              </label>
              <input
                type="text"
                placeholder="Ej. Av. Balta 825, Calle Los Pinos 142..."
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">
                  Distrito / Estado
                </label>
                <input
                  type="text"
                  placeholder="Ej. San Isidro, Pimentel..."
                  value={formDistrict}
                  onChange={(e) => setFormDistrict(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">
                  Referencia (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Frente al parque..."
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="default-check"
                type="checkbox"
                checked={formIsDefault}
                onChange={(e) => setFormIsDefault(e.target.checked)}
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
              <label
                htmlFor="default-check"
                className="cursor-pointer text-xs font-medium text-foreground"
              >
                Establecer como dirección principal (Default)
              </label>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar dirección</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
