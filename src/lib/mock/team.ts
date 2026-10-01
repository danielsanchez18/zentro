/**
 * Datos mock del módulo Equipo y permisos.
 *
 * Fuente temporal mientras no exista `GET /team` en el backend. La estructura
 * replica lo que devolverá la API (TeamMember, TeamRole) para que luego el page
 * solo cambie el origen de datos.
 *
 * Modelo de acceso (decisión de producto 09/09/2026):
 * - Solo OWNER y MEMBER son identidades base. El resto (Administrador, Cajero,
 *   Ventas…) son perfiles de acceso representados por la entidad `TeamRole`.
 * - El rol define QUÉ acciones puede realizar; el alcance de ubicaciones define
 *   DÓNDE puede realizarlas (`locationScope` + `locationIds`).
 */

export type MemberStatus = "activo" | "invitado" | "deshabilitado";

/** Ciclo de vida de una invitación enviada. */
export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "REVOKED";

/** Nivel de acceso por módulo. */
export type PermissionLevel = "none" | "view" | "operate" | "admin";

/** Módulos del workspace que participan en la matriz de permisos. */
export type PermissionModuleKey =
  | "pos"
  | "pedidos"
  | "catalogo"
  | "inventario"
  | "compras"
  | "promociones"
  | "clientes"
  | "agenda"
  | "formularios"
  | "caja"
  | "facturacion"
  | "reportes"
  | "presencia"
  | "canales"
  | "blog"
  | "marketing"
  | "marketplace"
  | "equipo"
  | "configuracion"
  | "auditoria";

/** Acciones sensibles que aparecen como opciones explícitas (no solo nivel). */
export type SensitiveAction =
  | "reembolsar"
  | "anular_comprobante"
  | "ajustar_stock"
  | "invitar_miembros"
  | "cambiar_roles"
  | "transferir_propiedad"
  | "eliminar_organizacion";

/** Alcance de ubicaciones: TODAS o un subconjunto explícito. */
export type LocationScope = "ALL" | "SELECTED";

/** Dominio de agrupación para la matriz de permisos en la UI. */
export type ModuleDomain =
  | "operacion"
  | "productos"
  | "clientes"
  | "finanzas"
  | "presencia"
  | "administracion";

export interface PermissionModuleDef {
  key: PermissionModuleKey;
  label: string;
  domain: ModuleDomain;
  /** Nivel por defecto para un rol estándar de solo consulta. */
  defaultLevel: PermissionLevel;
}

export interface SensitiveActionDef {
  key: SensitiveAction;
  label: string;
  description: string;
}

/** Entidad Rol: define permisos por módulo, acciones sensibles y alcance. */
export interface TeamRole {
  id: string;
  /** clave estable usada para lógica (p. ej. "admin"). */
  key: string;
  name: string;
  description: string;
  /** "owner" es la identidad de propiedad; "member" son perfiles de acceso. */
  kind: "owner" | "member";
  /** Nombre del ícono lucide para la UI (se resuelve en el componente). */
  icon: string;
  /** Rol predefinido del sistema (no editable) o custom. */
  isSystem: boolean;
  permissions: Record<PermissionModuleKey, PermissionLevel>;
  sensitiveActions: SensitiveAction[];
  locationScope: LocationScope;
  locationIds: string[];
  /** Si aparece como opción de asignación (el Owner nunca se asigna). */
  assignable: boolean;
}

/** Invitación a unirse a la organización (antes de ser miembro). */
export interface MemberInvitation {
  id: string;
  email: string;
  /** Id del rol/perfil elegido al invitar. */
  roleId: string;
  /** Nombre del rol en el momento del envío (snapshot visual). */
  roleName: string;
  status: InvitationStatus;
  /** Quién la envió. */
  sentBy: string;
  /** ISO datetime de envío. */
  sentAt: string;
  /** ISO datetime de expiración (7 días por defecto). */
  expiresAt: string;
  /** Alcance heredado del rol el día del envío (personalizable). */
  locationScope: LocationScope;
  locationIds: string[];
}

/** Tipos de evento del historial del miembro (auditoría operativa). */
export type MemberAuditType =
  | "rol"
  | "acceso"
  | "invitacion"
  | "ingreso"
  | "perfil";

