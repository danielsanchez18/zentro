import { Button } from "@/components/ui/button";

export function FormsHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-5">
      <div>
        <h1 className="text-lg font-medium">Formularios</h1>
        <p className="text-sm text-muted-foreground">
          Captura solicitudes y conviértelas en clientes, citas o pedidos.
        </p>
      </div>
      <Button type="button" onClick={onCreate} className="px-3 rounded-full">
        Nuevo formulario
      </Button>
    </header>
  );
}
