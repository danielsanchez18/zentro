"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Calculator,
  Check,
  Megaphone,
  PackageSearch,
  Shield,
  ShoppingBag,
  Store,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  PERMISSION_MODULES,
  SENSITIVE_ACTIONS,
  type PermissionLevel,
  type PermissionModuleKey,
  type SensitiveAction,
  type TeamRole,
} from "@/lib/mock/team";
import { useTeamStore } from "@/stores/team-store";
import { FormSection, Field, roleInputClass } from "./FormSection";
import { ModulePermissionsSection } from "./ModulePermissionsSection";

const AVAILABLE_ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "Shield", label: "Seguridad", icon: Shield },
  { name: "ShoppingBag", label: "Ventas", icon: ShoppingBag },
  { name: "Wallet", label: "Caja", icon: Wallet },
  { name: "Calculator", label: "Finanzas", icon: Calculator },
  { name: "PackageSearch", label: "Inventario", icon: PackageSearch },
  { name: "Megaphone", label: "Marketing", icon: Megaphone },
];

const EMPTY_PERMISSIONS = Object.fromEntries(
  PERMISSION_MODULES.map((m) => [m.key, "none" as PermissionLevel]),
) as Record<PermissionModuleKey, PermissionLevel>;

export interface RoleFormProps {
  id: string;
  initial?: Partial<TeamRole>;
  mode: "create" | "edit";
  onDirtyChange?: (isDirty: boolean) => void;
  onSubmit: (data: Omit<TeamRole, "id">) => void;
}

export function RoleForm({
  id,
  initial,
  mode,
  onDirtyChange,
  onSubmit,
}: RoleFormProps) {
  const branches = useTeamStore((s) => s.branches);

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "Shield");
  const [permissions, setPermissions] = useState<
    Record<PermissionModuleKey, PermissionLevel>
  >(initial?.permissions ?? EMPTY_PERMISSIONS);
  const [sensitive, setSensitive] = useState<SensitiveAction[]>(
    initial?.sensitiveActions ?? [],
  );
  const [allLocations, setAllLocations] = useState(
    initial?.locationScope === "ALL" || !initial,
  );
  const [locationIds, setLocationIds] = useState<string[]>(
    initial?.locationScope === "SELECTED" && initial.locationIds
      ? initial.locationIds
      : [],
  );

  const isDirty = useMemo(() => {
    if (mode === "create") {
      return name.trim().length > 0;
    }

    const initialName = initial?.name ?? "";
    if (name.trim() !== initialName.trim()) return true;

    const initialDescription = initial?.description ?? "";
    if (description.trim() !== initialDescription.trim()) return true;

    const initialIcon = initial?.icon ?? "Shield";
    if (icon !== initialIcon) return true;

    const initialPermissions = initial?.permissions ?? EMPTY_PERMISSIONS;
    const permissionsChanged = PERMISSION_MODULES.some(
      (m) =>
        (permissions[m.key] ?? "none") !==
        (initialPermissions[m.key] ?? "none"),
    );
    if (permissionsChanged) return true;

    const initialSensitive = initial?.sensitiveActions ?? [];
    if (
      sensitive.length !== initialSensitive.length ||
      sensitive.some((s) => !initialSensitive.includes(s))
    ) {
      return true;
    }

    const initialAllLocations = initial?.locationScope === "ALL" || !initial;
    if (allLocations !== initialAllLocations) return true;

    if (!allLocations) {
      const initialLocationIds = initial?.locationIds ?? [];
      if (
        locationIds.length !== initialLocationIds.length ||
        locationIds.some((id) => !initialLocationIds.includes(id))
      ) {
        return true;
      }
    }

    return false;
  }, [
    mode,
    name,
    description,
    icon,
    permissions,
    sensitive,
    allLocations,
    locationIds,
    initial,
  ]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const toggleSensitive = (key: SensitiveAction) =>
    setSensitive((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );

  const toggleLocation = (branchId: string) =>
    setLocationIds((prev) =>
      prev.includes(branchId)
        ? prev.filter((x) => x !== branchId)
        : [...prev, branchId],
    );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      key: initial?.key ?? name.trim().toLowerCase().replace(/\s+/g, "_"),
      name: name.trim(),
      description: description.trim(),
      kind: initial?.kind ?? "member",
      icon,
      isSystem: initial?.isSystem ?? false,
      permissions,
      sensitiveActions: sensitive,
      locationScope: allLocations ? "ALL" : "SELECTED",
      locationIds: allLocations ? [] : locationIds,
      assignable: true,
    });
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="grid xl:grid-cols-[1.5fr_1fr] gap-5 relative font-heading"
    >
      {/* Columna Izquierda: Información básica y Matriz de permisos */}
      <div className="flex flex-col gap-5">
        {/* Información del rol */}
        <FormSection title="Información del rol">
          <div className="grid gap-5">
            <Field label="Nombre del rol">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Encargado de tienda"
                maxLength={40}
                className={roleInputClass}
              />
            </Field>

            <Field label="Ícono del rol">
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_ICONS.map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = icon === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setIcon(item.name)}
                      title={item.label}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <ItemIcon className="size-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Descripción del rol">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe qué funciones y tareas opera este perfil dentro de la empresa..."
                rows={3}
                maxLength={140}
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </Field>
          </div>
        </FormSection>

        {/* Matriz de permisos por módulo (separada en su propio componente) */}
        <ModulePermissionsSection
          permissions={permissions}
          onChange={(key, level) =>
            setPermissions((prev) => ({
              ...prev,
              [key]: level,
            }))
          }
        />
      </div>

      {/* Columna Derecha: Alcance de ubicaciones y Acciones sensibles (Sticky) */}
      <div className="flex flex-col gap-5 sticky top-5 h-fit">
        {/* Alcance de ubicaciones */}
        <FormSection title="Alcance de ubicaciones">
          <div className="grid gap-3">
            <label
              className={cn(
                "flex items-center justify-between gap-3 cursor-pointer transition-colors",
                allLocations ? "border-primary" : "border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted flex size-9 items-center justify-center rounded-lg text-muted-foreground">
                  <Store className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Todas las ubicaciones</p>
                  <p className="text-xs text-muted-foreground">
                    Acceso total a sucursales y puntos de venta
                  </p>
                </div>
              </div>
              <Switch
                checked={allLocations}
                onCheckedChange={(v) => {
                  setAllLocations(v);
                  if (v) setLocationIds([]);
                }}
              />
            </label>

            {!allLocations && (
              <div className="space-y-3 pt-3">
                <p className="text-sm">
                  Selecciona las ubicaciones autorizadas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {branches.map((b) => {
                    const on = locationIds.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => toggleLocation(b.id)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg border px-2.5 py-2 leading-none! text-sm font-medium transition-all cursor-pointer",
                          on
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-foreground",
                        )}
                      >
                        {on && <Check className="size-3.5 stroke-3" />}
                        <span>{b.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </FormSection>

        {/* Acciones sensibles */}
        <FormSection title="Acciones sensibles" classNameCustom="py-2">
          <div className="divide-y divide-border">
            {SENSITIVE_ACTIONS.map((action) => {
              const on = sensitive.includes(action.key);
              return (
                <label
                  key={action.key}
                  className="flex items-start justify-between gap-3 py-3 cursor-pointer transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-sm font-sans text-muted-foreground mt-0.5">
                      {action.description}
                    </p>
                  </div>
                  <Switch
                    checked={on}
                    onCheckedChange={() => toggleSensitive(action.key)}
                  />
                </label>
              );
            })}
          </div>
        </FormSection>
      </div>
    </form>
  );
}
