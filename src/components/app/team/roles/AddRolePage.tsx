"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { useTeamStore } from "@/stores/team-store";
import type { TeamRole } from "@/lib/mock/team";
import { RoleForm } from "./RoleForm";

interface AddRolePageProps {
  slug: string;
  duplicateId?: string;
}

/** Página completa para crear o duplicar un perfil de acceso (rol). */
export function AddRolePage({ slug, duplicateId }: AddRolePageProps) {
  const router = useRouter();
  const roles = useTeamStore((s) => s.roles);
  const createRole = useTeamStore((s) => s.createRole);

  const teamRolesHref = `/app/${slug}/equipo?tab=roles`;
  const formId = "add-role-form";

  const original = useMemo(() => {
    if (!duplicateId) return undefined;
    return roles.find((r) => r.id === duplicateId);
  }, [duplicateId, roles]);

  const initialValues: Partial<TeamRole> | undefined = useMemo(() => {
    if (!original) return undefined;
    return {
      ...original,
      name: `${original.name} (Copia)`,
      description: original.description,
      isSystem: false,
      assignable: true,
    };
  }, [original]);

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Button
            type="button"
            variant="link"
            onClick={() => router.push(teamRolesHref)}
            className="h-auto px-0 cursor-pointer"
          >
            Regresar
          </Button>
          <h1 className="text-lg font-medium">
            {original ? `Duplicar rol — ${original.name}` : "Nuevo rol"}
          </h1>
        </div>
      </header>

      <RoleForm
        id={formId}
        initial={initialValues}
        mode="create"
        onSubmit={(data) => {
          const created = createRole(data);
          toastMsg.success(
            "Rol creado",
            `“${created.name}” ya está disponible para asignar al equipo.`,
          );
          router.push(teamRolesHref);
        }}
      />

      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast
          formId={formId}
          submitLabel={original ? "Crear copia" : "Guardar rol"}
          onCancel={() => router.push(teamRolesHref)}
        />
      </div>
    </div>
  );
}