export interface MemberAuditEvent {
  id: string;
  /** ISO datetime de cuando ocurrió el evento. */
  at: string;
  type: MemberAuditType;
  /** Descripción legible (p. ej. "Cambio de rol a Admin"). */
  description: string;
  /** Quién ejecutó el cambio. */
  actor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Id del rol vigente del miembro. */
  roleId: string;
  /** Nombre del rol como snapshot (coherente con TeamRole.name). */
  role: string;
  status: MemberStatus;
  /** "online" | "nunca" | texto relativo (p. ej. "hace 2 días") */
  lastSeen: string;
  /** Fecha en que se agregó a la organización (ISO). */
  addedAt: string;
  /** Quién lo agregó a la organización. */
  addedBy: string;
  /** Último acceso real (ISO, opcional: invitados aún no entran). */
  lastLoginAt?: string;
  /** Historial operativo del miembro (auditoría). */
  auditLog: MemberAuditEvent[];
}

/** Catálogo de módulos con su dominio y etiqueta para la matriz. */
export const PERMISSION_MODULES: PermissionModuleDef[] = [
  { key: "pos", label: "Punto de venta", domain: "operacion", defaultLevel: "none" },
  { key: "pedidos", label: "Pedidos", domain: "operacion", defaultLevel: "none" },
  { key: "caja", label: "Caja", domain: "operacion", defaultLevel: "none" },
  { key: "facturacion", label: "Facturación", domain: "operacion", defaultLevel: "none" },
  { key: "catalogo", label: "Catálogo", domain: "productos", defaultLevel: "none" },
  { key: "inventario", label: "Inventario", domain: "productos", defaultLevel: "none" },
  { key: "compras", label: "Compras", domain: "productos", defaultLevel: "none" },
  { key: "promociones", label: "Promociones", domain: "productos", defaultLevel: "none" },
  { key: "clientes", label: "Clientes (CRM)", domain: "clientes", defaultLevel: "none" },
  { key: "agenda", label: "Agenda", domain: "clientes", defaultLevel: "none" },
  { key: "formularios", label: "Formularios", domain: "clientes", defaultLevel: "none" },
  { key: "reportes", label: "Reportes", domain: "finanzas", defaultLevel: "none" },
  { key: "presencia", label: "Sitio web", domain: "presencia", defaultLevel: "none" },
  { key: "canales", label: "Canales de venta", domain: "presencia", defaultLevel: "none" },
  { key: "blog", label: "Blog", domain: "presencia", defaultLevel: "none" },
  { key: "marketing", label: "Marketing", domain: "presencia", defaultLevel: "none" },
  { key: "marketplace", label: "Marketplace", domain: "presencia", defaultLevel: "none" },
  { key: "equipo", label: "Equipo y permisos", domain: "administracion", defaultLevel: "none" },
  { key: "configuracion", label: "Configuración", domain: "administracion", defaultLevel: "none" },
  { key: "auditoria", label: "Auditoría", domain: "administracion", defaultLevel: "none" },
];

/** Catálogo de acciones sensibles (opciones avanzadas explícitas). */
export const SENSITIVE_ACTIONS: SensitiveActionDef[] = [
  { key: "reembolsar", label: "Reembolsar pedidos", description: "Devolver total o parcial de un pedido" },
  { key: "anular_comprobante", label: "Anular comprobantes", description: "Dar de baja facturas, boletas o notas" },
  { key: "ajustar_stock", label: "Ajustar stock", description: "Corregir inventario con mermas o ajustes" },
  { key: "invitar_miembros", label: "Invitar miembros", description: "Enviar invitaciones al equipo" },
  { key: "cambiar_roles", label: "Cambiar roles", description: "Asignar o revocar perfiles de acceso" },
  { key: "transferir_propiedad", label: "Transferir propiedad", description: "Ceder la titularidad de la organización" },
  { key: "eliminar_organizacion", label: "Eliminar organización", description: "Cerrar o archivar definitivamente" },
];

/** Etiqueta corta de cada nivel (para chips y badges). */
export const PERMISSION_LEVEL_LABELS: Record<PermissionLevel, string> = {
  none: "Sin acceso",
  view: "Solo ver",
  operate: "Operar",
  admin: "Administrar",
};

/** Orden de los niveles (para progresión visual). */
export const PERMISSION_LEVEL_ORDER: PermissionLevel[] = [
  "none",
  "view",
  "operate",
  "admin",
];

