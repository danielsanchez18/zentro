import { Button } from "@/components/ui/button"

export const Title = () => {
    return (
        <div className="flex justify-between items-center gap-x-5">
            <div>
                <h1 className="text-lg font-medium">Equipo y permisos</h1>
                <p className="text-xs font-heading text-muted-foreground">Gestiona quién accede a la organización y con qué rol.</p>
            </div>
            
            <Button className="text-sm rounded-full px-3 gap-x-1">
                Invitar <span className="max-sm:hidden">miembro</span>
            </Button>
        </div>
    )
}
