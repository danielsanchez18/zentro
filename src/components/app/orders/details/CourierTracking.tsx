import { Bike, MapPin, Navigation, Phone } from "lucide-react";
import type { CustomerOrder } from "@/lib/mock/orders";

export function CourierTracking({ order }: { order: CustomerOrder }) {
  if (order.serviceType !== "delivery") return null;
  const courier = order.courier;
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium">Seguimiento de entrega</h2>
      </header>
      <div className="p-5">
        <div className="relative h-60 overflow-hidden rounded-xl border border-border bg-muted/30">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute left-[12%] top-[65%] size-4 rounded-full border-4 border-background bg-primary" />
          <div className="absolute left-[18%] right-[18%] top-1/2 h-1 -rotate-6 bg-primary/35" />
          <div className="absolute right-[15%] top-[32%] flex size-9 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground">
            <Navigation className="size-4" />
          </div>
          <span className="absolute bottom-3 left-3 rounded-lg bg-background px-3 py-2 text-xs font-medium">
            ETA {courier?.etaMinutes ?? 25} min
          </span>
        </div>
        {courier ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                <Bike className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="size-2 rounded-full bg-green-500" />
                    <div className="absolute inset-0 size-2 animate-ping rounded-full bg-green-500" />
                  </div>
                  <p className="text-sm font-medium">{courier.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {courier.vehicle}
                  {courier.plate ? ` · ${courier.plate}` : ""}
                </p>
              </div>
            </div>
            <a
              href={`tel:${courier.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm leading-none font-medium hover:bg-accent"
            >
              Llamar
            </a>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            Repartidor pendiente de asignación.
          </div>
        )}
      </div>
    </section>
  );
}
