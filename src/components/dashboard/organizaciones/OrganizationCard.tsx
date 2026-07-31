"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Copy,
  LogOut,
  MapPin,
  MoreHorizontal,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusChip } from "@/components/dashboard/overview/StatusChip";
import type { Organization } from "@/components/dashboard/organizaciones/types";

export const OrganizationCard = ({ org }: { org: Organization }) => {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Building2 className="size-5" />
        </div>

        <div className="flex items-center gap-2">
          <StatusChip status={org.status} />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Acciones de ${org.name}`}
                />
              }
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem render={<Link href={`/app/${org.slug}`} />}>
                <ArrowUpRight />
                Abrir workspace
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href={`/app/${org.slug}/configuracion`} />}
              >
                <Settings /> Configuración
              </DropdownMenuItem>
              <DropdownMenuItem
                render={
                  <Link href={`/app/${org.slug}/configuracion/miembros`} />
                }
              >
                <Users /> Miembros
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy /> Copiar link de invitación
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut /> Salir de la organización
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h3 className="mt-4 text-base font-medium">{org.name}</h3>
      <p className="text-sm text-muted-foreground">/{org.slug}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-5 border-t border-border">
        <div className="flex items-center gap-1.5">
          <dt className="font-medium text-foreground">Plan:</dt>
          <dd>{org.plan}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="font-medium text-foreground">Rol:</dt>
          <dd>{org.role}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          <dd>
            {org.members} miembro{org.members === 1 ? "" : "s"}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          <dd>
            {org.branches} sucursal{org.branches === 1 ? "" : "es"}
          </dd>
        </div>
      </dl>

      <a
        href={`/app/${org.slug}`}
        className="mt-auto inline-flex items-center gap-1 pt-4 text-sm w-fit font-medium hover:underline"
      >
        Abrir <ArrowUpRight className="size-3.5" />
      </a>
    </article>
  );
};
