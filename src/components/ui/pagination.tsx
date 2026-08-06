"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  /** Página actual (1-based). */
  page: number
  /** Total de páginas. */
  pageCount: number
  onPageChange: (page: number) => void
  /** Muestra el total de elementos y el rango visible. */
  totalItems?: number
  pageSize?: number
  className?: string
}

/** Rango de números de página visible (ej. 1 2 3 … 9 10). */
function getPageList(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)

  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1])
  const list: (number | "…")[] = []
  let prev = 0
  for (const p of [...pages].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b)) {
    if (p - prev > 1) list.push("…")
    list.push(p)
    prev = p
  }
  return list
}

/** Paginación reutilizable (shadcn-style). */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  totalItems,
  pageSize,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null

  const from = totalItems != null && pageSize ? (page - 1) * pageSize + 1 : null
  const to = totalItems != null && pageSize ? Math.min(page * pageSize, totalItems) : null

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 px-4 py-3", className)}>
      {totalItems != null && (
        <p className="text-xs text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{from}–{to}</span> de{" "}
          <span className="font-medium text-foreground">{totalItems}</span>
        </p>
      )}

      <nav className="flex items-center gap-1" aria-label="Paginación">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {getPageList(page, pageCount).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              type="button"
              variant={p === page ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRight className="size-4" />
        </Button>
      </nav>
    </div>
  )
}