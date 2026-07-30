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
        className="size-16 flex items-center justify-center text-2xl font-heading font-bold tracking-tight"
      >
        <Image src="/favicon.ico" alt="Zentro Logo" width={64} height={64} className="dark:invert" />
      </Link>

      <div className="space-y-1.5 text-center">
        <h1 className="text-3xl font-heading font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
