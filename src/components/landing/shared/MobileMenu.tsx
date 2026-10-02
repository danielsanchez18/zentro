"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, TextAlignEnd, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { oswald } from "@/app/(landing)/fonts";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/casos-de-uso", label: "Casos de uso" },
  { href: "/planes", label: "Planes" },
  { href: "/clientes", label: "Clientes" },
  { href: "/faq", label: "FAQ" },
];

const supportLinks = [
  { href: "/ayuda", label: "Centro de ayuda" },
  { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
  { href: "/politica-de-privacidad", label: "Política de privacidad" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setOpen(false);
      }
    };

    // Cerrar si la pantalla ya es lg o superior
    if (mediaQuery.matches) {
      setOpen(false);
    }

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="glass"
            size="icon-lg"
            className="lg:hidden rounded-full"
            aria-label="Abrir menú de navegación"
          >
            <TextAlignEnd aria-hidden="true" />
          </Button>
        }
      />
      <SheetContent
        side="right"
        showCloseButton={false}
        className={`${oswald.variable} landing-scope w-full! sm:w-87.5 px-5 py-5`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <SheetHeader className="p-0 flex flex-row items-center justify-between">
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-x-3 w-fit"
            >
              <Image
                src="/branding/logos/logo/logo-dark.svg"
                alt="Logo"
                width={96}
                height={96}
                className="hidden dark:block"
              />
              <Image
                src="/branding/logos/logo/logo-light.svg"
                alt="Logo"
                width={96}
                height={96}
                className="dark:hidden"
              />
            </Link>

            <SheetClose
              render={
                <Button
                  variant="glass"
                  size="icon-lg"
                  className="rounded-full"
                  aria-label="Cerrar menú"
                >
                  <X />
                </Button>
              }
            />
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {/* GRUPO 1 - Navegación principal */}
            <nav className="flex flex-col gap-0.5 mt-5 font-medium dark:font-normal">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-lg uppercase font-oswald py-1 relative flex items-center gap-3 hover:bg-muted transition-colors group ${
                      isActive ? "bg-muted/50" : ""
                    }`}
                  >
                    <div
                      className={`px-0.5 p-5 transition-colors ${
                        isActive
                          ? "bg-primary"
                          : "bg-transparent group-hover:bg-primary"
                      }`}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* GRUPO 2 - Soporte / Legal */}
            <div className="flex flex-col flex-1 gap-0.5 mt-5 py-5 border-t border-border font-medium dark:font-normal">
              {supportLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-lg uppercase font-oswald py-1 relative flex items-center gap-3 hover:bg-muted transition-colors group ${
                      isActive ? "bg-muted/50" : ""
                    }`}
                  >
                    <div
                      className={`px-0.5 p-5 transition-colors ${
                        isActive
                          ? "bg-primary"
                          : "bg-transparent group-hover:bg-primary"
                      }`}
                    />
                    {link.label}
                  </Link>
                );
              })}

              {/* Buttons */}
              <div className="pt-5 mt-auto px-3 flex items-center gap-x-2">
                <ThemeToggle />

                <Link
                  href="https://www.facebook.com/profile.php?id=61594794815182"
                  target="_blank"
                  className="ml-auto"
                >
                  <Button
                    variant="glass"
                    size="icon-lg"
                    className="rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 32 32"
                    >
                      <path d="M0 0h32v32H0z" fill="none" />
                      <path
                        fill="currentColor"
                        d="m23.446 18l.889-5.791h-5.557V8.451c0-1.584.776-3.129 3.265-3.129h2.526V.392S22.277.001 20.085.001c-4.576 0-7.567 2.774-7.567 7.795v4.414H7.431v5.791h5.087v14h6.26v-14z"
                      />
                    </svg>
                  </Button>
                </Link>
                <Link
                  href="https://www.instagram.com/hi_zentro/"
                  target="_blank"
                >
                  <Button
                    variant="glass"
                    size="icon-lg"
                    className="rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 32 32"
                    >
                      <path d="M0 0h32v32H0z" fill="none" />
                      <path
                        fill="currentColor"
                        d="M16 0c-4.349 0-4.891.021-6.593.093c-1.709.084-2.865.349-3.885.745a7.85 7.85 0 0 0-2.833 1.849A7.8 7.8 0 0 0 .84 5.52C.444 6.54.179 7.696.095 9.405c-.077 1.703-.093 2.244-.093 6.593s.021 4.891.093 6.593c.084 1.704.349 2.865.745 3.885a7.85 7.85 0 0 0 1.849 2.833a7.8 7.8 0 0 0 2.833 1.849c1.02.391 2.181.661 3.885.745c1.703.077 2.244.093 6.593.093s4.891-.021 6.593-.093c1.704-.084 2.865-.355 3.885-.745a7.85 7.85 0 0 0 2.833-1.849a7.7 7.7 0 0 0 1.849-2.833c.391-1.02.661-2.181.745-3.885c.077-1.703.093-2.244.093-6.593s-.021-4.891-.093-6.593c-.084-1.704-.355-2.871-.745-3.885a7.85 7.85 0 0 0-1.849-2.833A7.7 7.7 0 0 0 26.478.838c-1.02-.396-2.181-.661-3.885-.745C20.89.016 20.349 0 16 0m0 2.88c4.271 0 4.781.021 6.469.093c1.557.073 2.405.333 2.968.553a5 5 0 0 1 1.844 1.197a4.9 4.9 0 0 1 1.192 1.839c.22.563.48 1.411.553 2.968c.072 1.688.093 2.199.093 6.469s-.021 4.781-.099 6.469c-.084 1.557-.344 2.405-.563 2.968c-.303.751-.641 1.276-1.199 1.844a5.05 5.05 0 0 1-1.844 1.192c-.556.22-1.416.48-2.979.553c-1.697.072-2.197.093-6.479.093s-4.781-.021-6.48-.099c-1.557-.084-2.416-.344-2.979-.563c-.76-.303-1.281-.641-1.839-1.199c-.563-.563-.921-1.099-1.197-1.844c-.224-.556-.48-1.416-.563-2.979c-.057-1.677-.084-2.197-.084-6.459c0-4.26.027-4.781.084-6.479c.083-1.563.339-2.421.563-2.979c.276-.761.635-1.281 1.197-1.844c.557-.557 1.079-.917 1.839-1.199c.563-.219 1.401-.479 2.964-.557c1.697-.061 2.197-.083 6.473-.083zm0 4.907A8.21 8.21 0 0 0 7.787 16A8.21 8.21 0 0 0 16 24.213A8.21 8.21 0 0 0 24.213 16A8.21 8.21 0 0 0 16 7.787m0 13.546c-2.948 0-5.333-2.385-5.333-5.333s2.385-5.333 5.333-5.333s5.333 2.385 5.333 5.333s-2.385 5.333-5.333 5.333M26.464 7.459a1.923 1.923 0 0 1-1.923 1.921a1.919 1.919 0 1 1 0-3.838c1.057 0 1.923.86 1.923 1.917"
                      />
                    </svg>
                  </Button>
                </Link>
                <Link href="https://wa.me/51919728725" target="_blank">
                  <Button
                    variant="glass"
                    size="icon-lg"
                    className="rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <g fill="none">
                        <g clipPath="url(#SVGXv8lpc2Y)">
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967s-.47-.148-.669.15c-.198.297-.767.966-.94 1.164c-.174.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.019-.458.13-.606c.134-.133.297-.347.446-.52s.198-.298.297-.497c.1-.198.05-.371-.025-.52c-.074-.149-.668-1.612-.916-2.207c-.241-.579-.486-.5-.668-.51c-.174-.008-.372-.01-.57-.01s-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479c0 1.462 1.064 2.875 1.213 3.074s2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625c.712.227 1.36.195 1.872.118c.57-.085 1.758-.719 2.006-1.413s.247-1.289.173-1.413s-.272-.198-.57-.347m-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214l-3.742.982l.999-3.648l-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884a9.8 9.8 0 0 1 6.988 2.899a9.82 9.82 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885m8.412-18.297A11.82 11.82 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892a11.86 11.86 0 0 0 1.587 5.945L0 24l6.304-1.654a11.9 11.9 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.82 11.82 0 0 0-3.48-8.413"
                            clipRule="evenodd"
                          />
                        </g>
                        <defs>
                          <clipPath id="SVGXv8lpc2Y">
                            <path fill="#fff" d="M0 0h24v24H0z" />
                          </clipPath>
                        </defs>
                      </g>
                    </svg>
                  </Button>
                </Link>
                <Link href="mailto:usezentroapp@gmail.com" target="_blank">
                  <Button
                    variant="glass"
                    size="icon-lg"
                    className="rounded-full"
                  >
                    <Mail />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTAs en móvil */}
          <div className="grid sm:grid-cols-2 gap-2 mt-5 px-1">
            <Link href="/ingresar" onClick={() => setOpen(false)}>
              <Button
                variant="outline"
                className="w-full rounded-full text-base h-fit py-2 font-medium"
              >
                Ingresar
              </Button>
            </Link>
            <Link href="/registrar" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-full text-base h-fit py-2 font-medium">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
