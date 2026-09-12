import { Button } from "@/components/ui/button";

export function CustomersHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="flex items-center justify-between gap-5">
      <div>
        <h1 className="text-lg font-medium">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Centraliza contactos, historial comercial y preferencias de atención.
        </p>
      </div>
      <Button onClick={onAdd} className="shrink-0 rounded-full px-3">
        Agregar <span className="max-sm:hidden">cliente</span>
      </Button>
    </header>
  );
}
