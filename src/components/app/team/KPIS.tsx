import { Users, UserCheck, MailPlus, UserX } from "lucide-react";
import type { TeamMember } from "@/lib/mock/team";

interface KPISProps {
  members: TeamMember[];
  /** Invitaciones pendientes activas (viven en el tab de Invitaciones). */
  pendingInvitations?: number;
}

/**
 * KPIs del módulo Equipo y permisos, calculados desde los miembros (mock).
 */
export const KPIS = ({ members, pendingInvitations = 0 }: KPISProps) => {
  const stats = [
    {
      title: "Total de usuarios",
      value: members.length,
      icon: Users,
    },
    {
      title: "Usuarios activos",
      value: members.filter((m) => m.status === "activo").length,
      icon: UserCheck,
    },
    {
      title: "Invitaciones pendientes",
      value: pendingInvitations,
      icon: MailPlus,
    },
    {
      title: "Accesos deshabilitados",
      value: members.filter((m) => m.status === "deshabilitado").length,
      icon: UserX,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="border border-border bg-card rounded-xl px-5 py-4 font-heading"
        >
          <div className="space-y-2">
            <div className="flex justify-between text-primary/70 items-center">
              <p className="text-sm">{item.title}</p>
              <item.icon className="size-4.5" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-xl">
                {item.value}{" "}
                <span className="text-sm">
                  {item.value === 1 ? "usuario" : "usuarios"}
                </span>
              </p>
              <p className="text-xs text-primary/70">Desde el último registro</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
