import { Users } from "lucide-react";
import type { MockMember, MockRole } from "@/lib/mock/users";
import { List, type ListColumn, type ListFilterField } from "./List";
import { MemberRow } from "./MemberRow";
import type { MemberStatusFilter } from "./useUsers";

interface MembersTableProps {
  /** Miembros filtrados + paginados de la página actual. */
  members: MockMember[];
  roles: MockRole[];
  canActOn: (member: MockMember) => boolean;
  onSuspend: (member: MockMember) => void;
  onReactivate: (member: MockMember) => void;
  onRemove: (member: MockMember) => void;
  onChangeRole: (member: MockMember) => void;
  /* Búsqueda y filtros */
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: MemberStatusFilter;
  onStatusChange: (v: MemberStatusFilter) => void;
  roleFilter: string;
  onRoleChange: (v: string) => void;
  /* Paginación */
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

const COLUMNS: ListColumn[] = [
  { key: "member", label: "Miembro" },
  { key: "role", label: "Rol" },
  { key: "branches", label: "Sucursales" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones", className: "text-right", srOnlyLabel: true },
];

const STATUS_OPTIONS: ListFilterField["options"] = [
  { value: "all", label: "Todos los estados" },
  { value: "ACTIVE", label: "Activo" },
  { value: "SUSPENDED", label: "Suspendido" },
];

/** Tabla de miembros del negocio, construida sobre el componente `List`. */
export function MembersTable({
  members,
  roles,
  canActOn,
  onSuspend,
  onReactivate,
  onRemove,
  onChangeRole,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  page,
  pageCount,
  onPage,
  totalItems,
  pageSize,
}: MembersTableProps) {
  const roleById = (id: string) => roles.find((r) => r.id === id);

  const filters: ListFilterField[] = [
    {
      id: "status",
      label: "Estado",
      value: statusFilter,
      defaultValue: "all",
      onChange: (v) => onStatusChange(v as MemberStatusFilter),
      options: STATUS_OPTIONS,
    },
    {
      id: "role",
      label: "Rol",
      value: roleFilter,
      defaultValue: "all",
      onChange: onRoleChange,
      options: [{ value: "all", label: "Todos los roles" }, ...roles.map((r) => ({ value: r.id, label: r.name }))],
    },
  ];

  return (
    <List<MockMember>
      itemLabel="miembro"
      itemsLabel="miembros"
      emptyIcon={Users}
      total={totalItems}
      items={members}
      columns={COLUMNS}
      renderRow={(member) => (
        <MemberRow
          key={member.id}
          member={member}
          role={roleById(member.roleId)}
          canAct={canActOn(member)}
          onSuspend={onSuspend}
          onReactivate={onReactivate}
          onRemove={onRemove}
          onChangeRole={onChangeRole}
        />
      )}
      search={search}
      onSearchChange={onSearchChange}
      filters={filters}
      onClearFilters={() => {
        onStatusChange("all" as MemberStatusFilter);
        onRoleChange("all");
        onSearchChange("");
      }}
      page={page}
      pageCount={pageCount}
      onPageChange={onPage}
      pageSize={pageSize}
    />
  );
}