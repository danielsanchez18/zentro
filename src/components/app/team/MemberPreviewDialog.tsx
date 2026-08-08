"use client";

import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/lib/mock/team";
import { LastSeenChip, StatusChip } from "./Table";

interface MemberPreviewDialogProps {
  /** Integrante cuyo preview se muestra (null = cerrado). */
  member: TeamMember | null;
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Fila clave/valor compacta del preview. */
const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="text-sm  tracking-wide text-muted-foreground pt-0.5">
      {label}
    </dt>
    <dd className="text-sm font-medium text-end">{children}</dd>
  </div>
);

/**
 * Preview de un integrante del Equipo.
 *
 * Se abre al hacer clic en una fila de la tabla. Muestra un resumen breve
 * (datos de contacto y de incorporación). El detalle completo vive en la página
 * `/equipo/:memberId`, a la que se llega desde «Ver detalle completo».
 */
export const MemberPreviewDialog = ({
  member,
  slug,
  open,
  onOpenChange,
}: MemberPreviewDialogProps) => {
  const router = useRouter();

  const goToDetail = () => {
    if (!member) return;
    onOpenChange(false);
    router.push(`/app/${slug}/equipo/${member.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="bg-accent flex justify-center items-center size-12 overflow-hidden rounded-full">
              <User className="size-6 text-muted-foreground" />
            </div>
            <div>
              <DialogTitle className="text-base">{member?.name}</DialogTitle>
              <DialogDescription className="break-all">
                {member?.email}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <dl className="grid gap-2.5 border-t border-border pt-4">
          <Row label="Rol">{member?.role}</Row>
          <Row label="Estado">
            <StatusChip status={member?.status ?? "invitado"} />
          </Row>
          <Row label="Última conexión">
            <LastSeenChip lastSeen={member?.lastSeen ?? "nunca"} />
          </Row>
          <Row label="Agregado por">{member?.addedBy}</Row>
          <Row label="Se unió">
            {member
              ? new Date(member.addedAt).toLocaleDateString("es-CL", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </Row>
        </dl>

        <DialogFooter className="gap-x-1 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-3 rounded-full"
          >
            Cerrar
          </Button>
          <Button onClick={goToDetail} className="px-3 rounded-full">
            Ver detalle completo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};