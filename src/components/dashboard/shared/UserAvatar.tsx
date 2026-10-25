import { cn } from "@/lib/utils";
import { UserIcon } from "./icons";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const UserAvatar = ({
  name,
  src,
  className,
}: {
  name: string;
  /** Foto de perfil (data URL); sin ella se muestra el ícono. */
  src?: string | null;
  className?: string;
}) =>
  src ? (
    // eslint-disable-next-line @next/next/no-img-element -- data URL, sin optimización de next/image
    <img
      src={src}
      alt={name}
      className={cn("size-10 shrink-0 rounded-sm object-cover", className)}
    />
  ) : (
  <div
    aria-hidden="true"
    className={cn(
      "flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-sm font-semibold text-foreground",
      className,
    )}
  >
    {/* {initials(name)} */}
    <UserIcon className="size-4" />
  </div>
  );
