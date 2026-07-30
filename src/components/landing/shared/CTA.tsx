import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
    return (
        <section className="flex items-center flex-col gap-3 my-10">
            <p className="text-center text-muted-foreground">Empieza ahora</p>

            <h3 className="text-2xl md:text-3xl font-semibold text-center">
                La aplicación web que <br /> impulsa a miles de empresas.
            </h3>

            <div className="flex items-center justify-center gap-x-2 mt-5">
                <Link href="/registrar">
                    <Button className="text-base h-fit px-4 py-1.5 rounded-full" >
                        Probar ahora
                    </Button>
                </Link>

                <Link href="/planes">
                    <Button variant='secondary' className="text-base h-fit px-4 py-1.5 rounded-full" >
                        Ver planes
                    </Button>
                </Link>
            </div>
                
        </section>
 
    )
}