const fullPermissions = (
  overrides: Partial<Record<PermissionModuleKey, PermissionLevel>> = {},
): Record<PermissionModuleKey, PermissionLevel> => {
  const base = Object.fromEntries(
    PERMISSION_MODULES.map((m) => [m.key, "none" as PermissionLevel]),
  ) as Record<PermissionModuleKey, PermissionLevel>;
  return { ...base, ...overrides };
};

/**
 * Roles de sistema (plantillas). Solo el Owner es identidad de propiedad; los
 * demás son perfiles aplicables a un Member y pueden clonarse o personalizarse.
 */
export const TEAM_ROLE_TEMPLATES: TeamRole[] = [
  {
    id: "role_owner",
    key: "owner",
    name: "Owner",
    description: "Titular de la organización con acciones exclusivas de propiedad.",
    kind: "owner",
    icon: "Crown",
    isSystem: true,
    permissions: fullPermissions(Object.fromEntries(PERMISSION_MODULES.map((m) => [m.key, "admin" as PermissionLevel]))),
    sensitiveActions: SENSITIVE_ACTIONS.map((a) => a.key),
    locationScope: "ALL",
    locationIds: [],
    assignable: false,
  },
  {
    id: "role_admin",
    key: "admin",
    name: "Administrador",
    description: "Gestiona el equipo, la configuración y la operación del negocio.",
    kind: "member",
    icon: "Shield",
    isSystem: true,
    permissions: fullPermissions({
      pos: "operate", pedidos: "admin", caja: "admin", facturacion: "admin",
      catalogo: "admin", inventario: "admin", compras: "admin", promociones: "admin",
      clientes: "admin", agenda: "admin", formularios: "admin",
      reportes: "admin", presencia: "admin", canales: "admin", blog: "admin", marketing: "admin", marketplace: "admin",
      equipo: "admin", configuracion: "admin", auditoria: "admin",
    }),
    sensitiveActions: ["reembolsar", "anular_comprobante", "ajustar_stock", "invitar_miembros", "cambiar_roles"],
    locationScope: "ALL",
    locationIds: [],
    assignable: true,
  },
  {
    id: "role_vendedor",
    key: "vendedor",
    name: "Vendedor",
    description: "Realiza ventas, atiende pedidos y gestiona clientes.",
    kind: "member",
    icon: "ShoppingBag",
    isSystem: true,
    permissions: fullPermissions({
      pos: "operate", pedidos: "operate",
      catalogo: "view", clientes: "operate", agenda: "view",
      reportes: "view", facturacion: "view",
    }),
    sensitiveActions: [],
    locationScope: "ALL",
    locationIds: [],
    assignable: true,
  },
  {
    id: "role_cajero",
    key: "cajero",
    name: "Cajero",
    description: "Opera el punto de venta y la caja del día.",
    kind: "member",
    icon: "Wallet",
    isSystem: true,
    permissions: fullPermissions({
      pos: "operate", pedidos: "view",
      caja: "operate", clientes: "view", facturacion: "view",
    }),
    sensitiveActions: [],
    locationScope: "ALL",
    locationIds: [],
    assignable: true,
  },
  {
    id: "role_contador",
    key: "contador",
    name: "Contador",
    description: "Accede a reportes, finanzas y comprobantes.",
    kind: "member",
    icon: "Calculator",
    isSystem: true,
    permissions: fullPermissions({
      facturacion: "admin", reportes: "admin",
      caja: "view", compras: "view", pedidos: "view",
    }),
    sensitiveActions: ["anular_comprobante"],
    locationScope: "ALL",
    locationIds: [],
    assignable: true,
  },
  {
    id: "role_inventario",
    key: "inventario",
    name: "Inventario y compras",
    description: "Administra stock, compras y recepciones.",
    kind: "member",
    icon: "PackageSearch",
    isSystem: true,
    permissions: fullPermissions({
      catalogo: "view", inventario: "admin", compras: "admin", promociones: "view",
    }),
    sensitiveActions: ["ajustar_stock"],
    locationScope: "ALL",
    locationIds: [],
    assignable: true,
  },
  {
    id: "role_contenido",
    key: "contenido",
    name: "Contenido y canales",
    description: "Administra sitio web, blog, marketing y marketplace.",
    kind: "member",
    icon: "Megaphone",
    isSystem: true,
    permissions: fullPermissions({
      presencia: "admin", canales: "operate", blog: "admin", marketing: "admin", marketplace: "operate",
      catalogo: "view", clientes: "view",
    }),
    sensitiveActions: [],
    locationScope: "ALL",
    locationIds: [],
    assignable: true,
  },
];

