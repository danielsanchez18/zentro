import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const HubLogo = ({ className }: { className?: string }) => (
  <Link
    href="/dashboard"
    aria-label="Zentro, ir al inicio"
    className={cn("inline-flex items-center", className)}
  >
    <Image
      src="/branding/logos/logo/logo-light.svg"
      alt="Zentro"
      width={893}
      height={250}
      priority
      className="h-5.5 w-auto dark:hidden"
    />
    <Image
      src="/branding/logos/logo/logo-dark.svg"
      alt="Zentro"
      width={893}
      height={250}
      priority
      className="hidden h-5.5 w-auto dark:block"
    />
  </Link>
);
