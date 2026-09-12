"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import type { PosCustomer } from "@/lib/mock/pos";
import { useCrmStore } from "@/stores/crm-store";

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function CustomerSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (customer: PosCustomer) => void;
}) {
  const [query, setQuery] = useState("");
  const customers = useCrmStore((state) => state.customers);
  const results = useMemo(() => {
    const value = query.trim().toLocaleLowerCase("es");
    const available = customers.filter((customer) => customer.status === "activo");
    if (!value) return available;
    return available.filter(
      (customer) =>
        customer.name.toLocaleLowerCase("es").includes(value) ||
        customer.email.toLocaleLowerCase("es").includes(value),
    );
  }, [customers, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Buscar cliente</DialogTitle>
          <DialogDescription>
            Busca por nombre o correo y asocia el cliente a esta atención.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre o correo electrónico"
            className="pl-9 h-fit py-2"
          />
        </div>
        {results.length ? (
          <div className="max-h-80 overflow-y-auto rounded-xl border">
            <div className="divide-y">
              {results.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => {
                    onSelect(customer);
                    onOpenChange(false);
                  }}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50"
                >
                  <span
                    role="img"
                    aria-label={`Foto de ${customer.name}`}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted bg-cover bg-center text-xs font-medium"
                    style={
                      customer.avatar
                        ? { backgroundImage: `url(${customer.avatar})` }
                        : undefined
                    }
                  >
                    {customer.avatar ? (
                      <span className="sr-only">{initials(customer.name)}</span>
                    ) : (
                      initials(customer.name)
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {customer.name}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {customer.email}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed">
            <EmptyState
              icon={SearchX}
              title="No encontramos clientes"
              description="Prueba con otro nombre o correo. También puedes escribir un nombre libre en el carrito."
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
