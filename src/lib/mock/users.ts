/**
 * Mock data para la página de Usuarios del tenant (/app/:slug/usuarios).
 * Se usa mientras el backend de members/roles/invitaciones no está conectado.
 *
 * Estructura alineada con el modelo de dominio de Notion (Usuarios + Roles) y
 * con los ADR-009/010 (RBAC dinámico por códigos de permiso, jerarquía de
 * roles, invitaciones con token de 7 días).
 */

/* ------------------------------------------------------------------ */
/* Permisos (catálogo global)                                         */
/* ------------------------------------------------------------------ */

export type PermissionAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | "APPROVE";

/** Códigos de permiso del catálogo (scope ORG). */
export const PERMISSION_CODE = {
  MANAGE_MEMBERS: "MANAGE.MEMBERS", // invitar / asignar / revocar / suspender
  MANAGE_ROLES: "MANAGE.ROLES", // crear / editar / eliminar roles
  MANAGE_ORG: "MANAGE.ORG", // config del tenant, facturación
  READ_ORDERS: "READ.ORDERS",
  CREATE_ORDERS: "CREATE.ORDERS",
  READ_PRODUCTS: "READ.PRODUCTS",
  CREATE_PRODUCTS: "CREATE.PRODUCTS",
  UPDATE_PRODUCTS: "UPDATE.PRODUCTS",
  READ_INVENTORY: "READ.INVENTORY",
  UPDATE_INVENTORY: "UPDATE.INVENTORY",
  READ_REPORTS: "READ.REPORTS",
  READ_CUSTOMERS: "READ.CUSTOMERS",
  UPDATE_CUSTOMERS: "UPDATE.CUSTOMERS",
} as const;

export type PermissionCode = (typeof PERMISSION_CODE)[keyof typeof PERMISSION_CODE];

/* ------------------------------------------------------------------ */
/* Roles                                                              */
/* ------------------------------------------------------------------ */

export interface MockRole {
  id: string;
  name: string;
  /** Roles de sistema (Owner/Admin) no se pueden editar ni eliminar. */
  system?: boolean;
  /** Todos los permisos (Owner). */
  isOwner?: boolean;
  description?: string;
  /** Códigos de permiso asignados. */
  permissions: PermissionCode[];
}

const ALL_PERMISSIONS = Object.values(PERMISSION_CODE) as PermissionCode[];

/** Roles por defecto: Owner (todo) y Admin. */
export const MOCK_ROLES: MockRole[] = [
  {
    id: "role_owner",
    name: "Owner",
    system: true,
    isOwner: true,
    description: "Acceso total a la organización, incluyendo configuración y facturación.",
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "role_admin",
    name: "Admin",
    system: true,
    description: "Gestiona capacidades, roles y usuarios, sin acceso a facturación.",
    permissions: [
      PERMISSION_CODE.MANAGE_MEMBERS,
      PERMISSION_CODE.MANAGE_ROLES,
      PERMISSION_CODE.READ_ORDERS,
      PERMISSION_CODE.CREATE_ORDERS,
      PERMISSION_CODE.READ_PRODUCTS,
      PERMISSION_CODE.CREATE_PRODUCTS,
      PERMISSION_CODE.UPDATE_PRODUCTS,
      PERMISSION_CODE.READ_INVENTORY,
      PERMISSION_CODE.UPDATE_INVENTORY,
      PERMISSION_CODE.READ_REPORTS,
      PERMISSION_CODE.READ_CUSTOMERS,
      PERMISSION_CODE.UPDATE_CUSTOMERS,
    ],
  },
  {
    id: "role_vendedor",
    name: "Vendedor",
    description: "Ventas, caja y clientes en las sucursales asignadas.",
    permissions: [
      PERMISSION_CODE.READ_ORDERS,
      PERMISSION_CODE.CREATE_ORDERS,
      PERMISSION_CODE.READ_PRODUCTS,
      PERMISSION_CODE.READ_CUSTOMERS,
    ],
  },
  {
    id: "role_inventarista",
    name: "Inventarista",
    description: "Catálogo e inventario.",
    permissions: [
      PERMISSION_CODE.READ_PRODUCTS,
      PERMISSION_CODE.CREATE_PRODUCTS,
      PERMISSION_CODE.UPDATE_PRODUCTS,
      PERMISSION_CODE.READ_INVENTORY,
      PERMISSION_CODE.UPDATE_INVENTORY,
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Miembros                                                           */
/* ------------------------------------------------------------------ */

export type MemberStatus = "ACTIVE" | "SUSPENDED";

export interface MockMember {
  id: string;
  name: string;
  email: string;
  roleId: string;
  /** "ALL" (todas las sucursales) o lista de ids de sucursal. */
  branches: "ALL" | string[];
  status: MemberStatus;
  /** ISO fecha del último acceso (o null). */
  lastAccessAt?: string | null;
  /** Es el usuario actualmente logueado (para bloquear auto-modificación). */
  isSelf?: boolean;
}

export interface MockInvitation {
  id: string;
  email: string;
  roleId: string;
  invitedAt: string;
  /** Días restantes del token (7 días de expiración, ADR-010). */
  expiresAt: string;
  status: "PENDING";
}

/**
 * Miembros de ejemplo. `isSelf` marca al Owner actual (no editable por otros,
 * no eliminable). El resto son datos de prueba para el mock.
 */
export const MOCK_MEMBERS: MockMember[] = [
  {
    id: "m_self",
    name: "Cliente X",
    email: "clientex.test@zentro.dev",
    roleId: "role_owner",
    branches: "ALL",
    status: "ACTIVE",
    lastAccessAt: new Date().toISOString(),
    isSelf: true,
  },
  {
    id: "m_ana",
    name: "Ana Torres",
    email: "ana@lasrocas.pe",
    roleId: "role_admin",
    branches: "ALL",
    status: "ACTIVE",
    lastAccessAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "m_carlos",
    name: "Carlos Díaz",
    email: "carlos@lasrocas.pe",
    roleId: "role_vendedor",
    branches: ["branch_001"],
    status: "ACTIVE",
    lastAccessAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "m_laura",
    name: "Laura Gómez",
    email: "laura@lasrocas.pe",
    roleId: "role_inventarista",
    branches: "ALL",
    status: "SUSPENDED",
    lastAccessAt: null,
  },
];

/** Invitaciones pendientes de aceptar. */
export const MOCK_INVITATIONS: MockInvitation[] = [
  {
    id: "inv_1",
    email: "pedro@lasrocas.pe",
    roleId: "role_vendedor",
    invitedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
  },
];
