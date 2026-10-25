"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, LogOut, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/shared/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";
import { NotificationsMenu } from "@/components/dashboard/shared/NotificationsMenu";
import { HubLogo } from "@/components/dashboard/shared/HubLogo";
import { UserAvatar } from "@/components/dashboard/shared/UserAvatar";
import { getActiveNavItem } from "@/components/dashboard/shared/nav";
import { useLogout } from "@/components/dashboard/shared/Sidebar";

const ACCOUNT_LINKS = [
  { href: "/dashboard/cuenta", label: "Mi cuenta", icon: UserRound },
  {
    href: "/dashboard/suscripciones",
    label: "Suscripciones",
    icon: CreditCard,
  },
];

const AccountMenu = () => {
  const user = useAuthStore((state) => state.user)!;
  const handleLogout = useLogout();
  const trigger = (
    <span className="flex size-10 items-center justify-center rounded-full">
      <UserAvatar name={user.name} src={user.avatarUrl} />
    </span>
  );

  // Dropdown en todos los tamaños: para 3 opciones un drawer es excesivo.
  return (
      <DropdownMenu>
        <DropdownMenuTrigger
          data-demo="account"
          aria-label="Menú de cuenta"
          className="cursor-pointer rounded-full"
        >
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <DropdownMenuSeparator />
          {ACCOUNT_LINKS.map((link) => (
            <DropdownMenuItem
              key={link.href}
              render={<Link href={link.href} />}
              className="cursor-pointer px-3 py-2"
            >
              <link.icon className="size-4" />
              {link.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const current = getActiveNavItem(pathname);

  return (
    <div className="p-2">
      <header className="sticky top-0 z-30 bg-card rounded-sm">
        <div className="flex items-center gap-3 px-4 py-2">
          <HubLogo className="lg:hidden" />
          {/* <h1 className="hidden text-lg font-semibold lg:block">
            {current?.label ?? "Hub"}
          </h1> */}

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <NotificationsMenu />
            <AccountMenu />
          </div>
        </div>
      </header>
    </div>
  );
};
