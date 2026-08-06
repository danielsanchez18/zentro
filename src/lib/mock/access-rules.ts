import { PERMISSION_CODE, type MockRole } from "./users";

/**
 * Reglas de negocio de RBAC para Usuarios y Roles (ADR-009/010 + dominio Notion).
 *
 * Reglas clave:
 * - Pueden gestionar miembros (invitar/asignar/revocar/suspender): el Owner, los
 *   Admins y CUALQUIER rol que tenga el permiso `MANAGE.MEMBERS`.
 * - Pueden crear/editar/eliminar roles: Owner, Admin y roles con `MANAGE.ROLES`.
 * - Los roles default (Owner/Admin) y el Owner actual no pueden ser tocados por
 *   un rol "MANAGE.MEMBERS" no-Admin/Owner.
 */
export function canManageMembers(role: MockRole | undefined): boolean {
  if (!role) return false;
  return role.isOwner || role.permissions.includes(PERMISSION_CODE.MANAGE_MEMBERS);
}

export function canManageRoles(role: MockRole | undefined): boolean {
  if (!role) return false;
  return role.isOwner || role.permissions.includes(PERMISSION_CODE.MANAGE_ROLES);
}

/** Owner actual presentado en el mock (se marca `isSelf` en MOCK_MEMBERS). */
export function isOwnerRole(role: MockRole | undefined): boolean {
  return !!role?.isOwner;
}

/** Rol de sistema (Owner o Admin) — no editable / no eliminable. */
export function isSystemRole(role: MockRole | undefined): boolean {
  return !!role?.system;
}

/** Un rol con MANAGE.MEMBERS (y no Owner) no puede tocar a roles default. */
export function canTouchTargetRole(
  actor: MockRole | undefined,
  targetRole: MockRole | undefined,
): boolean {
  if (!actor || !targetRole) return false;
  // Owner puede tocar a cualquiera (excepto a sí mismo, validado aparte).
  if (actor.isOwner) return true;
  // Roles no-Admin con MANAGE.MEMBERS no pueden tocar a Owner/Admin.
  if (isSystemRole(targetRole)) return false;
  return true;
}