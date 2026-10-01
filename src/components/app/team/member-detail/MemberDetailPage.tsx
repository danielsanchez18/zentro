"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { Toast } from "@/components/app/shared/Toast";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { RoleChangeDialog } from "@/components/app/team/RoleChangeDialog";
import { useTeamStore } from "@/stores/team-store";
import { MemberDetailHeader, type MemberDetailTab } from "@/components/app/team/member-detail/MemberDetailHeader";
import { MemberInfo } from "@/components/app/team/member-detail/MemberInfo";
import { MemberAccessMatrix, MemberAccessSummary } from "@/components/app/team/member-detail/MemberAccessSummary";
import { MemberActivity } from "@/components/app/team/member-detail/MemberActivity";
import { MemberBackLink } from "@/components/app/team/member-detail/MemberBackLink";
import { MemberNotFound } from "@/components/app/team/member-detail/MemberNotFound";

interface MemberDetailPageProps {
  slug: string;
  memberId: string;
}

/**
 * Detalle de un integrante del equipo (estilo CRM).
 *
 * Estructura: cabecera con banner + tabs, grid [aside sticky | main] y una
 * barra flotante inferior de acciones. Protecciones de producto:
 * - El Owner no se puede deshabilitar ni eliminar (solo editar perfil).
 * - Un miembro no puede deshabilitarse/eliminarse a sí mismo (mock: el Owner
 *   de la sesión es u1).
 */
export function MemberDetailPage({ slug, memberId }: MemberDetailPageProps) {
  const router = useRouter();
  const members = useTeamStore((s) => s.members);
  const findRoleById = useTeamStore((s) => s.findRoleById);
  const assignRole = useTeamStore((s) => s.assignRole);
  const toggleMemberStatus = useTeamStore((s) => s.toggleMemberStatus);
  const removeMember = useTeamStore((s) => s.removeMember);

  const [activeTab, setActiveTab] = useState<MemberDetailTab>("resumen");
  const [selectedDomainAccess, setSelectedDomainAccess] = useState<string | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const member = members.find((m) => m.id === memberId);
  const root = `/app/${slug}/equipo`;

  if (!member) {
    return <MemberNotFound slug={slug} />;
  }

  const role = findRoleById(member.roleId);
  const isOwner = role?.kind === "owner";
  // Mock: el usuario de la sesión es Daniel Sánchez (u1).
  const isSelf = member.id === "u1";

  const handleRoleChange = (memberId: string, roleId: string) => {
    assignRole(memberId, roleId);
    setRoleOpen(false);
    toastMsg.success("Rol actualizado", `${member.name} ahora tiene un nuevo rol.`);
  };

  const handleToggle = () => {
    const disabling = member.status !== "deshabilitado";
    toggleMemberStatus(member.id);
    setToggleOpen(false);
    toastMsg.success(
      disabling ? "Acceso deshabilitado" : "Acceso habilitado",
      member.name,
    );
  };

  const handleDelete = () => {
    removeMember(member.id);
    setDeleteOpen(false);
    toastMsg.success(
      "Miembro eliminado",
      `${member.name} ya no forma parte de la organización.`,
    );
    router.push(root);
  };

  return (
    <div className="w-full space-y-6 px-5 py-7 md:px-7 xl:px-10">
      <MemberBackLink slug={slug} />

      <MemberDetailHeader
        member={member}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Grid: aside sticky + main */}
      <div className="grid items-start gap-6 xl:grid-cols-[21rem_1fr] lg:grid-cols-[19rem_1fr]">
        <aside className="xl:sticky xl:top-5">
          <MemberInfo member={member} />
        </aside>

        <main className="flex min-w-0 flex-col gap-6">
          {activeTab === "resumen" && (
            <>
              <MemberAccessSummary
                role={role}
                onOpenAccess={() => setActiveTab("acceso")}
                onOpenDomain={(domain) => {
                  setSelectedDomainAccess(domain);
                  setActiveTab("acceso");
                }}
              />
              <MemberActivity member={member} />
            </>
          )}

          {activeTab === "acceso" && (
            <MemberAccessMatrix
              role={role}
              initialDomain={selectedDomainAccess as any}
              onClearInitialDomain={() => setSelectedDomainAccess(null)}
            />
          )}

          {activeTab === "actividad" && (
            <MemberActivity member={member} />
          )}
        </main>
      </div>

      {/* Barra flotante inferior de acciones */}
      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <Toast ariaLabel="Acciones del miembro">
          <Button
            variant="link"
            disabled={isOwner}
            onClick={() => setRoleOpen(true)}
            className="cursor-pointer px-3 text-white"
          >
            Rol
          </Button>
          <Button
            variant="link"
            disabled={isOwner || isSelf}
            onClick={() => setToggleOpen(true)}
            className="cursor-pointer px-3 text-white"
          >
            {member.status === "deshabilitado" ? "Habilitar" : "Deshabilitar"}
          </Button>
          <Button
            variant="link"
            disabled={isOwner || isSelf}
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer px-3 text-rose-400"
          >
            Eliminar
          </Button>
        </Toast>
      </div>

      <RoleChangeDialog
        member={member}
        open={roleOpen}
        onOpenChange={setRoleOpen}
        onConfirm={handleRoleChange}
      />

      <ConfirmDialog
        open={toggleOpen}
        onOpenChange={setToggleOpen}
        title={member.status === "deshabilitado" ? "Habilitar acceso" : "Deshabilitar acceso"}
        description={
          member.status === "deshabilitado"
            ? `${member.name} podrá volver a acceder a la organización.`
            : `${member.name} no podrá acceder a la organización, pero seguirá siendo miembro del equipo.`
        }
        confirmLabel={member.status === "deshabilitado" ? "Habilitar" : "Deshabilitar"}
        onConfirm={handleToggle}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar de la empresa"
        description={`${member.name} será eliminado/a de la organización. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
}