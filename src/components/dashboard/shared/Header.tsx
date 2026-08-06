"use client"

import { ThemeToggle } from "@/components/landing/shared/ThemeToggle"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, LogOut, User } from "lucide-react"
import { CreditCard } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { LogoutDialog } from "./LogoutDialog"

// TODO(0.2): leer pendientes desde GET /invitations
const MOCK_PENDING_INVITATIONS = 2;

export const Header = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b border-border bg-background">
        <div className="w-full max-w-350 mx-auto px-5 py-2 md:px-7 xl:px-10 flex items-center gap-x-5">

            {/* Logo */}
            <Link href="/dashboard">
                <span className="font-semibold text-xl">Zentro</span>
            </Link>

            <div className="ml-auto flex items-center gap-x-2">

                <ThemeToggle />

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notificaciones"
                >
                    <Bell />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="relative size-10 rounded-full flex items-center justify-center p-0 cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            <svg className="size-5"
                                xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="6" r="4" />
                                    <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
                                </g>
                            </svg>
                            {MOCK_PENDING_INVITATIONS > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 text-white flex size-4 items-center justify-center rounded-full bg-red-500 dark:bg-destructive text-[0.6rem] font-semibold text-destructive-foreground ring-2 ring-background">
                                    {MOCK_PENDING_INVITATIONS}
                                </span>
                            )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1">
                        <DropdownMenuItem render={<Link href="/dashboard/cuenta" />} className="cursor-pointer px-2 py-2">
                            <User className="size-4" />
                            Mi cuenta
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/dashboard/suscripciones" />} className="cursor-pointer px-2 py-2">
                            <CreditCard className="size-4" />
                            Suscripciones
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/dashboard/organizaciones" />} className="cursor-pointer px-2 py-2">
                            <svg className="size-4"
                                xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 21h18" />
                                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                                    <path d="M9 7h1M9 11h1M9 15h1" />
                                    <path d="M14 7h1M14 11h1M14 15h1" />
                                </g>
                            </svg>
                            Cambiar de tenant
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer px-2 py-2"
                            onClick={() => setConfirmOpen(true)}
                        >
                            <LogOut className="size-4" />
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

        </div>
    </header>

    <LogoutDialog open={confirmOpen} onOpenChange={setConfirmOpen} />
    </>
  )
}