import Image from "next/image";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-y-7">
      <Link
        href="/"
        aria-label="Ir al inicio de Zentro"
        className="size-16 flex items-center justify-center"
      >
        <Image
          src="/branding/logos/icon/logo-icon-dark-background-rounded.png"
          alt="Zentro Logo"
          width={80}
          height={80}
          className="block dark:hidden"
        />
        <Image
          src="/branding/logos/icon/logo-icon-dark-background-rounded.png"
          alt="Zentro Logo"
          width={80}
          height={80}
          className="hidden dark:block"
        />
      </Link>

      <div className="space-y-1.5 text-center">
        <h1 className="text-3xl font-heading font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
