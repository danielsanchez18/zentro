import { Button } from "@/components/ui/button";

export function OrdersHeader({
  onOpenPos,
  onExport,
}: {
  onOpenPos: () => void;
  onExport: () => void;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-5">
      <div>
        <h1 className="text-lg font-medium">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Supervisa los pedidos desde su ingreso hasta la entrega.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onExport}
          className="rounded-full px-3"
        >
          Exportar
        </Button>
        <Button type="button" onClick={onOpenPos} className="rounded-full px-3">
          Abrir punto de venta
        </Button>
      </div>
    </header>
  );
}
