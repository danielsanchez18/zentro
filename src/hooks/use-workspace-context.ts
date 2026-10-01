"use client";

import { useMemo } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useTeamStore, CURRENT_USER_NAME } from "@/stores/team-store";
import { useLocationsStore } from "@/stores/locations-store";
import { useWorkspaceContext } from "@/stores/workspace-context-store";
import { buildWorkspaceContext, type WorkspaceContextView } from "@/lib/workspace/context";

/**
 * Org a la que pertenece el equipo mock (team-store). El resto de las orgs del
 * hub resuelven su rol por plantilla de sistema según el `roleKey`.
 */
const TEAM_MOCK_ORGANIZATION_ID = "org_001";

/**
 * Contexto resuelto del workspace para el slug activo.
 *
 * Combina:
 * - dashboard-store: organización, membresía (roleKey), capacidades, ubicaciones.
 * - team-store: rol efectivo del miembro (permisos por módulo + alcance) cuando
 *   el usuario pertenece al equipo mock de esa org.
 * - workspace-context-store: ubicación operativa persistida.
 */
export const useWorkspaceContextView = (slug: string): WorkspaceContextView => {
  const organizations = useDashboardStore((state) => state.organizations);
  const memberships = useDashboardStore((state) => state.memberships);
  const currentUser = useDashboardStore((state) => state.currentUser);
  const organizationSetups = useDashboardStore((state) => state.organizationSetups);
  const locations = useLocationsStore((state) => state.locations);

  const teamMembers = useTeamStore((state) => state.members);
  const teamRoles = useTeamStore((state) => state.roles);

  const activeLocationByOrganization = useWorkspaceContext(
    (state) => state.activeLocationByOrganization,
  );

  return useMemo(() => {
    const organization = organizations.find((item) => item.slug === slug);
    const membership = memberships.find(
      (item) =>
        item.organizationId === organization?.id &&
        item.userId === currentUser.id &&
        item.status === "ACTIVE",
    );

    // Rol efectivo dentro del equipo mock (solo aplica a la org del mock).
    const teamMemberRoleId =
      membership?.organizationId === TEAM_MOCK_ORGANIZATION_ID
        ? teamMembers.find(
            (member) =>
              member.name === CURRENT_USER_NAME || member.id === "u1",
          )?.roleId
        : undefined;

    const setup = organization
      ? organizationSetups.find((item) => item.organizationId === organization.id)
      : undefined;

    return buildWorkspaceContext({
      organization,
      membership,
      memberRoleId: teamMemberRoleId,
      teamRoles,
      // Las ubicaciones del workspace viven en locations-store (fuente de
      // verdad editable desde Configuración → Ubicaciones). Al ser una
      // extensión de OrganizationBranch, el contexto las consume directo.
      branches: locations,
      capabilities: setup?.capabilities ?? [],
      storedLocationId: organization
        ? activeLocationByOrganization[organization.id] ?? null
        : null,
    });
  }, [
    slug,
    organizations,
    memberships,
    currentUser.id,
    locations,
    organizationSetups,
    teamMembers,
    teamRoles,
    activeLocationByOrganization,
  ]);
};