"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Copy,
  Edit3,
  MoreHorizontal,
  Plus,
  SearchX,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toastMsg } from "@/components/ui/toast-message";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "@/components/app/shared/Search";
import { Paginator } from "@/components/app/shared/Paginator";
import { useTeamStore } from "@/stores/team-store";
import type { TeamRole } from "@/lib/mock/team";
import { ConfirmDialog } from "../ConfirmDialog";
import { roleIcon } from "../RoleChangeDialog";

const PAGE_SIZE = 5;

interface RolesSectionProps {
  slug?: string;
}

/**
 * Tab «Roles y permisos».
 *
 * Lista los perfiles de acceso (entidad TeamRole): el Owner (bloqueado, no
 * editable) y los roles asignables. Permite crear, editar, duplicar y eliminar
 * roles custom navegando a sus páginas dedicadas.
 */
export const RolesSection = ({ slug }: RolesSectionProps) => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const currentSlug = slug || params.slug || "";

  const roles = useTeamStore((s) => s.roles);
  const removeRole = useTeamStore((s) => s.removeRole);
  const membersByRole = useTeamStore((s) => s.membersByRole);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<TeamRole | null>(null);

  const owner = roles.find((r) => r.kind === "owner");
  const assignable = roles.filter((r) => r.kind !== "owner");

  const allRoles = useMemo(
    () => (owner ? [owner, ...assignable] : roles),
    [owner, assignable, roles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allRoles;
    return allRoles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [allRoles, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRoles = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleCreateNew = () => {
    router.push(`/app/${currentSlug}/equipo/roles/nuevo`);
  };

  const handleEdit = (role: TeamRole) => {
    router.push(`/app/${currentSlug}/equipo/roles/${role.id}`);
  };

  const handleDuplicate = (roleId: string) => {
    router.push(`/app/${currentSlug}/equipo/roles/nuevo?duplicate=${roleId}`);
  };

  const handleDelete = () => {
    if (!deleting) return;
    if (membersByRole(deleting.id).length > 0) {
      toastMsg.info(
        "Rol en uso",
        `No se puede eliminar “${deleting.name}”: tiene miembros asignados.`,
      );
      return;
    }
    removeRole(deleting.id);
    toastMsg.success(
      "Rol eliminado",
      `“${deleting.name}” ya no está disponible.`,
    );
  };

  const RoleBadge = ({ role }: { role: TeamRole }) => {
    const Icon = roleIcon(role.icon);
    const count = membersByRole(role.id).length;
    const isOwner = role.kind === "owner";
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleEdit(role)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleEdit(role);
          }
        }}
        className={cn(
          "group relative cursor-pointer rounded-xl border border-border bg-card p-4 font-heading transition-all hover:border-primary",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:text-primary",
              isOwner
                ? "bg-primary/10 text-primary"
                : "bg-accent text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
          </div>
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {isOwner ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1.5 text-xs font-semibold text-primary">
                Titular
              </span>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer outline-none"
                  aria-label={`Acciones de ${role.name}`}
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={() => handleEdit(role)}
                    className="py-1.5 px-2 cursor-pointer"
                  >
                    <Edit3 className="size-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDuplicate(role.id)}
                    className="py-1.5 px-2 cursor-pointer"
                  >
                    <Copy className="size-4" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleting(role)}
                    className="py-1.5 px-2 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm font-medium transition-colors group-hover:text-primary">
            {role.name}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {role.description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
            <Users className="size-3.5" />
            {count} {count === 1 ? "miembro" : "miembros"}
          </span>
          {role.isSystem && !isOwner && (
            <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1.5 text-xs font-semibold text-primary">
              Sistema
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="sm:p-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card space-y-5">
      {/* Buscador */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full md:max-w-md flex-1 min-w-60">
          <Search
            placeholder="Buscar por nombre o descripción"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>
      </div>

      {roles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={Shield}
            title="Sin roles"
            description="Crea tu primer perfil de acceso para el equipo."
            actionLabel="Crear rol"
            onAction={handleCreateNew}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description={`No encontramos roles que coincidan con “${query}”.`}
            actionLabel="Crear nuevo rol"
            onAction={handleCreateNew}
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {currentPage === 1 && !query.trim() && (
              <button
                type="button"
                onClick={handleCreateNew}
                className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 font-heading text-center transition-all hover:border-primary/50 hover:bg-accent/40 cursor-pointer min-h-40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Plus className="size-5" />
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Crear nuevo rol
                  </p>
                  <p className="mt-1 text-balance line-clamp-2 text-sm text-muted-foreground">
                    Configura un perfil personalizado con permisos y accesos a
                    medida.
                  </p>
                </div>
              </button>
            )}

            {pageRoles.map((role) => (
              <RoleBadge key={role.id} role={role} />
            ))}
          </div>

          <Paginator
            totalResults={filtered.length}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Eliminar rol"
        description={
          deleting
            ? `“${deleting.name}” dejará de estar disponible para nuevas asignaciones. Los miembros que lo usan conservarán su acceso actual.`
            : ""
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
};
