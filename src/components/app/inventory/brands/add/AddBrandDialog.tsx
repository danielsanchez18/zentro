"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toastMsg } from "@/components/ui/toast-message";
import { useInventoryStore } from "@/stores/inventory-store";
import { BrandForm } from "../shared/BrandForm";

export function AddBrandDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const brands = useInventoryStore((state) => state.brands);
  const addBrand = useInventoryStore((state) => state.addBrand);
  const formId = "add-brand-form";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="my-1 font-heading">
          <DialogTitle>Nueva marca</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Registra la identidad y configuración inicial de la marca.
          </p>
        </DialogHeader>
        {open && (
          <BrandForm
            id={formId}
            existingNames={brands.map((brand) => brand.name)}
            onSubmit={(values) => {
              addBrand({
                id: `brand_${Date.now()}`,
                ...values,
                productCount: 0,
                unitsInStock: 0,
                inventoryValue: 0,
                updatedAt: new Date().toISOString(),
              });
              toastMsg.success(
                "Marca creada",
                `${values.name} se agregó al prototipo.`,
              );
              onOpenChange(false);
            }}
            actions={
              <DialogFooter className="gap-x-1 font-sans!">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full px-3"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="rounded-full px-3">
                  Guardar marca
                </Button>
              </DialogFooter>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
