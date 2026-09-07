"use client";

import { useMemo, useState } from "react";
import { Check, MessageSquareText, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerOrder } from "@/lib/mock/orders";
import { orderTimeline } from "@/lib/mock/orders";
import { cn } from "@/lib/utils";

type Activity = {
  id: string;
  title: string;
  time: string;
  date: string;
  detail?: string;
  comment?: string;
  current?: boolean;
};

const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(value))
    .toUpperCase();

const timeLabel = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export function OrderTimeline({ order }: { order: CustomerOrder }) {
  const [showComments, setShowComments] = useState(true);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState<Activity[]>([]);

  const activities = useMemo<Activity[]>(() => {
    const statusEvents = orderTimeline(order)
      .filter((event) => event.date)
      .map((event) => ({
        id: event.status,
        title: event.label,
        time: timeLabel(event.date!),
        date: event.date!,
        current: event.current,
      }));

    return [
      ...comments,
      ...statusEvents,
      {
        id: "placed",
        title: `${order.number} fue registrado`,
        time: timeLabel(order.createdAt),
        date: order.createdAt,
      },
    ];
  }, [comments, order]);

  const groupedActivities = activities.reduce<Record<string, Activity[]>>(
    (groups, activity) => {
      const key = dateLabel(activity.date);
      groups[key] = [...(groups[key] ?? []), activity];
      return groups;
    },
    {},
  );

  const postComment = () => {
    const content = message.trim();
    if (!content) return;

    const now = new Date().toISOString();
    setComments((current) => [
      {
        id: `comment-${Date.now()}`,
        title: "Comentario interno",
        comment: content,
        time: timeLabel(now),
        date: now,
      },
      ...current,
    ]);
    setMessage("");
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold">Timeline</h2>
        <button
          type="button"
          role="checkbox"
          aria-checked={showComments}
          onClick={() => setShowComments((current) => !current)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground font-medium"
        >
          <span
            className={cn(
              "flex size-4 items-center justify-center rounded border",
              showComments
                ? "border-foreground bg-foreground text-background"
                : "border-input bg-background",
            )}
          >
            {showComments && <Check className="size-3 stroke-3" />}
          </span>
          Mostrar comentarios
        </button>
      </header>

      <div className="p-5">
        {showComments && (
          <div className="relative pl-5">
            <span className="absolute left-0 top-2.5 size-2 rounded-full bg-muted-foreground/65 ring-4 ring-card" />
            <div className="overflow-hidden rounded-xl border border-border bg-background">
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Agrega un comentario interno si lo necesitas."
                className="min-h-28 resize-y border-0 bg-transparent px-4 py-3 text-sm shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center justify-between border-t border-border px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MessageSquareText className="size-3.5" />
                  Solo el equipo puede ver estos comentarios.
                </div>
                <Button
                  size="sm"
                  onClick={postComment}
                  disabled={!message.trim()}
                  className="rounded-full"
                >
                  <Send data-icon="inline-start" />
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className={cn("space-y-6", showComments && "mt-8")}>
          {Object.entries(groupedActivities).map(([day, dayActivities]) => (
            <div key={day}>
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                {day}
              </p>
              <div className="space-y-0">
                {dayActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="relative flex gap-4 pl-5 pb-6 last:pb-0"
                  >
                    {index < dayActivities.length - 1 && (
                      <span className="absolute left-1 top-3.5 h-[calc(100%-0.35rem)] w-px bg-border" />
                    )}
                    <span
                      className={cn(
                        "absolute left-0 top-1.5 size-2 rounded-full ring-4 ring-card",
                        activity.current
                          ? "bg-primary"
                          : "bg-muted-foreground/65",
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      {activity.comment && (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {activity.comment}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                      {activity.current && (
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                          <ShieldCheck className="size-3.5" />
                          Estado actual
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
