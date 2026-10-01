"use client";

import {
  Ban,
  Calendar,
  Clock3,
  Mail,
  Phone,
  Store,
  UserRound,
} from "lucide-react";
import type { TeamMember } from "@/lib/mock/team";
import { useTeamStore } from "@/stores/team-store";
import { roleLocationLabel } from "@/lib/mock/team";
import { roleIcon } from "../RoleChangeDialog";

const MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const formatDate = (iso: string) => {
  if (!iso) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [year, month, day] = iso.split("-").map(Number);
    return `${day} ${MONTHS_SHORT[month - 1]} ${year}`;
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Formatea la última conexión:
 * - minutos, horas o días si ocurrió hace 7 días o menos.
 * - solo el día (fecha sin hora) si han pasado más de 7 días.
 */
const formatLastLogin = (iso?: string | null, lastSeen?: string) => {
  if (lastSeen === "online") {
    return "En línea";
  }

  // Soporte para etiquetas relativas del mock dentro de la ventana de 7 días
  if (lastSeen && lastSeen !== "nunca") {
    if (
      lastSeen.includes("min") ||
      lastSeen.includes("hora") ||
      lastSeen.includes("día") ||
      lastSeen === "hace 1 semana"
    ) {
      return `Último acceso: ${lastSeen}`;
    }
  }

  if (!iso) return "Sin conexiones registradas";

  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Sin conexiones registradas";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs >= 0 && diffMs < 60 * 1000) {
    return "Último acceso: hace un momento";
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes > 0 && diffMinutes < 60) {
    return `Último acceso: hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
  }

  if (diffHours > 0 && diffHours < 24) {
    return `Último acceso: hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  }

  if (diffDays > 0 && diffDays <= 7) {
    return `Último acceso: hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
  }

  // Si han pasado más de 7 días, solo el día (sin la hora)
  return `Último acceso: ${formatDate(iso)}`;
};

/**
 * Columna lateral del detalle de miembro: Información general y Perfil de acceso.
 * Sigue la anatomía visual de CustomerInfo (Detalle de cliente).
 */
export function MemberInfo({ member }: { member: TeamMember }) {
  const role = useTeamStore((s) => s.findRoleById(member.roleId));
  const branches = useTeamStore((s) => s.branches);
  const RoleIcon = roleIcon(role?.icon ?? "Shield");
  const isOwner = role?.kind === "owner";
  const isAllLocations = role?.locationScope === "ALL";

  const assignedBranches =
    !isAllLocations && role?.locationIds
      ? branches.filter((b) => role.locationIds.includes(b.id))
      : [];

  return (
    <div className="flex flex-col gap-5">
      {/* Información general */}
      <section className="overflow-hidden font-heading rounded-xl border border-border bg-card">
        <h2 className="px-5 py-3 border-b border-border text-sm font-medium text-foreground">
          Información general
        </h2>

        <div className="p-5 flex flex-col gap-3.5 text-sm">
          {/* Nombre */}
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <UserRound className="size-4 shrink-0 text-muted-foreground/70" />
            <span className="text-foreground font-medium">{member.name}</span>
          </div>

          {/* Correo */}
          <div className="flex items-center gap-2.5">
            <Mail className="size-4 shrink-0 text-muted-foreground/70" />
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                className="truncate text-foreground hover:text-primary hover:underline transition-colors"
              >
                {member.email}
              </a>
            ) : (
              <span className="text-muted-foreground italic">Sin correo</span>
            )}
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-2.5">
            <Phone className="size-4 shrink-0 text-muted-foreground/70" />
            {member.phone ? (
              <a
                href={`tel:${member.phone.replace(/\s/g, "")}`}
                className="text-foreground hover:text-primary hover:underline transition-colors"
              >
                {member.phone}
              </a>
            ) : (
              <span className="text-muted-foreground italic">Sin teléfono</span>
            )}
          </div>

          {/* Última conexión */}
          <div className="flex gap-2.5 text-muted-foreground">
            <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
            <span className="text-foreground">
              {formatLastLogin(member.lastLoginAt, member.lastSeen)}
            </span>
          </div>

          {/* Fecha de incorporación */}
          <div className="flex gap-2.5 border-t border-border pt-3 text-sm text-muted-foreground">
            <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
            <span>
              Agregado el {formatDate(member.addedAt)}
              {member.addedBy && (
                <span className="text-muted-foreground/80">
                  {" "}
                  por {member.addedBy}
                </span>
              )}
            </span>
          </div>
        </div>
      </section>

      {/* Perfil de acceso */}
      <section className="overflow-hidden font-heading rounded-xl border border-border bg-card">
        <h2 className="px-5 py-3 border-b border-border text-sm font-medium text-foreground">
          Perfil de acceso
        </h2>

        <div className="p-5 flex flex-col gap-3.5 text-sm">
          {/* Rol */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <RoleIcon className="size-4 shrink-0 text-primary" />
              <span className="text-foreground font-medium truncate">
                {role?.name ?? member.role}
              </span>
            </div>
          </div>

          {/* Alcance de ubicaciones */}
          <div className="flex items-start gap-2.5 text-muted-foreground">
            <Store className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
            <div className="min-w-0 flex-1">
              <span className="text-foreground block">
                {roleLocationLabel(
                  role,
                  branches.map((b) => ({ id: b.id, name: b.name })),
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {isAllLocations
                  ? "Acceso a todas las sucursales y canales"
                  : `${assignedBranches.length} ${assignedBranches.length === 1 ? "sucursal autorizada" : "sucursales autorizadas"}`}
              </span>
            </div>
          </div>

          {/* Chips de sucursales autorizadas si es alcance personalizado */}
          {assignedBranches.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {assignedBranches.map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 leading-none text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Store className="size-3 text-primary" />
                  {b.name}
                </span>
              ))}
            </div>
          )}

          {/* Alertas contextuales de estado */}
          {member.status === "invitado" && (
            <div className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-400">
              <Clock3 className="size-4 shrink-0 mt-0.5" />
              <span>
                Invitación pendiente. El perfil será efectivo cuando el usuario
                active su cuenta.
              </span>
            </div>
          )}

          {member.status === "deshabilitado" && (
            <div className="flex items-start gap-2 text-sm text-rose-700 dark:text-rose-400">
              <Ban className="size-4 shrink-0 mt-0.5" />
              <span>
                Acceso deshabilitado. El miembro no puede ingresar a la
                plataforma.
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
