export const Footer = () => {
  return (
        <div className="hidden lg:block w-full px-2 max-w-350 mx-auto pt-2 pb-2">
            <footer className="w-full rounded-sm bg-card px-4 py-3 text-muted-foreground text-sm flex items-center justify-center sm:justify-between gap-x-5 gap-y-3 flex-wrap">
                <p>2026 © Zentro</p>
                <div className="flex items-center gap-x-3">
                    <button className="text-sm hover:underline hover:text-primary">
                        FAQ
                    </button>
                    <div className="h-5 w-px bg-muted-foreground rotate-20" />
                    <button className="text-sm hover:underline hover:text-primary">
                        Terminos y condiciones
                    </button>
                    <div className="h-5 w-px bg-muted-foreground rotate-20" />
                    <button className="text-sm hover:underline hover:text-primary">
                        Aviso de privacidad
                    </button>
                </div>
            </footer>
        </div>
  )
}
