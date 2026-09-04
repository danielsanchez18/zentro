import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PurchasesHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="flex items-center justify-between gap-x-5">
      <div>
        <h1 className="text-lg font-medium">Compras</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona órdenes a proveedores y su recepción en inventario.
        </p>
      </div>
      <Button type="button" onClick={onCreate} className="rounded-full px-3">
        Nueva orden
      </Button>
    </header>
  );
}
