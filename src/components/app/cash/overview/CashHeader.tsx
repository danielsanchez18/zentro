import { ArrowLeftRight, MoreHorizontal, Settings } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function CashHeader({
  onOpen,
  onMovement,
  onSettings,
}: {
  onOpen: () => void;
  onMovement: () => void;
  onSettings: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-medium">Caja</h1>
        <p className="text-sm text-muted-foreground">
          Controla turnos, efectivo y cobros de la ubicación activa.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="hidden md:inline-flex rounded-full cursor-pointer"
          onClick={onSettings}
        >
          Configuración
        </Button>

        <Button
          type="button"
          variant="outline"
          className="hidden md:inline-flex rounded-full cursor-pointer"
          onClick={onMovement}
        >
          Registrar movimiento
        </Button>

        <Button
          type="button"
          onClick={onOpen}
          className="rounded-full cursor-pointer"
        >
          Abrir caja
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "md:hidden rounded-full cursor-pointer",
            )}
            aria-label="Más opciones de caja"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 font-heading p-1">
            <DropdownMenuItem
              onClick={onMovement}
              className="cursor-pointer gap-2"
            >
              <ArrowLeftRight className="size-4 text-muted-foreground" />
              <span>Registrar movimiento</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onSettings}
              className="cursor-pointer gap-2"
            >
              <Settings className="size-4 text-muted-foreground" />
              <span>Configuración</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
