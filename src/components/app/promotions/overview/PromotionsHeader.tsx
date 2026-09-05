import { Button } from "@/components/ui/button";

export function PromotionsHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <header className="flex items-center justify-between gap-5">
      <div>
        <h1 className="text-lg font-medium">Promociones</h1>
        <p className="text-sm text-muted-foreground">
          Configura beneficios temporales sin modificar los precios del
          catálogo.
        </p>
      </div>
      <Button type="button" onClick={onCreate} className="rounded-full px-3">
        Nueva promoción
      </Button>
    </header>
  );
}
