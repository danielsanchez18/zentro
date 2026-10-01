import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarClock,
  FileText,
  KeyRound,
  Lock,
  MailCheck,
  MapPin,
  Package,
  Pencil,
  Receipt,
  Settings2,
  ShoppingCart,
  TriangleAlert,
  Ban,
  UserPlus,
} from "lucide-react";
import type { PermissionModuleKey, SensitiveAction } from "@/lib/mock/team";

/**
 * Modelo de auditoría del workspace (decisión de producto, Fase 8 / Roadmap 26).
 *
 * Registro append-only de acciones relevantes del negocio: quién hizo qué,
 * cuándo y en qué módulo. Solo lectura. En el prototipo se alimenta de una
 * semilla mock y de `logEvent()` (store), pero el contrato está pensado para
 * que, al conectar la API, la fuente sea el servidor.
 */

/** Gravedad del evento. `sensitive` marca acciones que exigen permiso sensible. */
export type AuditSeverity = "routine" | "sensitive";

/**
 * Taxonomía de eventos. Los primeros cinco coinciden con `MemberAuditType`
 * del módulo Equipo (rol, acceso, invitacion, ingreso, perfil) para que la
 * actividad de miembros y la de negocio vivan en el mismo registro.
 */
export type AuditEventType =
  // gobierno / equipo (alineado con MemberAuditType)
  | "rol"
  | "acceso"
  | "invitacion"
  | "ingreso"
  | "perfil"
  // finanzas
  | "venta"
  | "factura"
  | "anulacion"
  | "devolucion"
  // operación / productos
  | "pedido"
  | "cita"
  | "ajuste_stock"
  // configuración
  | "ubicacion"
  | "configuracion";

export interface AuditEventTypeDef {
  key: AuditEventType;
  label: string;
  icon: LucideIcon;
  /** Módulo del workspace al que pertenece el evento por defecto. */
  module: PermissionModuleKey;
}

export interface AuditEvent {
  id: string;
  organizationId: string;
  /** ISO datetime de cuándo ocurrió. */
  at: string;
  /** Quién ejecutó la acción. */
  actor: string;
  /** Rol del actor en el momento (snapshot). */
  actorRole?: string;
  type: AuditEventType;
  /** Módulo del workspace donde ocurrió. */
  module: PermissionModuleKey;
  /** Descripción legible (p. ej. "Anuló la boleta B001-0015"). */
  description: string;
  /** Entidad afectada (p. ej. "Boleta B001-0015", "Rol Contador"). */
  target?: string;
  /** Ubicación operativa (id), si el evento es de una sede. */
  locationId?: string | null;
  severity: AuditSeverity;
  /** Acción sensible del catálogo, si aplica. */
  sensitiveAction?: SensitiveAction;
}

/** Catálogo de tipos con ícono y módulo por defecto. */
export const AUDIT_EVENT_TYPES: AuditEventTypeDef[] = [
  { key: "rol", label: "Rol", icon: KeyRound, module: "equipo" },
  { key: "acceso", label: "Acceso", icon: Lock, module: "equipo" },
  { key: "invitacion", label: "Invitación", icon: MailCheck, module: "equipo" },
  { key: "ingreso", label: "Ingreso", icon: ArrowRight, module: "equipo" },
  { key: "perfil", label: "Perfil", icon: Pencil, module: "equipo" },
  { key: "venta", label: "Venta", icon: ShoppingCart, module: "pos" },
  { key: "factura", label: "Comprobante", icon: Receipt, module: "facturacion" },
  { key: "anulacion", label: "Anulación", icon: Ban, module: "facturacion" },
  { key: "devolucion", label: "Devolución", icon: TriangleAlert, module: "pedidos" },
  { key: "pedido", label: "Pedido", icon: Package, module: "pedidos" },
  { key: "cita", label: "Cita", icon: CalendarClock, module: "agenda" },
  { key: "ajuste_stock", label: "Ajuste de stock", icon: Package, module: "inventario" },
  { key: "ubicacion", label: "Ubicación", icon: MapPin, module: "configuracion" },
  { key: "configuracion", label: "Configuración", icon: Settings2, module: "configuracion" },
];

export const findAuditEventType = (key: AuditEventType) =>
  AUDIT_EVENT_TYPES.find((t) => t.key === key)!;

export const auditTypeIcon = (key: AuditEventType): LucideIcon =>
  findAuditEventType(key)?.icon ?? ArrowRight;

/** Etiquetas de severidad para badges/filtros. */
export const AUDIT_SEVERITY_LABELS: Record<AuditSeverity, string> = {
  routine: "Rutina",
  sensitive: "Sensible",
};

/* ------------------------------------------------------------------ */
/* Semilla mock                                                        */
/* ------------------------------------------------------------------ */

const ev = (
  id: string,
  organizationId: string,
  at: string,
  actor: string,
  actorRole: string,
  type: AuditEventType,
  description: string,
  extra: Partial<AuditEvent> = {},
): AuditEvent => ({
  id,
  organizationId,
  at,
  actor,
  actorRole,
  type,
  module: findAuditEventType(type).module,
  description,
  severity: "routine",
  ...extra,
});

/**
 * Semilla: eventos de septiembre 2026 repartidos entre organizaciones,
 * actores, módulos y ubicaciones (para que los filtros tengan recorrido).
 */
