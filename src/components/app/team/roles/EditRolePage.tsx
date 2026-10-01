"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { useTeamStore } from "@/stores/team-store";
import { RoleForm } from "./RoleForm";

interface EditRolePageProps {
  slug: string;
  roleId: string;
}

/** Página completa para editar un perfil de acceso (rol). */
export function EditRolePage({ slug, roleId }: EditRolePageProps) {
  const router = useRouter();
  const roles = useTeamStore((s) => s.roles);
  const updateRole = useTeamStore((s) => s.updateRole);
  const [isDirty, setIsDirty] = useState(false);

  const teamRolesHref = `/app/${slug}/equipo?tab=roles`;
  const formId = "edit-role-form";

  const role = roles.find((r) => r.id === roleId);

  if (!role) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(teamRolesHref)}
          className="h-auto px-0 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          Regresar
        </Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos este perfil de acceso.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Button
            type="button"
            variant="link"
            onClick={() => router.push(teamRolesHref)}
            className="h-auto px-0 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            Regresar
          </Button>
          <h1 className="text-lg font-medium tracking-tight">
            {role.name}
          </h1>
        </div>
      </header>

      <RoleForm
        id={formId}
        initial={role}
        mode="edit"
        onDirtyChange={setIsDirty}
        onSubmit={(changes) => {
          updateRole(role.id, changes);
          toastMsg.success(
            "Rol actualizado",
            `“${changes.name}” se guardó correctamente.`,
          );
          router.push(teamRolesHref);
        }}
      />

      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast
          formId={formId}
          submitLabel="Guardar cambios"
          submitDisabled={!isDirty}
          onCancel={() => router.push(teamRolesHref)}
        />
      </div>
    </div>
  );
}
