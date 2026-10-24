import { OnboardingWizard } from "@/components/dashboard/onboarding/OnboardingWizard";

export default async function OrganizationOnboardingPage({ params }: { params: Promise<{ organizationId: string }> }) {
  const { organizationId } = await params;

  return (
    <div className="mx-auto w-full max-w-350 px-4 pt-2 pb-6 lg:px-6">
      <OnboardingWizard organizationId={organizationId} />
    </div>
  );
}