/** Rol Owner de sistema (referencia rápida). */
export const TEAM_ROLE_OWNER = TEAM_ROLE_TEMPLATES[0];

/** Roles asignables (todo rol que no sea Owner ni esté marcado no-asignable). */
export const assignableRoles = (roles: TeamRole[]): TeamRole[] =>
  roles.filter((r) => r.assignable && r.kind !== "owner");

/** Resuelve un rol por id; devuelve `null` si no existe. */
export const findRole = (roles: TeamRole[], id: string | undefined): TeamRole | null =>
  roles.find((r) => r.id === id) ?? null;

/** Devuelve los ids de ubicación resueltos para un rol (vacío si es ALL). */
export const roleLocationLabel = (role: TeamRole | null, branches: { id: string; name: string }[]): string => {
  if (!role) return "Sin rol";
  if (role.locationScope === "ALL" || role.locationIds.length === 0) return "Todas las ubicaciones";
  const names = branches
    .filter((b) => role.locationIds.includes(b.id))
    .map((b) => b.name);
  return names.length > 0 ? names.join(", ") : "Ubicaciones no disponibles";
};

const audit = (
  id: string,
  at: string,
  type: MemberAuditType,
  description: string,
  actor: string,
): MemberAuditEvent => ({ id, at, type, description, actor });

