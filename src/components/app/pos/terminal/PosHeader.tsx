import { Button } from "@/components/ui/button";

export function PosHeader({
  suspendedCount,
  onSuspended,
  onScanner,
}: {
  location: string;
  suspendedCount: number;
  onSuspended: () => void;
  onScanner: () => void;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-medium">Punto de venta</h1>
        <p className="text-sm text-muted-foreground">
          Construye y cobra una venta desde el catálogo disponible.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="px-3 rounded-full" onClick={onScanner}>
          Escanear código
        </Button>
        <Button
          variant="outline"
          onClick={onSuspended}
          className="px-3 rounded-full"
        >
          Carritos en pausa {suspendedCount > 0 && `(${suspendedCount})`}
        </Button>
      </div>
    </header>
  );
}
