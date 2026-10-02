import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-10">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10">
        {/* Links and social media */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-5 md:gap-x-10">
          <article className="text-sm flex flex-col gap-y-3">
            <h3 className="font-semibold mb-3">Empresa</h3>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Sobre Zentro
            </Link>
            <Link
              href="/servicios"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Servicios
            </Link>
            <Link
              href="/casos-de-uso"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Casos de uso
            </Link>
            <Link
              href="/planes"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Planes
            </Link>
            <Link
              href="/clientes"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Clientes
            </Link>
          </article>

          <article className="text-sm flex flex-col gap-y-3">
            <h3 className="font-semibold mb-3">Servicio al cliente</h3>
            <Link
              href="/contacto"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Contáctanos
            </Link>
            <Link
              href="/faq"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Preguntas frecuentes
            </Link>
            <Link
              href="/ayuda"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Centro de ayuda
            </Link>
          </article>

          <article className="text-sm flex flex-col gap-y-3">
            <h3 className="font-semibold mb-3">Legal</h3>
            <Link
              href="/terminos-y-condiciones"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Términos y condiciones
            </Link>
            <Link
              href="/politica-de-privacidad"
              className="text-muted-foreground hover:text-foreground hover:underline w-fit"
            >
              Política de privacidad
            </Link>
          </article>

          <article className="text-sm flex flex-col gap-y-3">
            <h3 className="font-semibold mb-3">Descarga la app</h3>

            <Link
              href=""
              className="flex gap-x-2 lg:gap-x-3 rounded-xl py-3 px-3 lg:px-5 pr-8 w-fit bg-card border border-border hover:border-border hover:shadow-xs"
            >
              <Image
                src="/logos/Logo_AppStore.png"
                alt="Logo App Store"
                width={30}
                height={30}
                className="size-5 lg:size-6 object-contain"
                loading="lazy"
              />
              <div className="flex flex-col">
                <p className="leading-none text-muted-foreground text-[10px] truncate">
                  Disponible en la
                </p>
                <p className="leading-none font-semibold text-xs lg:text-sm">
                  App Store
                </p>
              </div>
            </Link>

            <Link
              href=""
              className="flex gap-x-2 lg:gap-x-3 rounded-xl py-3 px-3 lg:px-5 pr-8 w-fit bg-card border border-border hover:border-border hover:shadow-xs"
            >
              <Image
                src="/logos/Logo_GooglePlay.png"
                alt="Logo Google Play"
                width={30}
                height={30}
                className="size-5 lg:size-6 object-contain"
                loading="lazy"
              />
              <div className="flex flex-col">
                <p className="leading-none text-muted-foreground text-[10px] truncate">
                  Disponible en la
                </p>
                <p className="leading-none font-semibold text-xs lg:text-sm">
                  Google Play
                </p>
              </div>
            </Link>
          </article>
        </div>

        {/* Privacy and terms */}
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 mt-10">
          <article className="flex flex-wrap max-sm:justify-center items-center gap-x-3 gap-y-2 max-sm:mx-auto">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:underline hover:text-foreground text-nowrap"
            >
              © 2026 Zentro.
            </Link>
            <div className="rounded-full size-1 bg-gray-700 dark:bg-neutral-400"></div>
            <Link
              href="/terminos-y-condiciones"
              className="text-sm text-muted-foreground hover:underline hover:text-foreground text-nowrap"
            >
              Términos y Condiciones.
            </Link>
            <div className="rounded-full size-1 bg-gray-700 dark:bg-neutral-400"></div>
            <Link
              href="/politica-de-privacidad"
              className="text-sm text-muted-foreground hover:underline hover:text-foreground text-nowrap"
            >
              Política de privacidad.
            </Link>
          </article>

          <article className="flex items-center max-sm:mx-auto">
            <Link
              href="https://www.facebook.com/profile.php?id=61594794815182"
              className="rounded-full"
            >
              <Button
                variant="ghost"
                size="icon-lg"
                className="text-foreground hover:text-primary rounded-full"
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
              className="rounded-full"
            >
              <Button
                variant="ghost"
                size="icon-lg"
                className="text-foreground hover:text-primary rounded-full"
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
            <Link
              href="https://wa.me/51919728725"
              target="_blank"
              className="rounded-full"
            >
              <Button
                variant="ghost"
                size="icon-lg"
                className="text-foreground hover:text-primary rounded-full"
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
            <Link
              href="mailto:usezentroapp@gmail.com"
              target="_blank"
              className="rounded-full"
            >
              <Button
                variant="ghost"
                size="icon-lg"
                className="text-foreground hover:text-primary rounded-full"
              >
                <Mail />
              </Button>
            </Link>
          </article>
        </div>
      </div>
    </footer>
  );
}
