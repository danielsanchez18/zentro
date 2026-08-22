import type { TeamMember } from "@/lib/mock/team";
import { StatusBadge } from "../../shared/StatusBadge";
import { LastSeenChip } from "../Table";
import { BadgeCheck } from "lucide-react";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

/** Cabecera del detalle: avatar, nombre, rol/estado y fecha de ingreso. */
export const MemberDetailHeader = ({ member }: { member: TeamMember }) => (
  <section className="mt-5 p-2 border border-border bg-card rounded-xl">

    <div className="relative">
      
      {/* Background image */}
      <div className="h-30 w-full rounded-lg bg-accent"></div>

      {/* Avatar */}
      <div className="relative bg-card rounded-full w-30 h-30 mx-auto -mt-20 border-2 border-border">

        <div className="absolute bottom-0 right-5 w-4 h-4 rounded-full bg-green-500"></div>

      </div>

    </div>

    <div className="flex flex-col items-center justify-center my-3">
      <div className="flex items-center gap-x-2">
        <h1 className="md:text-lg font-medium">{member.name}</h1>
        <BadgeCheck className="w-4 h-4" />
      </div>
      <p className="text-muted-foreground text-sm">{member.role}</p>
    </div>
    
  </section>
);