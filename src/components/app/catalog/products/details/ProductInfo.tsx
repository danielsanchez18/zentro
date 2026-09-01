import { StatusBadge } from "@/components/app/shared/StatusBadge"
import { Button } from "@/components/ui/button"
import { ChevronRight, ClipboardList, Globe, Laptop, Package2, ShoppingBag, Store, Tag, Wrench } from "lucide-react"
import Link from "next/link"

export const ProductInfo = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-5 border border-border p-5 rounded-xl bg-card">
    
      {/* Product Image */}
      <div className="bg-accent rounded-lg h-full min-h-100 w-full">
      </div>

      {/* Info */}
      <div className="space-y-5 lg:py-5 xl:p-5">
        
        {/* Nombre */}
        <h3 className="font-medium text-lg lg:text-xl">Nombre completo del producto</h3>
        
        {/* Descripcion */}
        <p className="text-sm text-muted-foreground">
          Descripción del producto:
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum autem possimus eum nemo dicta hic error suscipit, illo fuga repellendus reiciendis dolor sapiente sed molestias ex eos voluptate mollitia aperiam.
        </p>

        {/* Categoria y subcategoria */}
        <div className="mt-5 flex items-center gap-x-1 font-heading">
          <Tag className="size-4 text-muted-foreground" />
          
          <Link 
            href="/app/" 
            className="ml-2 text-sm font-medium hover:underline transition-colors">
            Categoría
          </Link>
          
          <ChevronRight className="size-4 text-muted-foreground" />
          <Link 
            href="/app/" 
            className="text-sm font-medium hover:underline transition-colors">
            SubCategoría
          </Link>
        </div>

        {/* Disponibilidad */}
        <div className="flex items-center gap-x-1">
          <ShoppingBag className="size-4 text-muted-foreground" />
          <p className="mx-2 text-sm text-muted-foreground font-heading">Disponible:</p>

          <div className="flex items-center gap-x-1 px-2.25 py-1.75 rounded-lg leading-none border border-border">
            <Laptop className="size-3.5" />
            <p className="text-[13px] font-heading">Website</p>
          </div>

          <div className="flex items-center gap-x-1 px-2.25 py-1.75 rounded-lg leading-none border border-border">
            <Globe className="size-3.5" />
            <p className="text-[13px] font-heading">Marketplace</p>
          </div>

          <div className="flex items-center gap-x-1 px-2.25 py-1.75 rounded-lg leading-none border border-border">
            <Store className="size-3.5" />
            <p className="text-[13px] font-heading">Tienda</p>
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-x-1">
          <Package2 className="size-4 text-muted-foreground" />
          <p className="mx-2 text-sm text-muted-foreground font-heading">Stock:</p>
          <p className="text-sm font-medium font-heading">120 unidades</p>
          <Button variant="link" className="p-0 h-fit ml-5 gap-x-1 text-sm font-heading">
            <Wrench className="size-3.5" />
            Ajustar
          </Button>
        </div>

        {/* Precio y Estado */}
        <div className="my-5 flex items-center gap-x-5">
          <p className="text-lg lg:text-xl font-medium">S/. 320.00</p>
          <StatusBadge status="activo" />
        </div>

        {/* Variantes */}
        <div className="pt-5 border-t border-border flex items-center gap-x-2 overflow-x-auto">
          
          <button className="w-60 border border-border rounded-lg bg-muted/50 hover:border-primary hover:bg-primary/7 text-start p-2 flex items-center gap-x-2.5 cursor-pointer transition">
            <div className="size-10 bg-background rounded-md" />
            <div className="font-heading space-y-1">
              <p className="font-medium text-sm text-nowrap">Variante - S/.300.00</p>
              <p className="text-muted-foreground text-xs line-clamp-1 text-nowrap">Descripción de la variante</p>
            </div>
          </button>

          <button className="w-60 border border-border rounded-lg bg-muted/50 hover:border-primary hover:bg-primary/7 text-start p-2 flex items-center gap-x-2.5 cursor-pointer transition">
            <div className="size-10 bg-background rounded-md" />
            <div className="font-heading space-y-1">
              <p className="font-medium text-sm text-nowrap">Variante - S/.300.00</p>
              <p className="text-muted-foreground text-xs line-clamp-1 text-nowrap">Descripción de la variante</p>
            </div>
          </button>
        </div>

        <div className="pt-5 border-t border-border">
          <Button variant="link" className="p-0 h-fit">
            <ClipboardList />
            Ver información de auditoría
          </Button>
        </div>

      </div>

    </div>
  )
}
