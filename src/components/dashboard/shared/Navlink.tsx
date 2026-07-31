import Link from "next/link"
import { Fragment } from "react"

const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/organizaciones", label: "Organizaciones" },
    { href: "/dashboard/invitaciones", label: "Invitaciones" },
    { href: "/dashboard/suscripciones", label: "Suscripciones" },
    { href: "/ayuda", label: "Ayuda" },
]

export const Navlink = () => {
    return (
        <div className="w-full border-b border-border">
            <nav className="w-full max-w-350 mx-auto px-5 py-2 md:px-7 xl:px-10 flex items-center gap-x-2">
                {links.map((link, index) => (
                    <Fragment key={link.href}>
                        {index > 0 && <div className="w-px h-5 bg-border" />}
                        <Link
                            href={link.href}
                            className="flex items-center gap-x-2.5 h-fit px-4 py-2 text-sm rounded-lg hover:bg-secondary text-secondary-foreground"
                        >
                            {link.label}
                        </Link>
                    </Fragment>
                ))}
            </nav>
        </div>
    )
}
