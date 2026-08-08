import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginatorProps {
  totalResults: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Paginación reutilizable del workspace.
 * Muestra el total de resultados y un par de botones de página:
 * - normal: la página actual + la siguiente (p. ej. < 1 2 >);
 * - en la última página: la anterior + la actual (p. ej. < 2 3 >).
 * Las flechas se deshabilitan en los extremos.
 */
export const Paginator = ({
  totalResults,
  pageSize,
  currentPage,
  onPageChange,
}: PaginatorProps) => {
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  // Par de páginas visibles: la actual + la siguiente; si estamos en la última,
  // se muestra la anterior + la actual.
  const start =
    currentPage === totalPages ? Math.max(1, totalPages - 1) : currentPage;
  const pages = [start, start + 1].filter((page) => page <= totalPages);

  const go = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
      <p className="text-sm text-muted-foreground">
        <span className="text-primary font-medium">{totalResults}</span>{" "}
        {totalResults === 1 ? "resultado" : "resultados"}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => go(currentPage - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </Button>

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "secondary" : "ghost"}
            size="icon"
            className={cn(page !== currentPage && "font-normal")}
            onClick={() => go(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => go(currentPage + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};