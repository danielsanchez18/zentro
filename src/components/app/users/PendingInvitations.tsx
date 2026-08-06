import { MailPlus, MailX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import type { MockInvitation, MockRole } from "@/lib/mock/users";
import { Empty } from "./Empty";

interface PendingInvitationsProps {
  invitations: MockInvitation[];
  roles: MockRole[];
  canManage: boolean;
  onResend: (inv: MockInvitation) => void;
  onRevoke: (inv: MockInvitation) => void;
  /* Paginación */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

/** Sección de invitaciones pendientes del negocio (con paginación propia). */
export function PendingInvitations({
  invitations,
  roles,
  canManage,
  onResend,
  onRevoke,
  page,
  pageCount,
  onPageChange,
  totalItems,
  pageSize,
}: PendingInvitationsProps) {
  const roleById = (id: string) => roles.find((r) => r.id === id);

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <MailPlus className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-medium">Invitaciones pendientes</h2>
        {totalItems > 0 && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            {totalItems}
          </span>
        )}
      </div>

      {totalItems === 0 ? (
        <Empty
          icon={MailPlus}
          title="No hay invitaciones pendientes."
          description="Cuando invites a alguien aparecerá aquí hasta que active su cuenta."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {invitations.map((inv) => {
              const role = roleById(inv.roleId);
              return (
                <li
                  key={inv.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <MailPlus className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{inv.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Invitado como {role?.name ?? "miembro"} · expira en 6 días
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onResend(inv)}
                      disabled={!canManage}
                    >
                      <RefreshCw className="size-3.5" />
                      Reenviar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRevoke(inv)}
                      disabled={!canManage}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <MailX className="size-3.5" />
                      Revocar
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>

          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={onPageChange}
            totalItems={totalItems}
            pageSize={pageSize}
            className="border-t border-border"
          />
        </div>
      )}
    </section>
  );
}