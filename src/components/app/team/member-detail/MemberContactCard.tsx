import type { TeamMember } from "@/lib/mock/team";
import { Mail, Monitor, Phone, Shield, User, UserCheck } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "../../shared/StatusBadge";

/** Tarjeta de datos de contacto del miembro. */
export const MemberContactCard = ({ member }: { member: TeamMember }) => (
  <section className="w-full lg:w-80 xl:w-100 space-y-5 lg:py-3 max-lg:p-5 pr-5 lg:border-r max-lg:border max-lg:rounded-xl max-lg:bg-card border-border">
    
    <div className="space-y-5">
      <h2 className="text-sm font-medium text-primary">Información de Contacto</h2>

      <dl className="grid gap-3">
        <div className="flex items-center gap-x-2">
          <User className="size-4 text-muted-foreground" />
          <dt className="text-sm">{member.name}</dt>
        </div>

        <div className="flex items-center gap-x-2">
          <Mail className="size-4 text-muted-foreground" />
          <Link href={`mailto:${member.email}`} className="text-sm hover:underline underline-offset-2 transition-colors">{member.email}</Link>
        </div>

        <div className="flex items-center gap-x-2">
          <Phone className="size-4 text-muted-foreground" />
          <Link href={`tel:${member.phone}`} className="text-sm hover:underline underline-offset-2 transition-colors">{member.phone}</Link>
        </div>
      </dl>
    </div>

    <div className="pt-5 border-t border-border space-y-5">
      <h2 className="text-sm font-medium text-primary">Acesso y permisos</h2>
      
      <div className="grid gap-3">
        <div className="flex items-center gap-x-2">
          <Shield className="size-4 text-muted-foreground" />
          <dt className="text-sm flex items-center gap-x-1.5">{member.role}</dt>
        </div>

        <div className="flex items-center gap-x-2">
          <UserCheck className="size-4 text-muted-foreground" />
          <dt className="text-sm">Inivtado por: <Link href={`/app/${member.id}`} className="hover:underline underline-offset-2 transition-colors">{member.addedBy}</Link></dt>
        </div>

        <div className="flex items-center gap-x-2">
          <Monitor className="size-4 text-muted-foreground" />
          <dt className="text-sm flex items-center gap-x-1.5"><div className="w-1.75 h-1.75 rounded-full bg-green-500 " /> Online</dt>
        </div>
      </div>

      <StatusBadge status={member.status} />

    </div>
  </section>
);