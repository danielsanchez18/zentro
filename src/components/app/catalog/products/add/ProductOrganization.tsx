import { catalogCategories, catalogSubcategories } from "@/lib/mock/catalog";
import { Field, FormSection, productInputClass } from "./FormSection";

interface ProductOrganizationProps { categoryId: string; subcategoryId: string; vendor: string; tags: string; onChange: (field: "categoryId" | "subcategoryId" | "vendor" | "tags", value: string) => void; }

export function ProductOrganization(props: ProductOrganizationProps) {
  const subcategories = catalogSubcategories.filter((item) => item.parentId === props.categoryId);
  return (
    <FormSection title="Organización" 
      description="Clasifica el producto para que sea fácil encontrarlo y administrarlo.">
      
      <div className="grid gap-5">
        
        <Field label="Categoría"><select required value={props.categoryId} onChange={(e) => { props.onChange("categoryId", e.target.value); props.onChange("subcategoryId", ""); }} className={productInputClass}><option value="">Selecciona una categoría</option>{catalogCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
        
        <Field label="Subcategoría"><select value={props.subcategoryId} disabled={!props.categoryId || subcategories.length === 0} onChange={(e) => props.onChange("subcategoryId", e.target.value)} className={productInputClass}><option value="">Sin subcategoría</option>{subcategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
        
        <Field label="Marca o proveedor"><input value={props.vendor} onChange={(e) => props.onChange("vendor", e.target.value)} placeholder="Ej. La casa" className={productInputClass} /></Field>
        
        <Field label="Etiquetas" hint="Sepáralas con comas."><input value={props.tags} onChange={(e) => props.onChange("tags", e.target.value)} placeholder="popular, almuerzo, nuevo" className={productInputClass} /></Field>

      </div>
    </FormSection>
  );
}
