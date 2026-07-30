import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TextAlignEnd } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

export function Navbar() {
  return (
    <header className="w-full">

      <div className="max-w-300 mx-auto flex items-center gap-x-10 px-5 sm:px-7 py-4 xl:px-10">

        <Link href="/" className="flex items-center gap-x-3">
          <span className="font-semibold leading-none uppercase">Zentro</span>
        </Link>

        <nav className="hidden md:flex gap-5 text-sm font-medium">
          <Link href="/" className="leading-none hover:underline">Inicio</Link>
          <Link href="/servicios" className="leading-none hover:underline">Servicios</Link>
          <Link href="/planes" className="leading-none hover:underline">Planes</Link>
          <Link href="/clientes" className="leading-none hover:underline">Clientes</Link>
        </nav>

        <div className="flex items-center gap-x-2 sm:gap-x-4 ml-auto">
          <ThemeToggle />

          <Link href="/ingresar">
            <Button variant="link" className="hidden sm:inline-flex p-0">Ingresar</Button>
          </Link>

          <Link href="/registrar">
            <Button className="rounded-full h-fit px-3 py-1.5 border">
              <span className="hidden sm:inline-flex">Empezar gratis</span>
              <span className="sm:hidden">Empezar</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden">
            <TextAlignEnd />
          </Button>
        </div>

      </div>

    </header>
  )
}
