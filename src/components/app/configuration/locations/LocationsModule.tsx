"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { toastMsg } from "@/components/ui/toast-message";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { useWorkspaceContextView } from "@/hooks/use-workspace-context";
import { findLocationFunction } from "@/lib/mock/locations";
import { useLocationsStore } from "@/stores/locations-store";
import { ConfigurationHeader } from "../shared/ConfigurationHeader";
import { LocationCard } from "./LocationCard";

interface LocationsModuleProps {
  slug: string;
}

/**
 * Módulo de gestión de ubicaciones (/app/:slug/configuracion/ubicaciones).
 *
 * Administra las sedes físicas, almacenes y puntos de atención de la organización.
 */
export const LocationsModule = ({ slug }: LocationsModuleProps) => {
  const router = useRouter();
  const view = useWorkspaceContextView(slug);
  const locations = useLocationsStore((state) => state.locations);
  const removeLocation = useLocationsStore((state) => state.removeLocation);
  const togglePublished = useLocationsStore((state) => state.togglePublished);

  const [deletingLocation, setDeletingLocation] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const organizationId = view.organization?.id;
  const orgLocations = useMemo(
    () =>
      locations.filter(
        (location) => location.organizationId === organizationId,
      ),
    [locations, organizationId],
  );

  const functionLabels = (keys: string[]) =>
    keys
      .map((key) => findLocationFunction(key as never)?.label)
      .filter(Boolean) as string[];

  if (!organizationId) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <ConfigurationHeader
          title="Ubicaciones"
          description="No se encontró la organización activa."
          backHref={`/app/${slug}/configuracion`}
        />
      </div>
    );
  }

  const activeCount = orgLocations.filter(
    (location) => location.status === "ACTIVE",
  ).length;

  const handleConfirmDelete = () => {
    if (!deletingLocation) return;
    removeLocation(deletingLocation.id);
    toastMsg.success(
      "Ubicación eliminada",
      `"${deletingLocation.name}" se eliminó correctamente.`,
    );
    setDeletingLocation(null);
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <ConfigurationHeader
        title="Ubicaciones"
        description={`Gestiona dónde opera tu negocio. ${
          activeCount === 1
            ? "1 ubicación activa"
            : `${activeCount} ubicaciones activas`
        }.`}
        backHref={`/app/${slug}/configuracion`}
        backLabel="Regresar a configuración"
        action={
          <Button
            type="button"
            onClick={() =>
              router.push(`/app/${slug}/configuracion/ubicaciones/nueva`)
            }
            className="rounded-full cursor-pointer"
          >
            <span>Agregar ubicación</span>
          </Button>
        }
      />

      {orgLocations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-6 font-heading">
          <EmptyState
            icon={MapPin}
            title="Aún no hay ubicaciones"
            description="Crea tu primera sede física, almacén o punto de venta para empezar a operar."
            actionLabel="Agregar ubicación"
            onAction={() =>
              router.push(`/app/${slug}/configuracion/ubicaciones/nueva`)
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orgLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              functionLabels={functionLabels}
              onEdit={() =>
                router.push(
                  `/app/${slug}/configuracion/ubicaciones/${location.id}`,
                )
              }
              onRemove={() =>
                setDeletingLocation({ id: location.id, name: location.name })
              }
              onTogglePublished={() => {
                togglePublished(location.id);
                const willPublish = !location.publicProfile.published;
                toastMsg.success(
                  willPublish ? "Ubicación publicada" : "Ubicación oculta",
                  willPublish
                    ? `${location.name} aparece en la ficha pública del negocio.`
                    : `${location.name} ya no aparece en la ficha pública.`,
                );
              }}
            />
          ))}
        </div>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={deletingLocation !== null}
        onOpenChange={(open) => !open && setDeletingLocation(null)}
        title="Eliminar ubicación"
        description={
          deletingLocation
            ? `¿Estás seguro de eliminar la ubicación "${deletingLocation.name}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar ubicación"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
