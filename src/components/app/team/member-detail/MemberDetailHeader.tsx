"use client";

import {
  LayoutDashboard,
  LockKeyhole,
  Activity,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "../../shared/StatusBadge";
import { LastSeenChip } from "../Table";
import { roleIcon } from "../RoleChangeDialog";
import { type TeamMember } from "@/lib/mock/team";
import { useTeamStore } from "@/stores/team-store";

export type MemberDetailTab = "resumen" | "acceso" | "actividad";

const TABS: { id: MemberDetailTab; label: string; icon: LucideIcon }[] = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "acceso", label: "Acceso y permisos", icon: LockKeyhole },
  { id: "actividad", label: "Actividad", icon: Activity },
];

/** Iniciales del nombre (hasta 2) para el avatar sin foto. */
const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

interface MemberDetailHeaderProps {
  member: TeamMember;
  activeTab: MemberDetailTab;
  onTabChange: (tab: MemberDetailTab) => void;
}

/**
 * Cabecera del detalle de miembro (estilo Preline/CRM): banner con formas,
 * avatar sobrepuesto con iniciales, estado, rol y tabs de navegación.
 */
export function MemberDetailHeader({
  member,
  activeTab,
  onTabChange,
}: MemberDetailHeaderProps) {
  const role = useTeamStore((s) => s.findRoleById(member.roleId));
  const RoleIcon = roleIcon(role?.icon ?? "Shield");
  const isOwner = role?.kind === "owner";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      {/* Banner de portada */}
      <div className="relative h-32 w-full overflow-hidden bg-linear-to-r from-accent via-background to-accent sm:h-44">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 -top-10 size-60 rounded-full bg-accent/50 blur-2xl" />
          <div className="absolute right-12 -bottom-8 size-52 rounded-full bg-card/40 blur-xl" />
          <div className="absolute left-1/3 top-2 size-40 rounded-full bg-card/50 blur-xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px] opacity-15" />
        </div>
      </div>

      {/* Identidad y tabs */}
      <div className="px-5 pb-4">
        <div className="-mt-12 mb-4 flex flex-col items-center justify-between gap-4 sm:-mt-10 sm:flex-row sm:items-end">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative">
              <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted font-bold text-2xl text-primary shadow-md ring-1 ring-border/40 sm:size-28">
                <span>{initials(member.name)}</span>
              </div>
              <span
                className={cn(
                  "absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full border-2 border-card",
                  member.status === "activo"
                    ? "bg-green-500 text-white"
                    : member.status === "invitado"
                      ? "bg-yellow-500 text-white"
                      : "bg-neutral-400 text-white",
                )}
                title={
                  member.status === "activo"
                    ? "Acceso activo"
                    : member.status === "invitado"
                      ? "Pendiente de invitación"
                      : "Acceso deshabilitado"
                }
              >
                <span className="size-1.75 rounded-full bg-white" />
              </span>
            </div>

            <div className="pt-1 sm:pt-0 sm:pb-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-xl font-medium font-heading text-foreground sm:text-2xl">
                  {member.name}
                </h1>
                <StatusBadge status={member.status} />
              </div>

              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-muted-foreground sm:justify-start text-sm font-heading">
                <span className="inline-flex items-center gap-1 font-medium">
                  <RoleIcon className="size-3.5 text-muted-foreground" />
                  {role?.name ?? member.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 font-heading">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                "flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 leading-none text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
