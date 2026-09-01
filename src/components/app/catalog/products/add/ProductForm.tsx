"use client";

import { useState, type FormEvent } from "react";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductMedia } from "./ProductMedia";
import { ProductVariantsForm } from "./ProductVariantsForm";
import { ProductPricing } from "./ProductPricing";
import { ProductOrganization } from "./ProductOrganization";
import type { ProductFormValues } from "./types";

const initialValues: ProductFormValues = { name: "", sku: "", weight: "", description: "", price: "", compareAtPrice: "", available: true, scheduledAt: "", categoryId: "", subcategoryId: "", vendor: "", tags: "", images: [], variants: [] };

export function ProductForm({ id, onSubmit }: { id: string; onSubmit: (values: ProductFormValues) => void }) {
  const [values, setValues] = useState(initialValues);
  const set = <K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) => setValues((current) => ({ ...current, [field]: value }));
  const handleSubmit = (event: FormEvent) => { event.preventDefault(); onSubmit(values); };

  return (
    <form id={id} onSubmit={handleSubmit} className="grid xl:grid-cols-[1.5fr_1fr] gap-5 relative">
      
      <div className="flex flex-col gap-5">
        <ProductBasicInfo name={values.name} sku={values.sku} weight={values.weight} description={values.description} onChange={(field, value) => set(field, value)} />
        
        <ProductOrganization categoryId={values.categoryId} subcategoryId={values.subcategoryId} vendor={values.vendor} tags={values.tags} onChange={(field, value) => set(field, value)} />
        
        <ProductMedia images={values.images} onChange={(images) => set("images", images)} />
        
        <ProductVariantsForm variants={values.variants} onChange={(variants) => set("variants", variants)} />
      </div>
      
      <div className="flex flex-col gap-5 sticky top-5 h-fit">
        <ProductPricing price={values.price} compareAtPrice={values.compareAtPrice} available={values.available} scheduledAt={values.scheduledAt} onChange={(field, value) => set(field, value as never)} />
      </div>
    </form>
  );
}
