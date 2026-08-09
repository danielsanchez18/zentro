/**
 * Datos mock del módulo Equipo y permisos.
 *
 * Fuente temporal mientras no exista `GET /team` en el backend. La estructura
 * replica lo que devolverá la API (TeamMember) para que luego el page solo
 * cambie el origen de datos.
 */
export type TeamRole = "Owner" | "Admin" | "Vendedor" | "Cajero" | "Contador";

export type MemberStatus = "activo" | "invitado" | "deshabilitado";

/** Ciclo de vida de una invitación enviada. */
export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "REVOKED";

/** Invitación a unirse a la organización (antes de ser miembro). */
export interface MemberInvitation {
  id: string;
  email: string;
  role: TeamRole;
  status: InvitationStatus;
  /** Quién la envió. */
  sentBy: string;
  /** ISO datetime de envío. */
  sentAt: string;
  /** ISO datetime de expiración (7 días por defecto). */
  expiresAt: string;
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
  role: TeamRole;
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

export const TEAM_ROLES: TeamRole[] = [
  "Owner",
  "Admin",
  "Vendedor",
  "Cajero",
  "Contador",
];

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
    role: "Vendedor",
    status: "PENDING",
    sentBy: "Daniel Sánchez",
    sentAt: "2026-07-28T18:00:00Z",
    expiresAt: "2026-08-04T18:00:00Z",
  },
  {
    id: "inv_002",
    email: "benja.vega@lasrocas.cl",
    role: "Cajero",
    status: "PENDING",
    sentBy: "Fernanda Soto",
    sentAt: "2026-08-01T14:00:00Z",
    expiresAt: "2026-08-08T14:00:00Z",
  },
  {
    id: "inv_003",
    email: "nico.bravo@lasrocas.cl",
    role: "Cajero",
    status: "PENDING",
    sentBy: "Valentina Torres",
    sentAt: "2026-07-15T17:00:00Z",
    expiresAt: "2026-07-22T17:00:00Z",
  },
  {
    id: "inv_004",
    email: "lucia.moran@lasrocas.cl",
    role: "Contador",
    status: "ACCEPTED",
    sentBy: "Daniel Sánchez",
    sentAt: "2026-05-20T10:00:00Z",
    expiresAt: "2026-05-27T10:00:00Z",
  },
  {
    id: "inv_005",
    email: "gabriel.perez@lasrocas.cl",
    role: "Vendedor",
    status: "DECLINED",
    sentBy: "Valentina Torres",
    sentAt: "2026-04-10T09:00:00Z",
    expiresAt: "2026-04-17T09:00:00Z",
  },
  {
    id: "inv_006",
    email: "sara.molina@lasrocas.cl",
    role: "Admin",
    status: "EXPIRED",
    sentBy: "Daniel Sánchez",
    sentAt: "2026-03-02T16:00:00Z",
    expiresAt: "2026-03-09T16:00:00Z",
  },
  {
    id: "inv_007",
    email: "rodrigo.salas@lasrocas.cl",
    role: "Vendedor",
    status: "REVOKED",
    sentBy: "Fernanda Soto",
    sentAt: "2026-06-15T12:00:00Z",
    expiresAt: "2026-06-22T12:00:00Z",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "u1",
    name: "Daniel Sánchez",
    email: "dsanchez151r@gmail.com",
    phone: "+56 9 1234 5678",
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
    role: "Admin",
    status: "activo",
    lastSeen: "online",
    addedAt: "2024-02-10",
    addedBy: "Daniel Sánchez",
    lastLoginAt: "2026-08-08T14:02:00Z",
    auditLog: [
      audit("a2-1", "2024-02-10T12:00:00Z", "invitacion", "Invitada por Daniel Sánchez", "Daniel Sánchez"),
      audit("a2-2", "2024-02-12T09:15:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Valentina Torres"),
      audit("a2-3", "2026-05-20T11:30:00Z", "rol", "Cambió de Vendedor a Admin", "Daniel Sánchez"),
    ],
  },
  {
    id: "u3",
    name: "Matías Rojas",
    email: "mati@lasrocas.cl",
    phone: "+56 9 5544 8822",
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
    role: "Admin",
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
    role: "Admin",
    status: "activo",
    lastSeen: "hace 6 días",
    addedAt: "2024-09-30",
    addedBy: "Daniel Sánchez",
    lastLoginAt: "2026-08-02T09:00:00Z",
    auditLog: [
      audit("a14-1", "2024-09-30T10:00:00Z", "invitacion", "Invitada por Daniel Sánchez", "Daniel Sánchez"),
      audit("a14-2", "2024-10-01T09:00:00Z", "ingreso", "Aceptó la invitación y entró por primera vez", "Josefina Ríos"),
      audit("a14-3", "2026-01-20T15:00:00Z", "rol", "Cambió de Contador a Admin", "Daniel Sánchez"),
    ],
  },
];