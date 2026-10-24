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
  className,
}: {
  name: string;
  className?: string;
}) => (
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
