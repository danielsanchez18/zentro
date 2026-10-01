"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { useLocationsStore } from "@/stores/locations-store";
import { LocationForm } from "./LocationForm";

interface EditLocationPageProps {
  slug: string;
  locationId: string;
}

/**
 * Página completa para editar una ubicación/sede existente.
 * Muestra el nombre de la ubicación en el encabezado y deshabilita el guardado hasta detectar cambios.
 */
export function EditLocationPage({ slug, locationId }: EditLocationPageProps) {
  const router = useRouter();
  const locations = useLocationsStore((state) => state.locations);
  const upsertLocation = useLocationsStore((state) => state.upsertLocation);
  const [isDirty, setIsDirty] = useState(false);

  const locationsHref = `/app/${slug}/configuracion/ubicaciones`;
  const formId = "edit-location-form";

  const location = locations.find((item) => item.id === locationId);

  if (!location) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(locationsHref)}
          className="h-auto p-0 cursor-pointer"
        >
          Regresar
        </Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos esta ubicación.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Button
            type="button"
            variant="link"
            onClick={() => router.push(locationsHref)}
            className="h-auto px-0 cursor-pointer"
          >
            Regresar
          </Button>
          <h1 className="text-lg font-medium">{location.name}</h1>
        </div>
      </header>

      <LocationForm
        id={formId}
        initial={location}
        mode="edit"
        organizationId={location.organizationId}
        onDirtyChange={setIsDirty}
        onSubmit={(data) => {
          upsertLocation(data);
          toastMsg.success(
            "Ubicación actualizada",
            `“${data.name}” se guardó correctamente.`,
          );
          router.push(locationsHref);
        }}
      />

      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast
          formId={formId}
          submitLabel="Guardar cambios"
          submitDisabled={!isDirty}
          onCancel={() => router.push(locationsHref)}
        />
      </div>
    </div>
  );
}
