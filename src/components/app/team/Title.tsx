"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TitleProps {
  /** Abre el dialog de invitación (lo controla TeamModule). */
  onInvite?: () => void;
}

export const Title = ({ onInvite }: TitleProps) => {
  return (
    <div className="flex justify-between items-center gap-x-5">
      <div>
        <h1 className="text-lg font-medium">Equipo y permisos</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona quién accede a la organización y con qué rol.
        </p>
      </div>

      <Button
        type="button"
        onClick={onInvite}
        className="text-sm rounded-full px-3 gap-x-1"
      >
        <p>Invitar <span className="max-sm:hidden">miembro</span></p>
      </Button>
    </div>
  );
};