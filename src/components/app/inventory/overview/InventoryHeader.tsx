import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  onRegisterEntry: () => void;
}

export function InventoryHeader({ onRegisterEntry }: InventoryHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-x-5">
      <div>
        <h1 className="text-lg font-medium">Inventario</h1>
        <p className="text-sm text-muted-foreground">
          Controla las existencias, mínimos y movimientos de la sucursal activa.
        </p>
      </div>

      <Button
        type="button"
        onClick={onRegisterEntry}
        className="gap-x-1 rounded-full px-3 text-sm"
      >
        <span>Registrar <span className="max-sm:hidden">entrada</span></span>
      </Button>
    </header>
  );
}
