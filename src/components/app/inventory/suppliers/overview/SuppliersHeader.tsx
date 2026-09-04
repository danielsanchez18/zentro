import { Button } from "@/components/ui/button";

export function SuppliersHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="flex items-center justify-between gap-x-5">
      <div>
        <h1 className="text-lg font-medium">Proveedores</h1>
        <p className="text-sm text-muted-foreground">
          Consulta los proveedores que abastecen a la sucursal activa y sus condiciones comerciales.
        </p>
      </div>
      <Button type="button" onClick={onAdd} className="shrink-0 rounded-full px-3 text-sm">
        Agregar <span className="max-sm:hidden">proveedor</span>
      </Button>
    </header>
  );
}
