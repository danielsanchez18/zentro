import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"

export const Filters = () => {
  return (
    <Button 
        variant="outline"
        className="py-2 h-fit rounded-lg px-3 text-muted-foreground hover:text-primary transition"
    >
        <SlidersHorizontal className="size-3.5" />
        Filtros (0)
    </Button>
  )
}
