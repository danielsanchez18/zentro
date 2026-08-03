"use client";

import { useState } from "react";
import { Greeting } from "@/components/dashboard/overview/Greeting";
import { TenantEntry } from "@/components/dashboard/overview/TenantEntry";
import { OnboardingBanner } from "@/components/dashboard/overview/OnboardingBanner";
import { OrganizationsGrid } from "@/components/dashboard/overview/OrganizationsGrid";
import { InvitationsList } from "@/components/dashboard/overview/InvitationsList";
import { SubscriptionsSummary } from "@/components/dashboard/overview/SubscriptionsSummary";
import { DemoTour } from "@/components/dashboard/overview/DemoTour";
import { NewOrganizationDialog } from "@/components/dashboard/organizaciones/NewOrganizationDialog";
import { useOrgs } from "@/hooks/use-orgs";

/**
 * Overview del hub (/dashboard)
 *
 * Orden de secciones:
 *   1. Bienvenida
 *   2. Tu organización (entrada al tenant: directo con 1, selector con 2+)
 *   3. Primeros pasos (onboarding)
 *   4. Mis organizaciones
 *   5. Invitaciones
 *   6. Suscripciones
 *
 * Los datos de organizaciones se leen de `GET /orgs` (useOrgs) y se comparten
 * entre TenantEntry, OnboardingBanner y OrganizationsGrid.
 */
export const Overview = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { orgs, status, refetch } = useOrgs();

  return (
    <div className="space-y-10">
      <Greeting />
      <TenantEntry orgs={orgs} status={status} />
      <OnboardingBanner orgsCount={orgs.length} status={status} />
      <OrganizationsGrid orgs={orgs} status={status} onNew={() => setDialogOpen(true)} />
      <InvitationsList />
      <SubscriptionsSummary />
      <DemoTour />

      <NewOrganizationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={() => refetch()}
      />
    </div>
  );
};