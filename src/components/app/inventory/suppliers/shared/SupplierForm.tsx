"use client";

import { useState, type FormEvent } from "react";
import type { SupplierStatus } from "@/lib/mock/inventory-suppliers";
import { SupplierCommercialInfo } from "./SupplierCommercialInfo";
import { SupplierContactInfo } from "./SupplierContactInfo";
import { SupplierGeneralInfo } from "./SupplierGeneralInfo";

export interface SupplierFormValues {
  businessName: string;
  tradeName: string;
  documentNumber: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  status: SupplierStatus;
  leadTimeDays: number;
  paymentTerms: string;
}

export type SupplierFormSetter = <K extends keyof SupplierFormValues>(key: K, value: SupplierFormValues[K]) => void;
export type SupplierFormErrors = Record<string, string>;

const EMPTY_VALUES: SupplierFormValues = {
  businessName: "", tradeName: "", documentNumber: "", contactName: "", phone: "", email: "", address: "", status: "activo", leadTimeDays: 1, paymentTerms: "Contado",
};

export function SupplierForm({ id, initial, existingDocuments = [], onSubmit }: { id: string; initial?: Partial<SupplierFormValues>; existingDocuments?: string[]; onSubmit: (values: SupplierFormValues) => void }) {
  const [values, setValues] = useState<SupplierFormValues>({ ...EMPTY_VALUES, ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const update = <K extends keyof SupplierFormValues>(key: K, value: SupplierFormValues[K]) => setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!values.businessName.trim()) nextErrors.businessName = "Ingresa la razón social.";
    if (!values.tradeName.trim()) nextErrors.tradeName = "Ingresa el nombre comercial.";
    if (!/^\d{11}$/.test(values.documentNumber)) nextErrors.documentNumber = "El RUC debe contener 11 dígitos.";
    else if (existingDocuments.includes(values.documentNumber)) nextErrors.documentNumber = "Ya existe un proveedor con este RUC.";
    if (!values.contactName.trim()) nextErrors.contactName = "Ingresa una persona de contacto.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Ingresa un correo válido.";
    if (values.leadTimeDays < 1) nextErrors.leadTimeDays = "El plazo mínimo es un día.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit({ ...values, businessName: values.businessName.trim(), tradeName: values.tradeName.trim(), documentNumber: values.documentNumber.trim(), contactName: values.contactName.trim(), email: values.email.trim() });
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="relative grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-5">
        <SupplierGeneralInfo values={values} errors={errors} onChange={update} />
        <SupplierContactInfo values={values} errors={errors} onChange={update} />
      </div>
      <div className="h-fit xl:sticky xl:top-5">
        <SupplierCommercialInfo values={values} errors={errors} onChange={update} />
      </div>
    </form>
  );
}
