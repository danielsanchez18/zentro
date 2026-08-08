import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import type { ComponentProps } from "react";

interface SearchProps extends Omit<ComponentProps<"input">, "className"> {
  placeholder?: string;
  className?: string;
}

/**
 * Buscador reutilizable del workspace.
 * Es un input controlado: recibe `value`/`onChange` del padre (para filtrar
 * listas) y permite personalizar el placeholder.
 */
export const Search = ({
  placeholder = "Buscar",
  className,
  ...props
}: SearchProps) => {
  return (
    <div className={className}>
      <div className="relative">
        <SearchIcon className="size-4 absolute left-3.5 top-2.75 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-9 pr-4 py-2 font-heading h-fit text-sm rounded-lg border-border border bg-card"
          {...props}
        />
      </div>
    </div>
  );
};
