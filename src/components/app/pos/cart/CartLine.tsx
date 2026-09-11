import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PosCartLine } from "../shared/types";

const money = (value: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    value,
  );
export function CartLine({
  line,
  onQuantity,
  onNote,
  onRemove,
}: {
  line: PosCartLine;
  onQuantity: (value: number) => void;
  onNote: (value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border-b py-3 last:border-0">
      <div className="flex justify-between gap-3">
        <div>
          <p className="text-sm font-heading font-medium">{line.name}</p>
          {line.variantLabel && (
            <p className="text-sm text-muted-foreground">{line.variantLabel}</p>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onRemove}>
          <Trash2 />
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onQuantity(line.quantity - 1)}
          >
            <Minus />
          </Button>
          <span className="w-8 text-center text-sm">{line.quantity}</span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={line.quantity >= line.stock}
            onClick={() => onQuantity(line.quantity + 1)}
          >
            <Plus />
          </Button>
        </div>
        <span className="text-sm font-medium">
          {money(line.unitPrice * line.quantity)}
        </span>
      </div>
      <Input
        className="mt-2 h-fit py-2"
        placeholder="Nota de preparación"
        value={line.note}
        onChange={(event) => onNote(event.target.value)}
      />
    </div>
  );
}
