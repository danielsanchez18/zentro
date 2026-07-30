import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";

export function Download() {
  return (
    <section className="w-full py-20 ">

        <div className="space-y-3 text-center max-w-2xl mx-auto px-5">
            <p className="text-muted-foreground">Aplicación Escapify</p>
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground">Descarga la aplicación Escapify. <br /> Tu herramienta empresarial imprescindible.</h3>
        </div>

        <div className="mt-20 grid md:flex justify-center gap-10 mx-auto px-5">

            <div className="grid rounded-xl bg-card px-10 py-10 w-full sm:max-w-sm gap-y-5 justify-items-center text-center">
                <Image src="/logos/Logo_AppStore.png" alt="Logo iOS" className="size-16 object-contain" width={64} height={64} />
                <h4 className="text-xl font-semibold text-foreground">iOS App</h4>
                <p className="text-sm text-muted-foreground">La aplicación Preline es una forma más fácil de trabajar en iOS.</p>
                <a href="" className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark">Versiones previas</a>
                <a href="" className="text-sm flex items-center gap-x-3 group">
                    <p>Descargar en App Store</p>
                    <ChevronRight className="block group-hover:hidden size-4 duration-300" />
                    <ArrowRight className="hidden group-hover:block size-4 duration-300" />
                </a>
            </div>

            <div className="grid rounded-xl bg-card px-10 py-10 w-full sm:max-w-sm gap-y-5 justify-items-center text-center">
                <Image src="/logos/Logo_GooglePlay.png" alt="Logo Google Play" className="size-16 object-contain" width={64} height={64} />
                <h4 className="text-xl font-semibold text-foreground">Android App</h4>
                <p className="text-sm text-muted-foreground">La aplicación Preline es una forma más fácil de trabajar en Android.</p>
                <a href="" className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark">Versiones previas</a>
                <a href="" className="text-sm flex items-center gap-x-3 group">
                    <p>Descargar en Google Play</p>
                    <ChevronRight className="block group-hover:hidden size-4 duration-300" />
                    <ArrowRight className="hidden group-hover:block size-4 duration-300" />
                </a>
            </div>
        </div>
    </section>

  )
}