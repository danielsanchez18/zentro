import Link from "next/link";
import { CalendarDays, Clock3, ImageIcon, Package } from "lucide-react";
import type { CatalogCategory, CatalogCategoryEntry, CatalogSubcategory } from "@/lib/mock/catalog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";

interface InfoProps {
  category: CatalogCategoryEntry;
  productCount: number;
  subcategories: CatalogSubcategory[];
  parentCategory?: CatalogCategory;
  slug: string;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));

export function Info({ category, productCount, subcategories, parentCategory, slug }: InfoProps) {
  return (
    <section className="overflow-hidden rounded-xl grid lg:grid-cols-[1fr_2.5fr] gap-5 border border-border bg-card p-5 px-4">
      
      <div className="relative flex h-48 min-w-70 w-full lg:h-auto rounded-lg items-center justify-center overflow-hidden bg-accent">
        {category.image ? (
          <img src={category.image} alt={category.name} className="size-full object-cover" />
        ) : (
          <>
            <div className="relative flex size-14 items-center justify-center rounded-xl bg-background">
              <ImageIcon className="size-5 text-muted-foreground" />
            </div>
          </>
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          
          <div className="min-w-0 w-full">
            <div className="flex items-center justify-between gap-x-5">
              <h2 className="text-lg font-medium">{category.name}</h2>
              <div>
                <StatusBadge status={category.status === "activo" ? "activo" : "inactivo"}  />
              </div>
            </div>
            <p className="font-heading mt-1 text-sm text-muted-foreground">{category.description}</p>
          </div>

        </div>

        {subcategories.length > 0 && (
          <div className="space-y-2">
            <div className="font-heading">
              <p className="text-sm font-medium">Subcategorías</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/app/${slug}/catalogo/categoria/${subcategory.id}`}
                  className="font-heading rounded-md leading-none bg-muted px-3 py-2 text-[13px] transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {parentCategory && (
          <div className="space-y-2">
            <p className="text-sm font-medium font-heading">Categoría principal</p>
            <Link
              href={`/app/${slug}/catalogo/categoria/${parentCategory.id}`}
              className="font-heading rounded-md leading-none bg-muted px-3 py-2 text-[13px] transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {parentCategory.name}
            </Link>
          </div>
        )}

        <dl className="grid gap-2 border-t border-border pt-5 text-sm font-heading">
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="size-4" />
            <dt>Productos asociados:</dt>
            <dd className="text-foreground">{productCount}</dd>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4" />
            <dt>Fecha de creación:</dt>
            <dd className="text-foreground">{formatDate(category.createdAt)}</dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="size-4" />
            <dt>Última actualización:</dt>
            <dd className="text-foreground">{formatDate(category.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
