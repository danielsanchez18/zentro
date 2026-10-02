"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/casos-de-uso", label: "Casos de uso" },
  { href: "/planes", label: "Planes" },
  { href: "/clientes", label: "Clientes" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full">
      <div className="max-w-300 mx-auto flex items-center gap-x-10 px-5 sm:px-7 py-4 xl:px-10">
        <Link href="/" className="flex items-center gap-x-3 group">
          <Image
            src="/branding/logos/logo/logo-light.svg"
            alt="Logo"
            width={96}
            height={96}
            className="h-6 block dark:hidden min-w-fit"
          />
          <Image
            src="/branding/logos/logo/logo-dark.svg"
            alt="Logo"
            width={96}
            height={96}
            className="h-6 hidden dark:block min-w-fit"
          />
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex gap-5 font-medium"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link key={link.href} href={link.href} className="relative group">
                {link.label}
                <div
                  className={`absolute bottom-0 w-full h-0.5 bg-primary transition-transform duration-300 ease-in-out origin-left ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-x-2 ml-auto">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <Link href="/ingresar">
            <Button
              variant="glass"
              size="lg"
              className="rounded-full px-3 font-medium text-base"
            >
              Ingresar
            </Button>
          </Link>

          <Link href="/registrar" className="hidden sm:block">
            <Button className="rounded-full h-fit px-3 font-medium py-1.5 text-base">
              <span className="hidden sm:inline-flex">Empezar gratis</span>
              <span className="sm:hidden">Empezar</span>
            </Button>
          </Link>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
