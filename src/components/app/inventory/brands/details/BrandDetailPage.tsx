"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useInventoryStore } from "@/stores/inventory-store";
import { EditBrandDialog } from "../edit/EditBrandDialog";
import { BrandInfo } from "./BrandInfo";
import { BrandProducts } from "./BrandProducts";

export function BrandDetailPage({
  slug,
  brandId,
}: {
  slug: string;
  brandId: string;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const brands = useInventoryStore((state) => state.brands);
  const items = useInventoryStore((state) => state.items);
  const updateBrand = useInventoryStore((state) => state.updateBrand);
  const removeBrand = useInventoryStore((state) => state.removeBrand);
  const storedBrand = brands.find((candidate) => candidate.id === brandId);
  const brandsHref = `/app/${slug}/inventario/marcas`;

  if (!storedBrand)
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Button
          variant="link"
          onClick={() => router.push(brandsHref)}
          className="h-fit px-0"
        >
          Regresar
        </Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos esta marca.
        </div>
      </div>
    );

  const relatedItems = items.filter((item) => item.brand === storedBrand.name);
  const brand = {
    ...storedBrand,
    productCount: relatedItems.length,
    unitsInStock: relatedItems.reduce(
      (sum, item) => sum + item.currentStock,
      0,
    ),
    inventoryValue: relatedItems.reduce(
      (sum, item) => sum + item.currentStock * item.unitCost,
      0,
    ),
  };
  const isActive = brand.status === "activo";
  const toggleStatus = () => {
    const status = isActive ? "inactivo" : "activo";
    updateBrand(brand.id, { status });
    toastMsg.success(
      status === "activo" ? "Marca habilitada" : "Marca deshabilitada",
      `${brand.name} ahora está ${status}.`,
    );
  };
  const deleteBrand = () => {
    removeBrand(brand.id);
    toastMsg.info(
      "Marca eliminada",
      relatedItems.length > 0
        ? `${brand.name} se eliminó; sus productos quedan sin relación en el prototipo.`
        : `${brand.name} se eliminó del prototipo.`,
    );
    router.push(brandsHref);
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <header>
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(brandsHref)}
          className="h-fit cursor-pointer px-0"
        >
          Regresar
        </Button>
        <h1 className="text-lg font-medium">{brand.name}</h1>
      </header>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,2fr)]">
        <aside className="h-fit lg:sticky lg:top-5">
          <BrandInfo brand={brand} />
        </aside>
        <main className="min-w-0">
          <BrandProducts items={relatedItems} />
        </main>
      </div>
      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <Toast ariaLabel="Acciones de la marca">
          <Button
            type="button"
            variant="link"
            onClick={() => setEditOpen(true)}
            className="cursor-pointer px-3 text-green-500"
          >
            Editar
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={toggleStatus}
            className="cursor-pointer px-3 text-white"
          >
            {isActive ? "Deshabilitar" : "Habilitar"}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer px-3 text-rose-400"
          >
            Eliminar
          </Button>
        </Toast>
      </div>
      <EditBrandDialog
        brand={brand}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar marca"
        description={
          relatedItems.length > 0
            ? `${brand.name} tiene ${relatedItems.length} productos asociados. ¿Deseas eliminarla y dejar esos productos sin esta relación?`
            : `¿Deseas eliminar ${brand.name}?`
        }
        confirmLabel="Eliminar"
        onConfirm={deleteBrand}
      />
    </div>
  );
}
