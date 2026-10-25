import { OnboardingWizard } from "@/components/dashboard/onboarding/OnboardingWizard";
import { hubMetadata } from "@/app/dashboard/metadata";

export const metadata = hubMetadata(
  "Configurar organización",
  "Configura la actividad, capacidades y ubicaciones de tu organización.",
);

export default async function OrganizationOnboardingPage({ params }: { params: Promise<{ organizationId: string }> }) {
  const { organizationId } = await params;

  return (
    <div className="mx-auto w-full max-w-350 px-2">
      <OnboardingWizard organizationId={organizationId} />
    </div>
  );
}
