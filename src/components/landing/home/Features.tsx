export function Features() {
  return (
    <section className="py-30 space-y-20 max-w-7xl px-4 sm:px-7 xl:px-10 mx-auto">

    <div className="space-y-5 text-center max-w-xl mx-auto px-5">
        <p className="text-muted-foreground">Features</p>
        <h3 className="text-3xl lg:text-4xl font-semibold text-balance tracking-tight">Todo lo que necesitas para operar sin fricción</h3>
    </div>

    <div className="grid sm:grid-cols-2 px-5 gap-x-10 lg:gap-x-20 gap-y-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
        <svg className="size-8 stroke-[1.5] mt-0.5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"
            d="M21.984 10c-.037-1.311-.161-2.147-.581-2.86c-.598-1.015-1.674-1.58-3.825-2.708l-2-1.05C13.822 2.461 12.944 2 12 2s-1.822.46-3.578 1.382l-2 1.05C4.271 5.56 3.195 6.125 2.597 7.14C2 8.154 2 9.417 2 11.942v.117c0 2.524 0 3.787.597 4.801c.598 1.015 1.674 1.58 3.825 2.709l2 1.049C10.178 21.539 11.056 22 12 22s1.822-.46 3.578-1.382l2-1.05c2.151-1.129 3.227-1.693 3.825-2.708c.42-.713.544-1.549.581-2.86M21 7.5l-4 2M12 12L3 7.5m9 4.5v9.5m0-9.5l4.5-2.25l.5-.25m0 0V13m0-3.5l-9.5-5" />
        </svg>
        <div className="space-y-1">
            <h4 className="font-semibold tracking-tight">Gestión de inventario</h4>
            <p className="text-muted-foreground text-sm">Control de productos, variantes, stock limitado o ilimitado, alertas de
            reposición.</p>
        </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="lucide lucide-clipboard-pen-line-icon lucide-clipboard-pen-line size-8 stroke-[1.5] mt-0.5 text-primary">
            <rect width="8" height="4" x="8" y="2" rx="1" />
            <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5" />
            <path d="M16 4h2a2 2 0 0 1 1.73 1" />
            <path d="M8 18h1" />
            <path
            d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
        </svg>
        <div className="space-y-1">
            <h4 className="font-semibold tracking-tight">Pedidos y ventas</h4>
            <p className="text-muted-foreground text-sm">Gestión de pedidos, estados, pagos y seguimiento.</p>
        </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
        <svg className="size-8 stroke-[1.5] mt-0.5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M17.928 19.634h2.138a1.165 1.165 0 0 0 1.116-1.555a6.85 6.85 0 0 0-6.117-3.95m0-2.759a3.664 3.664 0 0 0 3.665-3.664a3.664 3.664 0 0 0-3.665-3.674m-1.04 16.795a1.908 1.908 0 0 0 1.537-3.035a8.03 8.03 0 0 0-6.222-3.196a8.03 8.03 0 0 0-6.222 3.197a1.909 1.909 0 0 0 1.536 3.034zM9.34 11.485a4.16 4.16 0 0 0 4.15-4.161a4.151 4.151 0 0 0-8.302 0a4.16 4.16 0 0 0 4.151 4.16" />
        </svg>
        <div className="space-y-1">
            <h4 className="font-semibold tracking-tight">Usuarios, roles y permisos</h4>
            <p className="text-muted-foreground text-sm">Control de accesos por rol, empresa y sucursal.</p>
        </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
        <svg className="size-8 stroke-[1.5] mt-0.5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect width="18.5" height="18.5" x="2.75" y="2.75" rx="6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m7 14.844l2.322-3.09a.95.95 0 0 1 .588-.36a.95.95 0 0 1 .673.123l2.265 1.43c.21.132.46.176.702.124a.95.95 0 0 0 .597-.398l2.332-3.517" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m13.683 9.678l2.796-.522l.521 2.797" />
            </g>
        </svg>
        <div className="space-y-1">
            <h4 className="font-semibold tracking-tight">Reportes y dashboards</h4>
            <p className="text-muted-foreground text-sm">Métricas en tiempo real para tomar decisiones.</p>
        </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="lucide lucide-badge-percent-icon lucide-badge-percent size-8 stroke-[1.5] mt-0.5 text-primary">
            <path
            d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <path d="m15 9-6 6" />
            <path d="M9 9h.01" />
            <path d="M15 15h.01" />
        </svg>
        <div className="space-y-1">
            <h4 className="font-semibold tracking-tight">Precios, Ofertas y Promociones</h4>
            <p className="text-muted-foreground text-sm">Precios por sucursal, descuentos, promociones avanzadas.</p>
        </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-5 items-start">
        <svg className="size-8 stroke-[1.5] mt-0.5 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.999 8c4.418 0 8-1.344 8-3c0-1.658-3.582-3-8-3s-8 1.342-8 3c0 1.656 3.581 3 8 3Z" />
            <path strokeLinecap="round" d="M5.999 10.841c.601.18 1.274.33 2 .44m3 3.719c-4.419 0-8-1.344-8-3m3 5.841c.601.18 1.274.33 2 .44" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.999 22c-4.419 0-8-1.344-8-3V5m16 0v5.5" />
            <path strokeLinecap="round" d="M15.742 16.378c0-.06.009-.825.01-1.26c.001-.397-.034-.78.156-1.13c.71-1.412 2.75-1.269 3.254.17c.088.238.093.613.09.96c-.003.444.006 1.26.006 1.26m-3.516 0c-1.08 0-1.523.78-1.643 1.26s-.12 2.218-.048 2.938c.24.9.84 1.271 1.427 1.391c.54.048 2.82.03 3.48.03c.96.018 1.68-.341 1.98-1.421c.06-.36.12-2.339-.03-2.939c-.319-.96-1.05-1.26-1.65-1.26m-3.516 0h3.516" />
            </g>
        </svg>
        <div className="space-y-1">
            <h4 className="font-semibold tracking-tight">Seguridad empresarial</h4>
            <p className="text-muted-foreground text-sm">Autenticación moderna, control de accesos y auditoría.</p>
        </div>
        </div>
    </div>
    </section>

  )
}