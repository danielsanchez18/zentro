import { Button } from "@/components/ui/button";

export function AgendaHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="flex items-center justify-between gap-5">
      <div>
        <h1 className="text-lg font-medium">Agenda</h1>
        <p className="text-sm text-muted-foreground">
          Organiza citas, responsables, recursos y disponibilidad.
        </p>
      </div>
      <Button onClick={onAdd} className="shrink-0 rounded-full px-3">
        Nueva cita
      </Button>
    </header>
  );
}
