"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useAuthStore } from "@/stores/auth-store";
import { HubLogo } from "@/components/dashboard/shared/HubLogo";
import { UserAvatar } from "@/components/dashboard/shared/UserAvatar";
import { HUB_NAV, isNavItemActive } from "@/components/dashboard/shared/nav";

export const usePendingInvitations = () =>
  useDashboardStore(
    (state) =>
      state.invitations.filter(
        (invitation) =>
          invitation.status === "PENDING" &&
          invitation.email.toLowerCase() ===
            state.currentUser.email.toLowerCase(),
      ).length,
  );

export { useLogout } from "@/components/dashboard/shared/HubOverlays";

/**
 * Sidebar del Hub (desde `lg`). En pantallas menores la navegación vive en
 * `MobileTabBar` (barra inferior + drawer "Más").
 */
export const Sidebar = () => {
  const pathname = usePathname();
  const pendingInvitations = usePendingInvitations();
  const user = useAuthStore((state) => state.user)!;

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 p-2 pr-0 lg:block">
      <div className="flex h-full flex-col rounded-sm bg-card">
        <div className="px-6 pt-5 pb-4">
          <HubLogo />
        </div>

        <nav
          data-demo="navigation"
          aria-label="Navegación del hub"
          className="flex-1 space-y-5 overflow-y-auto px-3 py-2"
        >
          {HUB_NAV.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground font-heading">
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = isNavItemActive(item.href, pathname);
                const count =
                  item.badge === "invitations" ? pendingInvitations : 0;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-(--hub-radius-control) px-3 text-sm font-medium text-muted-foreground transition-colors",
                      active
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4.5" />
                    <span className="flex-1">{item.label}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          "flex h-5 min-w-5 items-center justify-center rounded-(--hub-radius-inner) px-1.5 text-xs font-semibold",
                          "bg-hub-accent text-hub-accent-foreground",
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-2 py-2">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/cuenta"
              className="flex min-w-0 flex-1 items-center gap-2 p-2 font-heading rounded-sm hover:bg-muted"
            >
              <UserAvatar name={user.name} src={user.avatarUrl} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
