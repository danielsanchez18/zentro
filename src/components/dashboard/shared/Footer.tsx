export const Footer = () => {
  return (
        <div className="w-full px-5 md:px-7 xl:px-10 max-w-350 mx-auto pt-10">
            <footer className="w-full text-muted-foreground text-sm py-5 flex items-center justify-center sm:justify-between gap-5 flex-wrap">
                <p className="font-medium">2026 © Zentro</p>
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
