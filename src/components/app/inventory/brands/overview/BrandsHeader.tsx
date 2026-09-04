import { Button } from "@/components/ui/button";

export function BrandsHeader({ onAdd }: { onAdd: () => void }) {
  return <header className="flex items-center justify-between gap-x-5"><div><h1 className="text-lg font-medium">Marcas</h1><p className="text-sm text-muted-foreground">Organiza las marcas relacionadas con los productos de la sucursal activa.</p></div><Button type="button" onClick={onAdd} className="shrink-0 rounded-full px-3 text-sm">Agregar <span className="max-sm:hidden">marca</span></Button></header>;
}
