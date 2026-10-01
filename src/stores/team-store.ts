import { create } from "zustand";
import {
  teamMembers,
  teamInvitations,
  TEAM_ROLE_TEMPLATES,
  findRole,
  type MemberInvitation,
  type TeamMember,
  type TeamRole,
  type LocationScope,
  type SensitiveAction,
  type PermissionModuleKey,
  type PermissionLevel,
} from "@/lib/mock/team";
import { dashboardBranches } from "@/lib/mock/dashboard";
import type { OrganizationBranch } from "@/types/dashboard";

/** Duración por defecto de una invitación (en días). */
const INVITATION_TTL_DAYS = 7;

/** Nombre del usuario actual (mock, no hay auth real). */
export const CURRENT_USER_NAME = "Daniel Sánchez";

const nowIso = () => new Date().toISOString();

interface SendInvitationInput {
  email: string;
  roleId: string;
  locationScope: LocationScope;
  locationIds: string[];
  message?: string;
}

interface TeamStore {
  members: TeamMember[];
  invitations: MemberInvitation[];
  roles: TeamRole[];
  branches: OrganizationBranch[];

  // Lecturas derivadas
  findRoleById: (id: string | undefined) => TeamRole | null;
  membersByRole: (roleId: string) => TeamMember[];

  // Roles
  createRole: (role: Omit<TeamRole, "id">) => TeamRole;
  updateRole: (id: string, changes: Partial<Omit<TeamRole, "id">>) => void;
  removeRole: (id: string) => void;
  cloneRole: (roleId: string) => TeamRole | null;

  // Miembros
  assignRole: (memberId: string, roleId: string, actor?: string) => void;
  toggleMemberStatus: (memberId: string, actor?: string) => void;
  removeMember: (memberId: string) => void;

  // Invitaciones
  sendInvitation: (input: SendInvitationInput) => MemberInvitation;
  revokeInvitation: (id: string) => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  members: teamMembers,
  invitations: teamInvitations,
  roles: TEAM_ROLE_TEMPLATES,
  branches: dashboardBranches,

  findRoleById: (id) => findRole(get().roles, id),

  membersByRole: (roleId) =>
    get().members.filter((m) => m.roleId === roleId),

  createRole: (role) => {
    const newRole: TeamRole = {
      ...role,
      id: `role_${Date.now().toString(36)}`,
    };
    set((state) => ({ roles: [...state.roles, newRole] }));
    return newRole;
  },

  updateRole: (id, changes) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...changes } : r)),
    })),

  removeRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== id),
    })),

  cloneRole: (roleId) => {
    const source = get().findRoleById(roleId);
    if (!source) return null;
    const copy: TeamRole = {
      ...source,
      id: `role_${Date.now().toString(36)}`,
      name: `${source.name} (copia)`,
      key: `${source.key}_copy`,
      isSystem: false,
    };
    set((state) => ({ roles: [...state.roles, copy] }));
    return copy;
  },

  assignRole: (memberId, roleId, actor = CURRENT_USER_NAME) => {
    const role = get().findRoleById(roleId);
    if (!role || !role.assignable) return;
    set((state) => ({
      members: state.members.map((m) =>
        m.id === memberId
          ? {
              ...m,
              roleId: role.id,
              role: role.name,
              auditLog: [
                ...m.auditLog,
                {
                  id: `audit_${Date.now().toString(36)}`,
                  at: nowIso(),
                  type: "rol",
                  description: `Cambió el rol a ${role.name}`,
                  actor,
                },
              ],
            }
          : m,
      ),
    }));
  },

  toggleMemberStatus: (memberId, actor = CURRENT_USER_NAME) => {
    const member = get().members.find((m) => m.id === memberId);
    if (!member || member.roleId === "role_owner") return;
    const nextStatus = member.status === "deshabilitado" ? "activo" : "deshabilitado";
    set((state) => ({
      members: state.members.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: nextStatus,
              auditLog: [
                ...m.auditLog,
                {
                  id: `audit_${Date.now().toString(36)}`,
                  at: nowIso(),
                  type: "acceso",
                  description:
                    nextStatus === "activo"
                      ? "Acceso habilitado nuevamente"
                      : "Acceso deshabilitado",
                  actor,
                },
              ],
            }
          : m,
      ),
    }));
  },

  removeMember: (memberId) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== memberId),
    })),

  sendInvitation: ({ email, roleId, locationScope, locationIds, message }) => {
    const role = get().findRoleById(roleId);
    const invitation: MemberInvitation = {
      id: `inv_${Date.now().toString(36)}`,
      email,
      roleId,
      roleName: role?.name ?? "Sin rol",
      status: "PENDING",
      sentBy: CURRENT_USER_NAME,
      sentAt: nowIso(),
      expiresAt: new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      locationScope,
      locationIds,
    };
    // Mock: el mensaje no se persiste en el modelo, solo se registra en consola.
    if (message) console.info(`[team-store] Invitación a ${email}: ${message}`);
    set((state) => ({ invitations: [invitation, ...state.invitations] }));
    return invitation;
  },

  revokeInvitation: (id) =>
    set((state) => ({
      invitations: state.invitations.map((inv) =>
        inv.id === id ? { ...inv, status: "REVOKED" as const } : inv,
      ),
    })),
}));

// Helper de nivel para tipar cambios de permisos en la UI.
export type { PermissionLevel, PermissionModuleKey, SensitiveAction };