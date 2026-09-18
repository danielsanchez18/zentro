"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AgendaSettingsHeader({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <header>
      <Button
        type="button"
        variant="link"
        onClick={() => router.push(`/app/${slug}/agenda`)}
        className="h-fit cursor-pointer px-0"
      >
        Regresar
      </Button>
      <h1 className="text-lg font-medium">Configuración de agenda</h1>
      <p className="text-sm text-muted-foreground">
        Gestiona la disponibilidad semanal, recursos físicos compartidos, bloqueos y parámetros generales.
      </p>
    </header>
  );
}
