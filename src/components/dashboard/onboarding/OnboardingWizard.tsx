"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useEnterOrganization } from "@/components/dashboard/shared/HubOverlays";
import { EMPTY_MODULES, RUBROS_BY_CODE, STEPS, type IndustryCode, type LocalData, type ModuleKey, type StepId } from "./constants";
import { StepProgress } from "./StepProgress";
import { ActivityStep } from "./ActivityStep";
import { LocalStep } from "./LocalStep";
import { ModulesStep } from "./ModulesStep";
import { ReviewStep } from "./ReviewStep";
import { SetupCompleteDialog } from "./SetupCompleteDialog";

export const OnboardingWizard = ({ organizationId }: { organizationId: string }) => {
  const router = useRouter();
  const organization = useDashboardStore((state) => state.organizations.find((item) => item.id === organizationId));
  const setup = useDashboardStore((state) => state.organizationSetups.find((item) => item.organizationId === organizationId));
  const saveOrganizationSetup = useDashboardStore((state) => state.saveOrganizationSetup);
  const skipOrganizationSetup = useDashboardStore((state) => state.skipOrganizationSetup);
  const [step, setStep] = useState<StepId>("actividad");
  const [finishing, setFinishing] = useState(false);
  const enterOrganization = useEnterOrganization();
  const [industry, setIndustry] = useState<IndustryCode | null>(setup?.industry ?? null);
  const [selected, setSelected] = useState<Record<ModuleKey, boolean>>(() => ({
    ...EMPTY_MODULES,
    ...Object.fromEntries((setup?.capabilities ?? []).map((key) => [key, true])),
  }));
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locations, setLocations] = useState<LocalData[]>([]);

  const showLocationStep = Boolean(industry && (RUBROS_BY_CODE[industry].physicalSetupHelpful || selected.ventas || selected.inventario));
  const visibleSteps = useMemo(() => STEPS.filter((item) => item.id !== "local" || showLocationStep), [showLocationStep]);
  const activeStepIndex = visibleSteps.findIndex((item) => item.id === step);

  if (!organization || !setup) {
    return (
      <div className="rounded-sm bg-card p-8 text-center">
        <h1 className="text-lg font-medium">No encontramos esta organización</h1>
        <p className="mt-2 text-sm text-muted-foreground">Vuelve al listado y crea o selecciona una organización.</p>
        <Button className="mt-5" onClick={() => router.push("/dashboard/organizaciones")}>Ver organizaciones</Button>
      </div>
    );
  }

  const handleSelectIndustry = (code: IndustryCode) => {
    setIndustry(code);
    const suggestions = { ...EMPTY_MODULES };
    RUBROS_BY_CODE[code].suggested.forEach((key) => { suggestions[key] = true; });
    setSelected(suggestions);
  };

  const goNext = () => {
    if (step === "actividad") return setStep("modulos");
    if (step === "modulos") return setStep(showLocationStep ? "local" : "resumen");
    if (step === "local") return setStep("resumen");

    saveOrganizationSetup(organizationId, {
      industry: industry!,
      capabilities: (Object.keys(selected) as ModuleKey[]).filter((key) => selected[key]),
      branches: locationEnabled && showLocationStep
        ? locations.map((item) => ({ name: item.nombre, address: item.direccion, phone: item.telefono, openingHours: item.horario }))
        : [],
      complete: true,
    });
    setFinishing(true);
  };

  const goBack = () => {
    if (activeStepIndex > 0) setStep(visibleSteps[activeStepIndex - 1].id);
  };

  const skip = () => {
    skipOrganizationSetup(organizationId);
    toastMsg.info("Configuración guardada como pendiente", "Puedes retomarla desde Organizaciones.");
    router.push("/dashboard/organizaciones");
  };

  return (
    <div className="space-y-2">
      <header className="space-y-5 rounded-sm bg-card px-4 py-3">
        <div><p className="text-sm text-muted-foreground">{organization.name}</p><h1 className="font-sans text-lg font-medium">Configura cómo usarás Zentro</h1></div>
        <StepProgress step={step} steps={visibleSteps} />
      </header>

      <section className="rounded-sm bg-card px-4 py-4">
      {step === "actividad" && <ActivityStep rubro={industry} onSelect={handleSelectIndustry} />}
      {step === "modulos" && <ModulesStep rubro={industry} selected={selected} onToggle={(key) => setSelected((current) => ({ ...current, [key]: !current[key] }))} />}
      {step === "local" && <LocalStep locations={locations} onLocationsChange={setLocations} enabled={locationEnabled} onEnabledChange={setLocationEnabled} />}
      {step === "resumen" && industry && <ReviewStep organizationName={organization.name} industry={industry} selected={selected} showLocations={showLocationStep} locations={locationEnabled ? locations : []} onEdit={setStep} />}
      </section>

      {/* Barra de acciones: pegada al final del contenido, encima de la barra móvil */}
      <div className="sticky bottom-20 z-10 rounded-sm bg-card shadow-sm lg:bottom-2">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-3">
          {activeStepIndex > 0 ? <Button type="button" variant="outline" className="h-fit px-2.5 py-1.5 text-sm" onClick={goBack}><ArrowLeft className="size-4" />Atrás</Button> : <Button type="button" variant="outline" className="h-fit px-2.5 py-1.5 text-sm" onClick={skip}>Configurar después</Button>}
          <Button type="button" className="h-fit px-2.5 py-1.5 text-sm" onClick={goNext} disabled={(step === "actividad" && !industry) || (step === "local" && locationEnabled && locations.length === 0)}>
            {step === "resumen" ? <><Check className="size-4" />Finalizar</> : <>Continuar<ArrowRight className="size-4" /></>}
          </Button>
        </div>
      </div>

      <SetupCompleteDialog
        open={finishing}
        organizationName={organization.name}
        onGoToOrganizations={() => router.push("/dashboard/organizaciones")}
        onGoToWorkspace={() => {
          setFinishing(false);
          enterOrganization({ id: organization.id, slug: organization.slug, name: organization.name });
        }}
      />
    </div>
  );
};
