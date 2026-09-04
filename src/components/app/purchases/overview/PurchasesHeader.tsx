import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PurchasesHeader({
  onCreate,
  onExport,
}: {
  onCreate: () => void;
  onExport: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-x-5">
      <div>
        <h1 className="text-lg font-medium">Compras</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona órdenes a proveedores y su recepción en inventario.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onExport}
          className="rounded-full px-3"
        >
          <Download className="size-4" />
          Exportar
        </Button>
        <Button type="button" onClick={onCreate} className="rounded-full px-3">
          Nueva orden
        </Button>
      </div>
    </header>
  );
}
