import { Users as UsersIcon } from "lucide-react";

/** Aviso mostrado cuando el rol actual no puede gestionar miembros. */
export function PermissionAlert() {
  return (
    <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
      <UsersIcon className="mr-1.5 inline size-3.5" />
      Tu rol actual no tiene permiso para gestionar miembros. Contacta al Owner
      o Admin del negocio.
    </p>
  );
}