/** Historial de invitaciones enviadas (pendientes + cerradas). */
export const teamInvitations: MemberInvitation[] = [
  {
    id: "inv_001",
    email: "jfuentes@lasrocas.cl",
    roleId: "role_vendedor",
    roleName: "Vendedor",
    status: "PENDING",
    sentBy: "Daniel Sánchez",
    sentAt: "2026-07-28T18:00:00Z",
    expiresAt: "2026-08-04T18:00:00Z",
    locationScope: "ALL",
    locationIds: [],
  },
  {
    id: "inv_002",
    email: "benja.vega@lasrocas.cl",
    roleId: "role_cajero",
    roleName: "Cajero",
    status: "PENDING",
    sentBy: "Fernanda Soto",
    sentAt: "2026-08-01T14:00:00Z",
    expiresAt: "2026-08-08T14:00:00Z",
    locationScope: "SELECTED",
    locationIds: ["branch_001"],
  },
  {
    id: "inv_003",
    email: "nico.bravo@lasrocas.cl",
    roleId: "role_cajero",
    roleName: "Cajero",
    status: "PENDING",
    sentBy: "Valentina Torres",
    sentAt: "2026-07-15T17:00:00Z",
    expiresAt: "2026-07-22T17:00:00Z",
    locationScope: "ALL",
    locationIds: [],
  },
  {
    id: "inv_004",
    email: "lucia.moran@lasrocas.cl",
    roleId: "role_contador",
    roleName: "Contador",
    status: "ACCEPTED",
    sentBy: "Daniel Sánchez",
    sentAt: "2026-05-20T10:00:00Z",
    expiresAt: "2026-05-27T10:00:00Z",
    locationScope: "ALL",
    locationIds: [],
  },
  {
    id: "inv_005",
    email: "gabriel.perez@lasrocas.cl",
    roleId: "role_vendedor",
    roleName: "Vendedor",
    status: "DECLINED",
    sentBy: "Valentina Torres",
    sentAt: "2026-04-10T09:00:00Z",
    expiresAt: "2026-04-17T09:00:00Z",
    locationScope: "ALL",
    locationIds: [],
  },
  {
    id: "inv_006",
    email: "sara.molina@lasrocas.cl",
    roleId: "role_admin",
    roleName: "Administrador",
    status: "EXPIRED",
    sentBy: "Daniel Sánchez",
    sentAt: "2026-03-02T16:00:00Z",
    expiresAt: "2026-03-09T16:00:00Z",
    locationScope: "ALL",
    locationIds: [],
  },
  {
    id: "inv_007",
    email: "rodrigo.salas@lasrocas.cl",
    roleId: "role_vendedor",
    roleName: "Vendedor",
    status: "REVOKED",
    sentBy: "Fernanda Soto",
    sentAt: "2026-06-15T12:00:00Z",
    expiresAt: "2026-06-22T12:00:00Z",
    locationScope: "ALL",
    locationIds: [],
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "u1",
    name: "Daniel Sánchez",
    email: "dsanchez151r@gmail.com",
    phone: "+56 9 1234 5678",
    roleId: "role_owner",
    role: "Owner",
    status: "activo",
    lastSeen: "online",
    addedAt: "2023-06-01",
    addedBy: "Daniel Sánchez (creó la cuenta)",
    lastLoginAt: "2026-08-08T14:40:00Z",
    auditLog: [
      audit("a1-1", "2023-06-01T10:00:00Z", "perfil", "Creó la organización y quedó como Owner", "Daniel Sánchez"),
      audit("a1-2", "2024-03-15T16:20:00Z", "rol", "Actualizó su perfil de contacto", "Daniel Sánchez"),
      audit("a1-3", "2026-08-08T14:40:00Z", "ingreso", "Ingreso a la plataforma", "Daniel Sánchez"),
    ],
  },
  {
    id: "u2",
    name: "Valentina Torres",
    email: "vale@lasrocas.cl",
    phone: "+56 9 8877 1234",
    roleId: "role_admin",
    role: "Administrador",
    status: "activo",
    lastSeen: "online",
    addedAt: "2024-02-10",
    addedBy: "Daniel Sánchez",
    lastLoginAt: "2026-08-08T14:02:00Z",
    auditLog: [
      audit("a2-1", "2024-02-10T12:00:00Z", "invitacion", "Invitada por Daniel Sánchez", "Daniel Sánchez"),
      audit("a2-2", "2024-02-12T09:15:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Valentina Torres"),
      audit("a2-3", "2026-05-20T11:30:00Z", "rol", "Cambió de Vendedor a Administrador", "Daniel Sánchez"),
    ],
  },
  {
    id: "u3",
    name: "Matías Rojas",
    email: "mati@lasrocas.cl",
    phone: "+56 9 5544 8822",
    roleId: "role_vendedor",
    role: "Vendedor",
    status: "activo",
    lastSeen: "hace 5 min",
    addedAt: "2025-03-18",
    addedBy: "Valentina Torres",
    lastLoginAt: "2026-08-08T14:00:00Z",
    auditLog: [
      audit("a3-1", "2025-03-18T17:45:00Z", "invitacion", "Invitado por Valentina Torres", "Valentina Torres"),
      audit("a3-2", "2025-03-20T08:00:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Matías Rojas"),
    ],
  },
  {
    id: "u4",
    name: "Camila Díaz",
    email: "camila@lasrocas.cl",
    phone: "+56 9 6322 4411",
    roleId: "role_cajero",
    role: "Cajero",
    status: "activo",
    lastSeen: "hace 2 días",
    addedAt: "2025-08-02",
    addedBy: "Daniel Sánchez",
    lastLoginAt: "2026-08-06T20:10:00Z",
    auditLog: [
      audit("a4-1", "2025-08-02T15:00:00Z", "invitacion", "Invitada por Daniel Sánchez", "Daniel Sánchez"),
      audit("a4-2", "2025-08-04T09:00:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Camila Díaz"),
      audit("a4-3", "2026-03-01T10:00:00Z", "rol", "Cambió de Vendedor a Cajero", "Daniel Sánchez"),
    ],
  },
  {
    id: "u6",
    name: "Antonia Pérez",
    email: "antonella.p@lasrocas.cl",
    phone: "+56 9 8810 2233",
    roleId: "role_contador",
    role: "Contador",
    status: "activo",
    lastSeen: "hace 1 semana",
    addedAt: "2024-09-05",
    addedBy: "Daniel Sánchez",
    lastLoginAt: "2026-08-01T12:30:00Z",
    auditLog: [
      audit("a6-1", "2024-09-05T13:00:00Z", "invitacion", "Invitada por Daniel Sánchez", "Daniel Sánchez"),
      audit("a6-2", "2024-09-06T09:30:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Antonia Pérez"),
    ],
  },
  {
    id: "u7",
    name: "Cristóbal Herrera",
    email: "crisherrera@lasrocas.cl",
    phone: "+56 9 4445 6677",
    roleId: "role_vendedor",
    role: "Vendedor",
    status: "deshabilitado",
    lastSeen: "hace 3 semanas",
    addedAt: "2025-02-14",
    addedBy: "Valentina Torres",
    lastLoginAt: "2026-07-14T16:00:00Z",
    auditLog: [
      audit("a7-1", "2025-02-14T11:00:00Z", "invitacion", "Invitado por Valentina Torres", "Valentina Torres"),
      audit("a7-2", "2025-02-15T10:00:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Cristóbal Herrera"),
      audit("a7-3", "2026-07-17T09:00:00Z", "acceso", "Acceso deshabilitado por Daniel Sánchez", "Daniel Sánchez"),
    ],
  },
  {
    id: "u8",
    name: "Fernanda Soto",
    email: "fer.soto@lasrocas.cl",
    phone: "+56 9 9988 7766",
    roleId: "role_admin",
    role: "Administrador",
    status: "activo",
    lastSeen: "online",
    addedAt: "2025-11-20",
    addedBy: "Daniel Sánchez",
    lastLoginAt: "2026-08-08T13:55:00Z",
    auditLog: [
      audit("a8-1", "2025-11-20T10:30:00Z", "invitacion", "Invitada por Daniel Sánchez", "Daniel Sánchez"),
      audit("a8-2", "2025-11-21T08:00:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Fernanda Soto"),
    ],
  },
  {
    id: "u10",
    name: "Isidora Castro",
    email: "isidora.c@lasrocas.cl",
    phone: "+56 9 8899 0011",
    roleId: "role_vendedor",
    role: "Vendedor",
    status: "activo",
    lastSeen: "hace 3 días",
    addedAt: "2025-11-03",
    addedBy: "Valentina Torres",
    lastLoginAt: "2026-08-05T10:20:00Z",
    auditLog: [
      audit("a10-1", "2025-11-03T12:00:00Z", "invitacion", "Invitada por Valentina Torres", "Valentina Torres"),
      audit("a10-2", "2025-11-04T09:00:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Isidora Castro"),
    ],
  },
  {
    id: "u11",
    name: "Martín Salinas",
    email: "msalinas@lasrocas.cl",
    phone: "+56 9 7788 9900",
    roleId: "role_contador",
    role: "Contador",
    status: "deshabilitado",
    lastSeen: "hace 1 mes",
    addedAt: "2024-06-22",
    addedBy: "Daniel Sánchez",
    lastLoginAt: "2026-06-30T17:45:00Z",
    auditLog: [
      audit("a11-1", "2024-06-22T15:00:00Z", "invitacion", "Invitado por Daniel Sánchez", "Daniel Sánchez"),
      audit("a11-2", "2024-06-24T10:00:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Martín Salinas"),
      audit("a11-3", "2026-07-01T09:30:00Z", "acceso", "Acceso deshabilitado por Daniel Sánchez", "Daniel Sánchez"),
    ],
  },
  {
    id: "u12",
    name: "Catalina Núñez",
    email: "cata.nunez@lasrocas.cl",
    phone: "+56 9 4455 6677",
    roleId: "role_vendedor",
    role: "Vendedor",
    status: "activo",
    lastSeen: "hace 1 día",
    addedAt: "2026-02-10",
    addedBy: "Fernanda Soto",
    lastLoginAt: "2026-08-07T19:10:00Z",
    auditLog: [
      audit("a12-1", "2026-02-10T11:00:00Z", "invitacion", "Invitada por Fernanda Soto", "Fernanda Soto"),
      audit("a12-2", "2026-02-11T08:30:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Catalina Núñez"),
    ],
  },
  {
    id: "u14",
    name: "Josefina Ríos",
    email: "jose.rios@lasrocas.cl",
    phone: "+56 9 9988 5544",
    roleId: "role_admin",
    role: "Administrador",
    status: "activo",
    lastSeen: "hace 6 días",
    addedAt: "2024-09-30",
    addedBy: "Daniel Sánchez",
    lastLoginAt: "2026-08-02T09:00:00Z",
    auditLog: [
      audit("a14-1", "2024-09-30T10:00:00Z", "invitacion", "Invitada por Daniel Sánchez", "Daniel Sánchez"),
      audit("a14-2", "2024-10-01T09:00:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Josefina Ríos"),
      audit("a14-3", "2026-01-20T15:00:00Z", "rol", "Cambió de Contador a Administrador", "Daniel Sánchez"),
    ],
  },
];