export const seedAuditEvents: AuditEvent[] = [
  // --- Las Rocas (org_001, Monsefú = branch_001) ---
  ev("ae_001", "org_001", "2026-09-17T18:42:00Z", "Daniel Sánchez", "Owner", "venta",
    "Registró una venta por S/ 87.32 en el POS", { target: "Venta POS #1042", locationId: "branch_001" }),
  ev("ae_002", "org_001", "2026-09-17T18:43:00Z", "Daniel Sánchez", "Owner", "factura",
    "Emitió la boleta B001-0015 linked al pedido #1042", { target: "Boleta B001-0015", locationId: "branch_001" }),
  ev("ae_003", "org_001", "2026-09-17T15:32:00Z", "Valentina Torres", "Administrador", "configuracion",
    "Actualizó el horario de atención de la sede", { target: "Monsefú", locationId: "branch_001" }),
  ev("ae_004", "org_001", "2026-09-17T11:20:00Z", "Matías Rojas", "Vendedor", "pedido",
    "Marcó el pedido #1041 como listo para recojo", { target: "Pedido #1041", locationId: "branch_001" }),
  ev("ae_005", "org_001", "2026-09-16T20:05:00Z", "Antonia Pérez", "Contador", "ajuste_stock",
    "Ajustó el stock de Ají de gallina (merma)", {
      target: "Ají de gallina", severity: "sensitive", sensitiveAction: "ajustar_stock", locationId: "branch_001",
    }),
  ev("ae_006", "org_001", "2026-09-16T17:30:00Z", "Daniel Sánchez", "Owner", "rol",
    "Cambió el rol de Camila Díaz a Cajero", {
      target: "Camila Díaz", severity: "sensitive", sensitiveAction: "cambiar_roles",
    }),
  ev("ae_007", "org_001", "2026-09-16T09:14:00Z", "Valentina Torres", "Administrador", "invitacion",
    "Invitó a fernanda.soto@lasrocas.cl como Administrador", {
      target: "fernanda.soto@lasrocas.cl", severity: "sensitive", sensitiveAction: "invitar_miembros",
    }),
  ev("ae_008", "org_001", "2026-09-15T19:48:00Z", "Camila Díaz", "Cajero", "anulacion",
    "Anuló la boleta B001-0014 por error de digitación", {
      target: "Boleta B001-0014", severity: "sensitive", sensitiveAction: "anular_comprobante", locationId: "branch_001",
    }),
  ev("ae_009", "org_001", "2026-09-15T16:02:00Z", "Camila Díaz", "Cajero", "ingreso",
    "Ingreso a la plataforma", {}),
  ev("ae_010", "org_001", "2026-09-15T12:10:00Z", "Daniel Sánchez", "Owner", "ubicacion",
    "Creó la sede Monsefú", { target: "Monsefú", locationId: "branch_001" }),
  ev("ae_011", "org_001", "2026-09-14T18:20:00Z", "Matías Rojas", "Vendedor", "venta",
    "Registró una venta por S/ 42.00 en el POS", { target: "Venta POS #1038", locationId: "branch_001" }),
  ev("ae_012", "org_001", "2026-09-14T10:05:00Z", "Fernanda Soto", "Administrador", "acceso",
    "Habilitó el acceso de Cristóbal Herrera", { target: "Cristóbal Herrera" }),

  // --- Café del Valle (org_002, Miraflores = branch_002, Barranco = branch_003) ---
  ev("ae_013", "org_002", "2026-09-17T16:40:00Z", "Isidora Castro", "Vendedor", "venta",
    "Registró una venta por S/ 18.50 en el POS", { target: "Venta POS #221", locationId: "branch_002" }),
  ev("ae_014", "org_002", "2026-09-17T16:41:00Z", "Isidora Castro", "Vendedor", "factura",
    "Emitió la boleta B001-0088", { target: "Boleta B001-0088", locationId: "branch_002" }),
  ev("ae_015", "org_002", "2026-09-16T14:12:00Z", "Josefina Ríos", "Administrador", "devolucion",
    "Registró la devolución parcial del pedido #218", {
      target: "Pedido #218", severity: "sensitive", sensitiveAction: "reembolsar", locationId: "branch_003",
    }),
  ev("ae_016", "org_002", "2026-09-15T13:55:00Z", "Josefina Ríos", "Administrador", "configuracion",
    "Actualizó la capacidad activa de la organización (agregó Inventario)", { target: "Capacidades" }),
  ev("ae_017", "org_002", "2026-09-15T09:30:00Z", "Catalina Núñez", "Vendedor", "ingreso",
    "Ingreso a la plataforma", {}),
  ev("ae_018", "org_002", "2026-09-14T17:05:00Z", "Isidora Castro", "Vendedor", "cita",
    "Confirmó la cita de Juan Pérez", { target: "Cita #55", locationId: "branch_002" }),

  // --- Fonda La Abuela (org_003, Barranco = branch_004) ---
  ev("ae_019", "org_003", "2026-09-17T19:25:00Z", "Martín Salinas", "Contador", "factura",
    "Emitió la factura F001-0008", { target: "Factura F001-0008", locationId: "branch_004" }),
  ev("ae_020", "org_003", "2026-09-17T13:10:00Z", "Martín Salinas", "Contador", "ajuste_stock",
    "Ajustó el stock de Inca Kola 500ml (merma)", {
      target: "Inca Kola 500ml", severity: "sensitive", sensitiveAction: "ajustar_stock", locationId: "branch_004",
    }),
  ev("ae_021", "org_003", "2026-09-16T20:44:00Z", "Martín Salinas", "Contador", "acceso",
    "Deshabilitó el acceso de un miembro", { target: "Miembro" }),
  ev("ae_022", "org_003", "2026-09-16T12:00:00Z", "Martín Salinas", "Contador", "ingreso",
    "Ingreso a la plataforma", {}),
];