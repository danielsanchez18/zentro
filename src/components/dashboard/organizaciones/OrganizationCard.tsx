"use client";

import Image from "next/image";
import Link from "next/link";
import { useEnterOrganization } from "@/components/dashboard/shared/HubOverlays";
import {
  ArrowUpRight,
  Copy,
  LogOut,
  MapPin,
  MoreHorizontal,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusChip } from "@/components/dashboard/overview/StatusChip";
import { CompanyIcon } from "@/components/dashboard/shared/icons";
import type { Organization } from "@/components/dashboard/organizaciones/types";
import { hubButton, hubChip } from "@/components/dashboard/shared/styles";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";

export const getOrganizationHref = (org: Organization) =>
  org.setupStatus === "DRAFT"
    ? `/dashboard/organizaciones/${org.id}/onboarding`
    : `/app/${org.slug}`;

/** Portada: foto si existe; si no, un patrón neutro para no dejar el bloque vacío. */
const Cover = ({ org }: { org: Organization }) => (
  <div className="relative h-24 overflow-hidden rounded-sm bg-muted">
    {org.coverUrl ? (
      <Image
        src={org.coverUrl}
        alt=""
        fill
        unoptimized
        className="object-cover"
      />
    ) : (
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:14px_14px] text-muted-foreground/25"
      />
    )}
  </div>
);

/** Logo: imagen si existe; si no, el ícono de empresa. */
const Logo = ({ org }: { org: Organization }) => (
  <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-card ring-4 ring-card">
    {org.logoUrl ? (
      <Image
        src={org.logoUrl}
        alt={`Logo de ${org.name}`}
        fill
        unoptimized
        className="object-cover"
      />
    ) : (
      <span className="flex size-full items-center justify-center rounded-sm bg-muted text-foreground">
        <CompanyIcon className="size-6" />
      </span>
    )}
  </div>
);

const Meta = ({ children }: { children: React.ReactNode }) => (
  <span className={cn(hubChip, "bg-muted text-muted-foreground")}>
    {children}
  </span>
);

interface OrganizationCardProps {
  org: Organization;
  /** Resalta la card (por ejemplo, la última organización abierta). */
  highlighted?: boolean;
}

export const OrganizationCard = ({
  org,
  highlighted,
}: OrganizationCardProps) => {
  const isDraft = org.setupStatus === "DRAFT";
  const href = getOrganizationHref(org);
  const enterOrganization = useEnterOrganization();
  // Las organizaciones listas entran con la animación; los borradores van al onboarding.
  const handleEnter = (event: React.MouseEvent) => {
    if (isDraft) return;
    event.preventDefault();
    enterOrganization({ id: org.id, slug: org.slug, name: org.name });
  };

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-sm bg-card border border-border p-2",
        highlighted && "ring-2 ring-foreground/80",
      )}
    >
      <div className="relative">
        <Link href={href} onClick={handleEnter} aria-label={`Abrir ${org.name}`} tabIndex={-1}>
          <Cover org={org} />
        </Link>

        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          {isDraft ? (
            <HubStatusChip tone="warning" label="Por configurar" />
          ) : (
            <StatusChip status={org.status} />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Acciones de ${org.name}`}
              className="flex size-8 cursor-pointer items-center justify-center rounded-sm bg-card border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem render={<Link href={href} />} onClick={handleEnter}>
                <ArrowUpRight />
                {isDraft ? "Continuar configuración" : "Abrir workspace"}
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Settings /> Configuración
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Users /> Miembros
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Copy /> Copiar link de invitación
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" disabled>
                <LogOut /> Salir de la organización
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="absolute -bottom-7 left-3">
          <Logo org={org} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pt-9 pb-2">
        <Link href={href} onClick={handleEnter} className="w-fit">
          <h3 className="font-heading text-base font-semibold leading-tight hover:underline">
            {org.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">/{org.slug}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Meta>{org.role}</Meta>
          <Meta>Plan {org.plan}</Meta>
          <Meta>
            <Users className="size-3.5" />
            {org.members}
          </Meta>
          <Meta>
            <MapPin className="size-3.5" />
            {org.branches}
          </Meta>
        </div>
      </div>

      <Link
        href={href}
        onClick={handleEnter}
        className={cn(
          "mt-2 w-full",
          isDraft ? hubButton.secondary : hubButton.primary,
        )}
      >
        {isDraft ? "Continuar configuración" : "Entrar"}
      </Link>
    </article>
  );
};
