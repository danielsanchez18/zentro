"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, TableProperties } from "lucide-react";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { PosServicePoint } from "@/lib/mock/pos";
import { AddEditPointDialog } from "./AddEditPointDialog";
import { ServicePointCard } from "./ServicePointCard";

export function ServicePointDialog({
  open,
  slug,
  points,
  selectedId,
  onOpenChange,
  onPointsChange,
  onSelect,
}: {
  open: boolean;
  slug: string;
  points: PosServicePoint[];
  selectedId: string;
  onOpenChange: (open: boolean) => void;
  onPointsChange: (points: PosServicePoint[]) => void;
  onSelect: (id: string) => void;
}) {
  const router = useRouter();
  const [draftSelection, setDraftSelection] = useState(selectedId);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<PosServicePoint>();
  const [deletingPoint, setDeletingPoint] = useState<PosServicePoint>();

  const openEditor = (point?: PosServicePoint) => {
    setEditingPoint(point);
    setEditorOpen(true);
  };
  const savePoint = (point: PosServicePoint) =>
    onPointsChange(
      points.some((item) => item.id === point.id)
        ? points.map((item) => (item.id === point.id ? point : item))
        : [...points, point],
    );
  const groupPoints = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const source = points.find((point) => point.id === draggedId);
    const target = points.find((point) => point.id === targetId);
    if (
      !source ||
      !target ||
      source.kind !== "mesa" ||
      target.kind !== "mesa" ||
      source.status !== "disponible" ||
      target.status !== "disponible"
    )
      return;
    const id = `group_${source.id}_${target.id}`;
    onPointsChange([
      ...points.filter((point) => ![source.id, target.id].includes(point.id)),
      {
        id,
        name: `${source.name} + ${target.name}`,
        kind: "mesa",
        status: "disponible",
        capacity: source.capacity + target.capacity,
        groupId: id,
        memberIds: [source.id, target.id],
      },
    ]);
    setDraftSelection(id);
    setDraggedId(null);
  };
  const ungroup = (point: PosServicePoint) => {
    if (!point.memberIds?.length) return;
    const names = point.name.split(" + ");
    const restored = point.memberIds.map((id, index) => ({
      id,
      name: names[index] ?? `Mesa ${index + 1}`,
      kind: "mesa" as const,
      status: "disponible" as const,
      capacity: Math.max(
        1,
        Math.floor(point.capacity / point.memberIds!.length),
      ),
    }));
    onPointsChange([
      ...points.filter((item) => item.id !== point.id),
      ...restored,
    ]);
    if (draftSelection === point.id) setDraftSelection("");
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (next) setDraftSelection(selectedId);
          onOpenChange(next);
        }}
      >
        <DialogContent className="max-h-[90dvh] flex flex-col sm:max-w-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Puntos de atención</DialogTitle>
            <DialogDescription>
              Selecciona un punto disponible. Arrastra una mesa sobre otra para
              juntarlas temporalmente.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {points.length ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {points.map((point) => (
                  <ServicePointCard
                    key={point.id}
                    point={point}
                    selected={draftSelection === point.id}
                    onSelect={() => setDraftSelection(point.id)}
                    onEdit={() => openEditor(point)}
                    onToggle={() =>
                      onPointsChange(
                        points.map((item) =>
                          item.id === point.id
                            ? {
                                ...item,
                                status:
                                  item.status === "inactivo"
                                    ? "disponible"
                                    : "inactivo",
                              }
                            : item,
                        ),
                      )
                    }
                    onDelete={() => setDeletingPoint(point)}
                    onOrder={() =>
                      point.associatedOrderId &&
                      router.push(
                        `/app/${slug}/pedidos/${point.associatedOrderId}`,
                      )
                    }
                    onDragStart={() => setDraggedId(point.id)}
                    onDragEnd={() => setDraggedId(null)}
                    onDrop={() => groupPoints(point.id)}
                    onUngroup={() => ungroup(point)}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => openEditor()}
                  className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-4 py-6 transition-colors hover:border-primary/50 hover:bg-primary/5 group cursor-pointer"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary group-hover:bg-primary/10 transition">
                    <Plus className="size-4" />
                  </span>
                  <div className="text-center">
                    <p className="text-sm font-heading font-medium">
                      Agregar punto
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Agrega mesas, mostradores, boxes u otros espacios
                    </p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed">
                <EmptyState
                  icon={TableProperties}
                  title="Aún no hay puntos de atención"
                  description="Agrega mesas, mostradores, boxes u otros espacios de esta ubicación."
                  actionLabel="Agregar punto"
                  onAction={() => openEditor()}
                />
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              disabled={
                !draftSelection ||
                !points.some(
                  (point) =>
                    point.id === draftSelection &&
                    point.status === "disponible",
                )
              }
              onClick={() => {
                onSelect(draftSelection);
                onOpenChange(false);
              }}
              className="rounded-full cursor-pointer"
            >
              Usar punto seleccionado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {editorOpen ? (
        <AddEditPointDialog
          key={editingPoint?.id ?? "new"}
          open
          point={editingPoint}
          onOpenChange={setEditorOpen}
          onSave={savePoint}
        />
      ) : null}
      <ConfirmDialog
        open={Boolean(deletingPoint)}
        onOpenChange={(next) => !next && setDeletingPoint(undefined)}
        title="Eliminar punto de atención"
        description={`¿Deseas eliminar ${deletingPoint?.name ?? "este punto"}? Esta acción solo afecta el prototipo.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (!deletingPoint) return;
          onPointsChange(
            points.filter((point) => point.id !== deletingPoint.id),
          );
          if (draftSelection === deletingPoint.id) setDraftSelection("");
          setDeletingPoint(undefined);
        }}
      />
    </>
  );
}
