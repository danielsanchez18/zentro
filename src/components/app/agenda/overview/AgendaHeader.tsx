"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

export function AgendaHeader({
  onAdd,
  onConfigure,
}: {
  onAdd: () => void;
  onConfigure?: () => void;
}) {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "las-rocas";

  return (
    <header className="flex flex-wrap items-center justify-between gap-5">
      <div>
        <h1 className="text-lg font-medium">Agenda</h1>
        <p className="text-sm text-muted-foreground">
          Organiza citas, responsables, recursos y disponibilidad.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/app/${slug}/agenda/configuracion`}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium border border-border bg-background hover:bg-muted hover:text-foreground rounded-full transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          {/* <Settings2 className="size-4" /> */}
          <span>Configurar</span>
        </Link>
        <Button
          onClick={onAdd}
          className="shrink-0 px-3 rounded-full cursor-pointer"
        >
          Nueva cita
        </Button>
      </div>
    </header>
  );
}
