import { Button } from "@/components/ui/button";

export function MovementsHeader({ onExport }: { onExport: () => void }) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-lg font-medium font-heading">
          Movimientos de inventario
        </h1>
        <p className="text-sm text-muted-foreground">
          Consulta entradas, salidas, mermas y ajustes de la sucursal activa.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onExport}
        className="w-full rounded-full px-3 sm:w-auto"
      >
        Exportar CSV
      </Button>
    </header>
  );
}
