"use client";

import { useState, type FormEvent } from "react";
import { PromotionBenefit } from "./PromotionBenefit";
import { PromotionConfiguration } from "./PromotionConfiguration";
import { PromotionGeneralInfo } from "./PromotionGeneralInfo";
import { PromotionScopeSection } from "./PromotionScope";
import type { PromotionFormValues } from "./types";

const emptyValues: PromotionFormValues = { name: "", description: "", type: "porcentaje", value: "", scope: "productos", targetIds: [], targetUnits: {}, startsAt: "", endsAt: "", priority: "10", unlimitedUsage: false, usageLimit: "" };

export function PromotionForm({ id, initial, onSubmit }: { id: string; initial?: Partial<PromotionFormValues>; onSubmit: (values: PromotionFormValues) => void }) {
  const [values, setValues] = useState<PromotionFormValues>({ ...emptyValues, ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (field: keyof PromotionFormValues, value: string | boolean | string[] | Record<string, number>) => setValues((current) => ({ ...current, [field]: value }));
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const next: Record<string, string> = {}; const amount = Number(values.value); if (!values.name.trim()) next.name = "Ingresa el nombre de la promoción."; if (!values.description.trim()) next.description = "Ingresa una descripción."; if (!amount || amount <= 0 || (values.type === "porcentaje" && amount > 100)) next.value = "Ingresa un valor válido para el beneficio."; if (values.targetIds.length === 0) next.targetIds = "Selecciona al menos una opción."; if (!values.startsAt) next.startsAt = "Selecciona la fecha de inicio."; if (!values.endsAt) next.endsAt = "Selecciona la fecha de finalización."; else if (values.startsAt && new Date(values.endsAt) <= new Date(values.startsAt)) next.endsAt = "Debe ser posterior a la fecha de inicio."; if (!Number(values.priority) || Number(values.priority) < 1) next.priority = "Ingresa una prioridad válida."; if (!values.unlimitedUsage && (!Number(values.usageLimit) || Number(values.usageLimit) < 1)) next.usageLimit = "Ingresa un límite mayor a cero."; setErrors(next); if (Object.keys(next).length === 0) onSubmit({ ...values, name: values.name.trim(), description: values.description.trim() }); };
  const toggleTarget = (id: string) => set("targetIds", values.targetIds.includes(id) ? values.targetIds.filter((item) => item !== id) : [...values.targetIds, id]);
  return <form id={id} onSubmit={handleSubmit} className="relative grid gap-5 xl:grid-cols-[1.5fr_1fr]"><div className="flex flex-col gap-5"><PromotionGeneralInfo values={values} errors={errors} onChange={(field, value) => set(field, value)} /><PromotionBenefit values={values} errors={errors} onChange={(field, value) => set(field, value)} /><PromotionScopeSection values={values} errors={errors} onChange={set} onToggleTarget={toggleTarget} /></div><aside className="h-fit xl:sticky xl:top-5"><PromotionConfiguration values={values} errors={errors} onChange={set} /></aside></form>;
}
