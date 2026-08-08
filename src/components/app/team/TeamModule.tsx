"use client";

import { useState } from "react";
import { Title } from "./Title";
import { KPIS } from "./KPIS";
import { List } from "./List";
import type { TeamMember } from "@/lib/mock/team";

interface TeamModuleProps {
  slug: string;
  members: TeamMember[];
}

/**
 * Contenedor del módulo Equipo y permisos.
 *
 * Mantiene el estado de apertura del dialog de invitación, que comparten
 * `Title` (botón "Invitar miembro") y `List` (donde se renderiza el dialog).
 */
export const TeamModule = ({ slug, members }: TeamModuleProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7 space-y-10 lg:space-y-7">
      <Title onInvite={() => setInviteOpen(true)} />
      <KPIS members={members} />
      <List
        initialMembers={members}
        slug={slug}
        inviteOpen={inviteOpen}
        onInviteOpenChange={setInviteOpen}
      />
    </div>
  );
};