"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { toastMsg } from "@/components/ui/toast-message";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "../shared/Search";
import { Paginator } from "../shared/Paginator";
import { MemberPreviewDialog } from "./MemberPreviewDialog";
import { RoleChangeDialog } from "./RoleChangeDialog";
import { Table } from "./Table";
import { teamMembers, type TeamMember, type TeamRole } from "@/lib/mock/team";

const PAGE_SIZE = 10;

interface ListProps {
  initialMembers?: TeamMember[];
  /** Slug de la organización (p. ej. las-rocas) para armar URLs internas. */
  slug: string;
}

/**
 * Lista del módulo Equipo y permisos.
 * Orquesta búsqueda, paginación y acciones sobre los miembros (mock).
 */
export const List = ({ initialMembers = teamMembers, slug }: ListProps) => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
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

  return (
    <div className="sm:p-5 font-heading sm:rounded-lg sm:border sm:border-border sm:bg-card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full md:max-w-md flex-1 min-w-60">
          <Search
            placeholder="Buscar por nombre o correo"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
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
          <Table
            members={pageItems}
            onPreview={setPreviewMember}
            onRequestRoleChange={setRoleMember}
            onToggleAccess={handleToggleAccess}
            onRemove={handleRemove}
          />

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
    </div>
  );
};
