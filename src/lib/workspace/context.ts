import {
  PERMISSION_LEVEL_ORDER,
  TEAM_ROLE_OWNER,
  TEAM_ROLE_TEMPLATES,
  type PermissionLevel,
  type PermissionModuleKey,
  type TeamRole,
} from "@/lib/mock/team";
import type {
  CapabilityKey,
  DashboardOrganization,
  Membership,
  OrganizationBranch,
} from "@/types/dashboard";

/**
 * Resolución del contexto de trabajo del workspace (/app/:slug).
 *
 * Regla de producto (09/09/2026): el rol define QUÉ acciones puede realizar el
 * miembro; la asignación de ubicaciones define DÓNDE. El contexto es estado de
 * UI derivado (mock) y nunca una fuente de autorización.
 */

/** href relativo del sidebar → módulo de permiso. */
export const MODULE_PERMISSION_KEY: Record<string, PermissionModuleKey> = {
  "/pos": "pos",
  "/pedidos": "pedidos",
  "/catalogo": "catalogo",
  "/inventario": "inventario",
  "/compras": "compras",
  "/promociones": "promociones",
  "/clientes": "clientes",
  "/agenda": "agenda",
  "/formularios": "formularios",
  "/caja": "caja",
  "/facturacion": "facturacion",
  "/reportes": "reportes",
  "/presencia": "presencia",
  "/canales": "canales",
  "/blog": "blog",
  "/marketing": "marketing",
  "/marketplace": "marketplace",
  "/equipo": "equipo",
  "/configuracion": "configuracion",
  "/auditoria": "auditoria",
};

/** Capacidad que habilita cada módulo (solo si la org declara capacidades). */
export const MODULE_REQUIRED_CAPABILITY: Partial<
  Record<PermissionModuleKey, CapabilityKey>
> = {
  pos: "ventas",
  pedidos: "ventas",
  caja: "finanzas",
  facturacion: "finanzas",
  reportes: "finanzas",
  catalogo: "catalogo",
  promociones: "catalogo",
  inventario: "inventario",
  compras: "inventario",
  clientes: "clientes",
  agenda: "clientes",
  formularios: "clientes",
  presencia: "presencia",
  blog: "presencia",
  marketing: "presencia",
  marketplace: "presencia",
};

/** El nivel del permiso es al menos `minimum`. */
export const permissionAtLeast = (
  level: PermissionLevel | undefined,
  minimum: PermissionLevel,
): boolean =>
  PERMISSION_LEVEL_ORDER.indexOf(level ?? "none") >=
  PERMISSION_LEVEL_ORDER.indexOf(minimum);

/** Rol por defecto según el `roleKey` de la membresía del hub (fallback). */
const fallbackRoleForRoleKey = (roleKey: string): TeamRole => {
  if (roleKey === "OWNER") return TEAM_ROLE_OWNER;
  const byKey = TEAM_ROLE_TEMPLATES.find((role) => {
    if (roleKey === "ADMIN") return role.key === "admin";
    return role.key === "vendedor";
  });
  return byKey ?? TEAM_ROLE_OWNER;
};

export interface ResolveEffectiveRoleInput {
  /** Id del rol del usuario dentro del equipo del tenant (team-store). */
  memberRoleId?: string;
  /** Roles vigentes en el tenant (team-store). */
  teamRoles: TeamRole[];
  /** Membresía del hub (roleKey OWNER/ADMIN/MEMBER). */
  roleKey: string;
}

/**
 * Resuelve el rol efectivo del miembro:
 * 1. Si el usuario es miembro del equipo del tenant y su rol existe → ese rol.
 * 2. Si no, cae a la plantilla de sistema por `roleKey` del hub.
 */
export const resolveEffectiveRole = ({
  memberRoleId,
  teamRoles,
  roleKey,
}: ResolveEffectiveRoleInput): TeamRole => {
  if (memberRoleId) {
    const memberRole = teamRoles.find((role) => role.id === memberRoleId);
    if (memberRole) return memberRole;
  }
  return fallbackRoleForRoleKey(roleKey);
};

