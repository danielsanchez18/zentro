"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  CreditCard,
  Mail,
  Megaphone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { hubButton } from "@/components/dashboard/shared/styles";
import { CompanyIcon } from "@/components/dashboard/shared/icons";
import type { NotificationType, UserNotification } from "@/types/dashboard";

/**
 * Notificaciones del Hub (campana del header). Son avisos que se leen;
 * las invitaciones (acciones de aceptar/rechazar) viven en su propia página.
 * Desktop: popover anclado a la campana. Mobile: drawer inferior.
 * TODO(0.2): leer de `GET /me/notifications` y marcar leídas en el servidor.
 */
const TYPE_META: Record<NotificationType, { icon: LucideIcon | typeof CompanyIcon; tone: string }> = {
  INVITATION: { icon: Mail, tone: "bg-hub-accent/20 text-foreground" },
  BILLING: { icon: CreditCard, tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  SECURITY: { icon: ShieldCheck, tone: "bg-sky-500/10 text-sky-700 dark:text-sky-400" },
  ORGANIZATION: { icon: CompanyIcon, tone: "bg-muted text-foreground" },
  PRODUCT: { icon: Megaphone, tone: "bg-muted text-foreground" },
};

const relativeTime = (iso: string) => {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
};

const NotificationItem = ({
  notification,
  onSelect,
}: {
  notification: UserNotification;
  onSelect: (notification: UserNotification) => void;
}) => {
  const meta = TYPE_META[notification.type];
  const unread = !notification.readAt;
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(notification)}
        className={cn(
          "flex w-full items-start gap-3 rounded-(--hub-radius-control) p-2 text-left transition-colors hover:bg-muted",
          unread && "bg-muted/50",
        )}
      >
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-(--hub-radius-control)", meta.tone)}>
          <meta.icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className={cn("truncate text-sm", unread ? "font-medium" : "text-muted-foreground")}>
              {notification.title}
            </span>
            {unread && <span className="size-2 shrink-0 rounded-full bg-hub-accent" aria-label="Sin leer" />}
          </span>
          <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">{notification.body}</span>
          <span className="mt-1 block text-xs text-muted-foreground">{relativeTime(notification.createdAt)}</span>
        </span>
      </button>
    </li>
  );
};

const NotificationsPanel = ({ onNavigate }: { onNavigate: () => void }) => {
  const router = useRouter();
  const notifications = useDashboardStore((state) => state.notifications);
  const markRead = useDashboardStore((state) => state.markNotificationRead);
  const markAllRead = useDashboardStore((state) => state.markAllNotificationsRead);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const unreadCount = notifications.filter((item) => !item.readAt).length;
  const visible = filter === "UNREAD" ? notifications.filter((item) => !item.readAt) : notifications;

  const handleSelect = (notification: UserNotification) => {
    markRead(notification.id);
    if (notification.href) {
      onNavigate();
      router.push(notification.href);
    }
  };

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 px-3 pt-1 pb-2 md:pt-3">
        <div>
          <p className="font-sans text-base font-medium">Notificaciones</p>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} sin leer` : "Estás al día"}
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className={cn(hubButton.ghost, "h-7 px-2 text-xs")}
        >
          Marcar todo como leído
        </button>
      </div>

      <div className="flex gap-1 px-3 pb-2">
        {(["ALL", "UNREAD"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "inline-flex h-7 items-center rounded-(--hub-radius-inner) px-2.5 text-xs font-medium transition-colors",
              filter === key ? "bg-hub-accent text-hub-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {key === "ALL" ? "Todas" : `Sin leer${unreadCount ? ` (${unreadCount})` : ""}`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <span className="flex size-10 items-center justify-center rounded-(--hub-radius-control) bg-muted text-muted-foreground">
            <BellOff className="size-5" />
          </span>
          <p className="text-sm font-medium">No tienes notificaciones sin leer</p>
          <p className="text-xs text-muted-foreground">Te avisaremos cuando pase algo importante.</p>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-1.5 pb-2 md:max-h-96">
          {visible.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onSelect={handleSelect} />
          ))}
        </ul>
      )}
    </div>
  );
};

export const NotificationsMenu = () => {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const unreadCount = useDashboardStore((state) => state.notifications.filter((item) => !item.readAt).length);

  const trigger = (
    <>
      <Bell className="size-4.5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-hub-accent px-1 text-[0.6rem] font-semibold text-hub-accent-foreground ring-2 ring-card">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </>
  );
  const triggerClass =
    "relative flex size-10 cursor-pointer items-center justify-center rounded-(--hub-radius-control) bg-muted text-foreground transition-colors hover:bg-muted/70";
  const label = unreadCount > 0 ? `Notificaciones: ${unreadCount} sin leer` : "Notificaciones";

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger data-demo="notifications" aria-label={label} className={triggerClass}>
          {trigger}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-96 p-0">
          <NotificationsPanel onNavigate={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger data-demo="notifications" aria-label={label} className={triggerClass}>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">Notificaciones</DrawerTitle>
        <NotificationsPanel onNavigate={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};
