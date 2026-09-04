import { Button } from "@/components/ui/button";

export function SupplierDetailHeader({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
  return (
    <header>
      <Button
        type="button"
        variant="link"
        onClick={onBack}
        className="h-fit cursor-pointer px-0"
      >
        Regresar
      </Button>
      <h1 className="text-lg font-medium">{name}</h1>
    </header>
  );
}