/** Permisos efectivos del rol resuelto. */
export const effectivePermissions = (
  role: TeamRole,
): Record<PermissionModuleKey, PermissionLevel> => role.permissions;

export interface BuildWorkspaceContextInput {
  organization: DashboardOrganization | undefined;
  membership: Membership | undefined;
  memberRoleId: string | undefined;
  teamRoles: TeamRole[];
  branches: OrganizationBranch[];
  capabilities: CapabilityKey[];
  storedLocationId: string | null;
}

export interface WorkspaceContextView {
  organization: DashboardOrganization | null;
  role: TeamRole;
  permissions: Record<PermissionModuleKey, PermissionLevel>;
  capabilities: CapabilityKey[];
  /** Ubicaciones ACTIVE de la org que el rol puede operar. */
  allowedLocations: OrganizationBranch[];
  /** `true` si el rol puede usar "Vista general" (alcance global). */
  canUseGeneralView: boolean;
  /** Ubicación operativa vigente (puede ser `null` en vista general). */
  activeLocation: OrganizationBranch | null;
  /** `true` si el rol tiene al menos `view` en el módulo. */
  canViewModule: (href: string) => boolean;
  /** `true` si el módulo está habilitado por capacidades (si la org declara). */
  moduleEnabledByCapability: (href: string) => boolean;
}

export const buildWorkspaceContext = ({
  organization,
  membership,
  memberRoleId,
  teamRoles,
  branches,
  capabilities,
  storedLocationId,
}: BuildWorkspaceContextInput): WorkspaceContextView => {
  const role = resolveEffectiveRole({
    memberRoleId,
    teamRoles,
    roleKey: membership?.roleKey ?? "OWNER",
  });

  const orgBranches = organization
    ? branches.filter(
        (branch) =>
          branch.organizationId === organization.id && branch.status === "ACTIVE",
      )
    : [];

  // Alcance del rol sobre ubicaciones.
  const allowedLocations =
    role.locationScope === "SELECTED"
      ? orgBranches.filter((branch) => role.locationIds.includes(branch.id))
      : orgBranches;

  const canUseGeneralView = role.locationScope === "ALL";

  // Ubicación activa: se conserva la guardada si sigue permitida; si el rol no
  // puede usar "Vista general", se toma la primera permitida (o se autorresuelve
  // vía setActiveLocation cuando el consumidor lo requiera).
  const storedLocation = allowedLocations.find(
    (branch) => branch.id === storedLocationId,
  );
  const activeLocation =
    storedLocation ?? (canUseGeneralView ? null : allowedLocations[0] ?? null);

  const canViewModule = (href: string): boolean => {
    const moduleKey = MODULE_PERMISSION_KEY[href];
    if (!moduleKey) return true;
    return permissionAtLeast(role.permissions[moduleKey], "view");
  };

  const moduleEnabledByCapability = (href: string): boolean => {
    // Si la organización no declara capacidades, todo está habilitado.
    if (capabilities.length === 0) return true;
    const moduleKey = MODULE_PERMISSION_KEY[href];
    const required = moduleKey
      ? MODULE_REQUIRED_CAPABILITY[moduleKey]
      : undefined;
    return required ? capabilities.includes(required) : true;
  };

  return {
    organization: organization ?? null,
    role,
    permissions: effectivePermissions(role),
    capabilities,
    allowedLocations,
    canUseGeneralView,
    activeLocation,
    canViewModule,
    moduleEnabledByCapability,
  };
};

/** Compatibilidad con la selección automática de ubicación única. */
export const selectDefaultActiveLocation = (
  view: WorkspaceContextView,
  organizationId: string | undefined,
  setActiveLocation: (organizationId: string, locationId: string | null) => void,
): void => {
  if (
    !view.canUseGeneralView &&
    !view.activeLocation &&
    view.allowedLocations.length > 0 &&
    organizationId
  ) {
    setActiveLocation(organizationId, view.allowedLocations[0].id);
  }
};