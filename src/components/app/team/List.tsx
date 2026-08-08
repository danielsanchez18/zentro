"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, SearchX, Table2 } from "lucide-react";
import { toastMsg } from "@/components/ui/toast-message";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { Search } from "../shared/Search";
import { Paginator } from "../shared/Paginator";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { MemberCard } from "./MemberCard";
import { MemberPreviewDialog } from "./MemberPreviewDialog";
import { RoleChangeDialog } from "./RoleChangeDialog";
import { Table } from "./Table";
import { teamMembers, type TeamMember, type TeamRole } from "@/lib/mock/team";

const PAGE_SIZE = 10;

/** Nombre que se muestra para un invitado recién creado (hasta que acepte). */
const placeholderName = (email: string) => {
  const local = email.split("@")[0];
  const words = local.split(/[._-]+/).filter(Boolean);
  if (words.length === 0) return email;
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

type MemberView = "tabla" | "cards";

interface ListProps {
  initialMembers?: TeamMember[];
  /** Slug de la organización (p. ej. las-rocas) para armar URLs internas. */
  slug: string;
  /** Apertura del dialog de invitación (lo controla TeamModule). */
  inviteOpen: boolean;
  onInviteOpenChange: (open: boolean) => void;
}

const VIEWS: { id: MemberView; label: string; icon: typeof Table2 }[] = [
  { id: "tabla", label: "Vista tabla", icon: Table2 },
  { id: "cards", label: "Vista cards", icon: LayoutGrid },
];

/**
 * Lista del módulo Equipo y permisos.
 * Orquesta búsqueda, paginación, vistas (tabla/cards) y acciones (mock).
 */
export const List = ({
  initialMembers = teamMembers,
  slug,
  inviteOpen,
  onInviteOpenChange,
}: ListProps) => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<MemberView>("cards");
  // Integrante cuyo rol se está editando (null = dialog cerrado).
  const [roleMember, setRoleMember] = useState<TeamMember | null>(null);
  // Integrante que se muestra en el preview del perfil (null = cerrado).
  const [previewMember, setPreviewMember] = useState<TeamMember | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    );
  }, [members, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleRoleChange = (member: TeamMember, role: TeamRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, role } : m)),
    );
    setRoleMember(null);
    toastMsg.success("Rol actualizado", `${member.name} ahora es ${role}.`);
  };

  const handleToggleAccess = (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    const disabling = target.status !== "deshabilitado";
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: disabling ? "deshabilitado" : "activo" }
          : m,
      ),
    );
    toastMsg.success(disabling ? "Acceso deshabilitado" : "Acceso habilitado", target.name);
  };

  const handleRemove = (id: string) => {
    const name = members.find((m) => m.id === id)?.name ?? "Miembro";
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toastMsg.info(`${name} eliminado/a de la empresa`, "Mockup: se enviará confirmación antes de borrar de verdad.");
  };

  const handleInvite = (email: string, role: TeamRole, message?: string) => {
    const normalized = email.trim().toLowerCase();
    const existing = members.find(
      (m) => m.email.toLowerCase() === normalized,
    );

    // Ninguna invitación duplicada: si el correo ya es miembro/invitado,
    // lo informamos en vez de crear una fila repetida.
    if (existing) {
      onInviteOpenChange(false);
      toastMsg.info(
        "Correo ya está en el equipo",
        `${existing.name} ya recibe invitaciones o es parte de la empresa.`,
      );
      return;
    }

    const now = new Date();
    const member: TeamMember = {
      id: `u${now.getTime()}`,
      name: placeholderName(normalized),
      email: normalized,
      phone: "",
      role,
      status: "invitado",
      lastSeen: "nunca",
      addedAt: now.toISOString().slice(0, 10),
      addedBy: "Daniel Sánchez", // mock: usuario de la sesión
      auditLog: [
        {
          id: `a-${now.getTime()}`,
          at: now.toISOString(),
          type: "invitacion",
          description: message
            ? `Invitado por Daniel Sánchez (${message})`
            : "Invitado por Daniel Sánchez (pendiente de aceptar)",
          actor: "Daniel Sánchez",
        },
      ],
    };

    setMembers((prev) => [member, ...prev]);
    onInviteOpenChange(false);
    setPage(1);
    toastMsg.success(
      "Invitación enviada",
      message
        ? `Correo enviado a ${normalized} como ${role}. Mensaje incluido: “${message}”.`
        : `Correo enviado a ${normalized} como ${role}.`,
    );
  };

  return (
    <div className="sm:p-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full md:max-w-md flex-1 min-w-60">
          <Search
            placeholder="Buscar por nombre o correo"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>

        {/* Toggle tabla / cards */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              aria-label={label}
              aria-pressed={view === id}
              className={cn(
                "rounded-md p-1.5 transition-colors cursor-pointer",
                view === id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>

      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description={`No encontramos integrantes que coincidan con “${query}”.`}
          />
        </div>
      ) : (
        <>
          {view === "tabla" ? (
            <Table
              members={pageItems}
              onPreview={setPreviewMember}
              onRequestRoleChange={setRoleMember}
              onToggleAccess={handleToggleAccess}
              onRemove={handleRemove}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onPreview={setPreviewMember}
                  onRequestRoleChange={setRoleMember}
                  onToggleAccess={handleToggleAccess}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}

          <Paginator
            totalResults={filtered.length}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </>
      )}

      <MemberPreviewDialog
        member={previewMember}
        slug={slug}
        open={previewMember !== null}
        onOpenChange={(open) => !open && setPreviewMember(null)}
      />

      <RoleChangeDialog
        member={roleMember}
        open={roleMember !== null}
        onOpenChange={(open) => !open && setRoleMember(null)}
        onConfirm={handleRoleChange}
      />

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={onInviteOpenChange}
        onSend={handleInvite}
      />
    </div>
  );
};
