"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toastMsg } from "@/components/ui/toast-message";
import type { InventoryBrand } from "@/lib/mock/inventory-brands";
import { useInventoryStore } from "@/stores/inventory-store";
import { BrandForm } from "../shared/BrandForm";

export function EditBrandDialog({ brand, open, onOpenChange }: { brand: InventoryBrand; open: boolean; onOpenChange: (open: boolean) => void }) {
  const brands = useInventoryStore((state) => state.brands);
  const updateBrand = useInventoryStore((state) => state.updateBrand);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-lg"><DialogHeader className="m-1 font-heading"><DialogTitle>Editar marca</DialogTitle><p className="text-sm text-muted-foreground">Actualiza la identidad y configuración de {brand.name}.</p></DialogHeader>{open && <BrandForm id="edit-brand-form" initial={brand} existingNames={brands.filter((candidate) => candidate.id !== brand.id).map((candidate) => candidate.name)} onSubmit={(values) => { updateBrand(brand.id, { ...values, updatedAt: new Date().toISOString() }); toastMsg.success("Marca actualizada", `Los cambios de ${values.name} se guardaron.`); onOpenChange(false); }} actions={<DialogFooter className="gap-x-1"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-3">Cancelar</Button><Button type="submit" className="rounded-full px-3">Guardar cambios</Button></DialogFooter>} />}</DialogContent></Dialog>;
}
