"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { useWorkspaceContextView } from "@/hooks/use-workspace-context";
import { useLocationsStore } from "@/stores/locations-store";
import { LocationForm } from "./LocationForm";

interface AddLocationPageProps {
  slug: string;
}

/**
 * Página completa para crear una nueva ubicación/sede.
 */
export function AddLocationPage({ slug }: AddLocationPageProps) {
  const router = useRouter();
  const view = useWorkspaceContextView(slug);
  const upsertLocation = useLocationsStore((state) => state.upsertLocation);

  const locationsHref = `/app/${slug}/configuracion/ubicaciones`;
  const formId = "add-location-form";
  const organizationId = view.organization?.id ?? "";

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Button
            type="button"
            variant="link"
            onClick={() => router.push(locationsHref)}
            className="h-auto p-0 cursor-pointer"
          >
            Regresar
          </Button>
          <h1 className="text-lg font-medium">Nueva ubicación</h1>
        </div>
      </header>

      <LocationForm
        id={formId}
        mode="create"
        organizationId={organizationId}
        onSubmit={(data) => {
          upsertLocation(data);
          toastMsg.success(
            "Ubicación creada",
            `“${data.name}” se creó correctamente.`,
          );
          router.push(locationsHref);
        }}
      />

      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast
          formId={formId}
          submitLabel="Crear ubicación"
          onCancel={() => router.push(locationsHref)}
        />
      </div>
    </div>
  );
}
