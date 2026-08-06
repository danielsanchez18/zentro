"use client";

import { useMemo, useState } from "react";
import { toastMsg } from "@/components/ui/toast-message";
import { useAuthStore } from "@/stores/auth-store";
import {
  MOCK_MEMBERS,
  MOCK_ROLES,
  MOCK_INVITATIONS,
  type MockMember,
  type MockRole,
  type MockInvitation,
} from "@/lib/mock/users";
import {
  canManageMembers,
  canTouchTargetRole,
} from "@/lib/mock/access-rules";

export type MemberStatusFilter = "all" | "ACTIVE" | "SUSPENDED";

/** Límite de miembros según el plan (mock: Trial = 3, ver Plan.limits.users). */
export const PLAN_MEMBER_LIMIT = 3;
/** Miembros por página. */
export const MEMBERS_PAGE_SIZE = 10;
/** Invitaciones por página. */
export const INVITATIONS_PAGE_SIZE = 10;

/**
 * Reglas de negocio y estado de la página de Usuarios (mock-first).
 * Centraliza la lógica que el día de mañana consumirá endpoints reales de
 * members/roles/invitaciones, incluyendo búsqueda, filtros y paginación.
 */
export function useUsers() {
  const currentUser = useAuthStore((s) => s.user);

  const [members, setMembers] = useState<MockMember[]>(MOCK_MEMBERS);
  const [invitations, setInvitations] = useState<MockInvitation[]>(MOCK_INVITATIONS);
  const [inviteOpen, setInviteOpen] = useState(false);

  // Tab activo: "members" | "invitations"
  const [tab, setTab] = useState<"members" | "invitations">("members");

  const roles: MockRole[] = MOCK_ROLES;

  // Rol del usuario actual dentro del tenant (mock: el Owner es isSelf).
  const selfMember = members.find((m) => m.isSelf);
  const selfRole = roles.find((r) => r.id === selfMember?.roleId);

  // ¿El usuario logueado puede gestionar miembros? (Owner / Admin / MANAGE.MEMBERS)
  const canManage = canManageMembers(selfRole);

  const roleById = (id: string) => roles.find((r) => r.id === id);

  // Miembros activos (excluye invitaciones pendientes) — cuenta del plan.
  const activeMembers = useMemo(
    () => members.filter((m) => m.status === "ACTIVE"),
    [members],
  );
  const planLimitReached = activeMembers.length >= PLAN_MEMBER_LIMIT;

  // Regla: ¿el usuario actual puede actuar sobre un miembro objetivo?
  const canActOn = (member: MockMember) =>
    canManage && canTouchTargetRole(selfRole, roleById(member.roleId));

  /* ---------------------- Búsqueda + filtros (miembros) ------------ */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [membersPage, setMembersPage] = useState(1);

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (q && !`${m.name} ${m.email}`.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (roleFilter !== "all" && m.roleId !== roleFilter) return false;
      return true;
    });
  }, [members, search, statusFilter, roleFilter]);

  const membersPageCount = Math.max(1, Math.ceil(filteredMembers.length / MEMBERS_PAGE_SIZE));
  const paginatedMembers = useMemo(() => {
    const start = (membersPage - 1) * MEMBERS_PAGE_SIZE;
    return filteredMembers.slice(start, start + MEMBERS_PAGE_SIZE);
  }, [filteredMembers, membersPage]);

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setMembersPage(1);
  };
  const handleStatusChange = (v: MemberStatusFilter) => {
    setStatusFilter(v);
    setMembersPage(1);
  };
  const handleRoleChange = (v: string) => {
    setRoleFilter(v);
    setMembersPage(1);
  };

  /* ---------------------- Invitaciones - paginación ---------------- */
  const [invPage, setInvPage] = useState(1);
  const invPageCount = Math.max(1, Math.ceil(invitations.length / INVITATIONS_PAGE_SIZE));
  const paginatedInvitations = useMemo(() => {
    const start = (invPage - 1) * INVITATIONS_PAGE_SIZE;
    return invitations.slice(start, start + INVITATIONS_PAGE_SIZE);
  }, [invitations, invPage]);

  /* ---------------------- Invitar ------------------------------- */
  const handleInvite = (email: string, roleId: string) => {
    // Regla: no invitar a alguien que ya es miembro.
    if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      toastMsg.error("No se puede invitar", "Este email ya es miembro del negocio.");
      return;
    }
    // Regla: no invitar a un email con una invitación pendiente.
    if (invitations.some((i) => i.email.toLowerCase() === email.toLowerCase())) {
      toastMsg.error("Invitación ya enviada", "Este email ya tiene una invitación pendiente.");
      return;
    }
    // Regla: límite del plan.
    if (planLimitReached) {
      toastMsg.error(
        "Límite del plan alcanzado",
        "Tu plan solo permite 3 miembros. Mejora tu plan para invitar más.",
      );
      return;
    }

    const inv: MockInvitation = {
      id: `inv_${Date.now()}`,
      email,
      roleId,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
    };
    setInvitations((prev) => [inv, ...prev]);
    toastMsg.success("Invitación enviada", `Enviamos la invitación a ${email}.`);
  };

  const handleResend = (inv: MockInvitation) => {
    setInvitations((prev) =>
      prev.map((i) =>
        i.id === inv.id ? { ...i, invitedAt: new Date().toISOString() } : i,
      ),
    );
    toastMsg.success("Invitación reenviada", `Volvimos a enviar la invitación a ${inv.email}.`);
  };

  const handleRevoke = (inv: MockInvitation) => {
    setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    toastMsg.info("Invitación revocada", `Cancelamos la invitación de ${inv.email}.`);
  };

  /* ---------------------- Miembros: acciones ---------------------- */
  const handleSuspend = (member: MockMember) => {
    if (member.isSelf) {
      toastMsg.error("No puedes suspendente a ti mismo", "Un usuario no puede auto-suspender su acceso.");
      return;
    }
    if (!canActOn(member)) {
      toastMsg.error("Acción no permitida", "Los roles de sistema no pueden ser suspendidos por este rol.");
      return;
    }
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, status: "SUSPENDED" } : m)),
    );
    toastMsg.success("Miembro suspendido", `${member.name} ya no puede acceder al negocio.`);
  };

  const handleReactivate = (member: MockMember) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, status: "ACTIVE" } : m)),
    );
    toastMsg.success("Miembro reactivado", `${member.name} puede acceder de nuevo.`);
  };

  const handleRemove = (member: MockMember) => {
    if (member.isSelf) {
      toastMsg.error("No puedes eliminarte a ti mismo", "Un usuario no puede eliminar su propio acceso.");
      return;
    }
    if (!canActOn(member)) {
      toastMsg.error("Acción no permitida", "Los roles de sistema no pueden ser eliminados por este rol.");
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    toastMsg.success("Miembro eliminado", `${member.name} ya no pertenece al negocio.`);
  };

  const handleChangeRole = () => {
    toastMsg.info("Cambiar rol", "Funcionalidad en desarrollo (Etapa 2).");
  };

  return {
    currentUser,
    roles,
    members,
    filteredCount: filteredMembers.length,
    invitations,
    inviteOpen,
    setInviteOpen,
    activeMembers,
    canManage,
    canActOn,
    /* tabs y paginación */
    tab,
    setTab,
    search,
    handleSearchChange,
    statusFilter,
    handleStatusChange,
    roleFilter,
    handleRoleChange,
    membersPage,
    setMembersPage,
    membersPageCount,
    membersPageSize: MEMBERS_PAGE_SIZE,
    paginatedMembers,
    totalMembers: filteredMembers.length,
    invPage,
    setInvPage,
    invPageCount,
    paginatedInvitations,
    /* acciones */
    handleInvite,
    handleResend,
    handleRevoke,
    handleSuspend,
    handleReactivate,
    handleRemove,
    handleChangeRole,
  };
}