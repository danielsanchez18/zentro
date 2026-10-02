import { Store } from "lucide-react";

export function About() {
  return (
    <div className="max-w-7xl grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 lg:gap-8 mt-20 py-30 px-4 sm:px-7 xl:px-10 mx-auto">
      {/* Title & Description */}
      <div className="sm:col-span-2 lg:col-span-3 max-w-3xl mx-auto text-center space-y-3 mb-10">
        <p className="text-muted-foreground text-lg">¿Qué es Zentro?</p>
        <h2 className="text-balance text-3xl lg:text-4xl font-semibold tracking-tight">
          Una plataforma diseñada para empresas que quieren{" "}
          <span className="text-primary">escalar</span>
        </h2>
      </div>

      {/* Icon Block */}
      <div className="relative flex sm:pe-6">
        <div className="h-10 w-10 min-w-10 mt-1 border-[2.3] border-primary rounded-xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className="size-5 text-primary"
          >
            <path d="M0 0h16v16H0z" fill="none" />
            <path
              fill="currentColor"
              d="M2 10h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1m9-9h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1m0 9a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zm0-10a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM2 9a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2zm7 2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2zM0 2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.354.854a.5.5 0 1 0-.708-.708L3 3.793l-.646-.647a.5.5 0 1 0-.708.708l1 1a.5.5 0 0 0 .708 0z"
            />
          </svg>
        </div>

        <div className="ms-6">
          <h2 className="font-semibold mb-1">Todo en un solo lugar</h2>
          <p className="text-muted-foreground leading-normal">
            Centraliza inventario, ventas, clientes y reportes en una única
            plataforma. Sin hojas de cálculo ni herramientas dispersas.
          </p>
        </div>
      </div>
      {/* End Icon Block */}

      {/* Icon Block */}
      <div className="relative flex pt-6 sm:pt-0 sm:ps-6">
        <div className="h-10 w-10 min-w-10 mt-1 border-[2.3] border-primary rounded-xl flex items-center justify-center">
          <Store className="text-primary" />
        </div>
        <div className="ms-6">
          <h2 className="font-semibold mb-1">Multi-sucursal de serie</h2>
          <p className="text-muted-foreground leading-normal">
            Gestiona una o varias sucursales con stock, caja y ventas
            independientes por sede, más una vista consolidada del negocio.
          </p>
        </div>
        <div className="absolute top-0 inset-s-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent sm:bg-linear-to-t sm:w-px sm:h-full"></div>
      </div>
      {/* End Icon Block */}

      {/* Icon Block */}
      <div className="relative flex pt-6 sm:pt-0 lg:ps-6">
        <div className="h-10 w-10 min-w-10 mt-1 border-[2.3] border-primary rounded-xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <g clipPath="url(#clip0_4418_9932)">
              <path
                d="M22 6.5H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6.5H2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 10C11.933 10 13.5 8.433 13.5 6.5C13.5 4.567 11.933 3 10 3C8.067 3 6.5 4.567 6.5 6.5C6.5 8.433 8.067 10 10 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 17.5H18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 17.5H2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 21C15.933 21 17.5 19.433 17.5 17.5C17.5 15.567 15.933 14 14 14C12.067 14 10.5 15.567 10.5 17.5C10.5 19.433 12.067 21 14 21Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_4418_9932">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="ms-6">
          <h2 className="font-semibold mb-1">Modular a tu medida</h2>
          <p className="text-muted-foreground">
            Activa solo los módulos que tu negocio necesita hoy: POS, catálogo,
            CRM, inventario o presencia digital. Crece cuando tú quieras.
          </p>
        </div>
        <div className="absolute top-0 inset-s-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent sm:hidden lg:block sm:bg-linear-to-t sm:w-px sm:h-full"></div>
      </div>
      {/* End Icon Block */}
    </div>
  );
}
