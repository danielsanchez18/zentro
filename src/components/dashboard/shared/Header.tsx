import { ThemeToggle } from "@/components/landing/shared/ThemeToggle"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MockBadge } from "@/components/ui/mock-badge"
import { LogOut } from "lucide-react"
import Link from "next/link"

export const Header = () => {
  return (
    <header className="w-full border-b border-border bg-background">
        <div className="w-full max-w-350 mx-auto px-5 py-2 md:px-7 xl:px-10 flex items-center gap-x-5">

            {/* Logo */}
            <Link href="/dashboard">
                <span className="font-semibold text-xl">Zentro</span>
            </Link>

            <div className="ml-auto flex items-center gap-x-2">
                
                <MockBadge />
                
                <ThemeToggle />

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notificaciones"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" fillRule="evenodd" d="M12 1.25A7.75 7.75 0 0 0 4.25 9v.704a3.53 3.53 0 0 1-.593 1.958L2.51 13.385c-1.334 2-.316 4.718 2.003 5.35q1.133.309 2.284.523l.002.005C7.567 21.315 9.622 22.75 12 22.75s4.433-1.435 5.202-3.487l.002-.005a29 29 0 0 0 2.284-.523c2.319-.632 3.337-3.35 2.003-5.35l-1.148-1.723a3.53 3.53 0 0 1-.593-1.958V9A7.75 7.75 0 0 0 12 1.25m3.376 18.287a28.5 28.5 0 0 1-6.753 0c.711 1.021 1.948 1.713 3.377 1.713s2.665-.692 3.376-1.713M5.75 9a6.25 6.25 0 1 1 12.5 0v.704c0 .993.294 1.964.845 2.79l1.148 1.723a2.02 2.02 0 0 1-1.15 3.071a26.96 26.96 0 0 1-14.187 0a2.02 2.02 0 0 1-1.15-3.07l1.15-1.724a5.03 5.03 0 0 0 .844-2.79z" clipRule="evenodd" />
                    </svg>
                
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="size-10 rounded-full overflow-hidden flex items-center justify-center p-0 cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            <svg className="size-5" 
                                xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="6" r="4" />
                                    <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
                                </g>
                            </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1">
                        <DropdownMenuItem render={<Link href="/dashboard/cuenta" />} className="cursor-pointer px-4 py-2">
                            <svg className="size-4" 
                                xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="6" r="4" />
                                    <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
                                </g>
                            </svg>
                            Mi perfil
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer px-4 py-2">
                            <LogOut />
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

        </div>
    </header>
  )
}
