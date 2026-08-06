import { Button } from "@/components/ui/button";
import { Title } from "./Title";

interface UsersHeaderProps {
  membersCount: number;
  memberLimit: number;
  canManage: boolean;
  onInvite: () => void;
}

/** Cabecera de la página: título + contador de miembros + botón Invitar. */
export function UsersHeader({
  membersCount,
  memberLimit,
  canManage,
  onInvite,
}: UsersHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Title
        title="Usuarios"
        description="Administra quién puede acceder a este negocio y qué rol tiene cada uno."
      />
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{membersCount}</span> de{" "}
          {memberLimit} miembros usados
        </p>
        <Button
          onClick={onInvite}
          disabled={!canManage}
          title={
            canManage
              ? undefined
              : "Solo el Owner, Admin o roles con permiso de gestión pueden invitar"
          }
          className="text-sm px-3 rounded-full"
        >
          Invitar
        </Button>
      </div>
    </header>
  );
}