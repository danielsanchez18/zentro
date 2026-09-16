import { CalendarCheck2, CircleAlert, Clock3, UserX } from "lucide-react";
import type { Appointment } from "@/lib/mock/agenda";

const DAY = "2026-09-12";
export function AgendaKpis({ appointments }: { appointments: Appointment[] }) {
  const today = appointments.filter(
    (appointment) => appointment.startsAt.slice(0, 10) === DAY,
  );
  const scheduledMinutes = today
    .filter(
      (appointment) =>
        !["cancelada", "no_asistio"].includes(appointment.status),
    )
    .reduce((sum, appointment) => sum + appointment.durationMinutes, 0);
  const stats = [
    {
      title: "Citas de hoy",
      value: today.length,
      suffix: "citas",
      subtitle: "Programadas para la jornada",
      icon: CalendarCheck2,
    },
    {
      title: "Por confirmar",
      value: appointments.filter(
        (appointment) => appointment.status === "pendiente_confirmacion",
      ).length,
      suffix: "pendientes",
      subtitle: "Requieren seguimiento",
      icon: CircleAlert,
    },
    {
      title: "Tiempo reservado",
      value: Math.round((scheduledMinutes / 60) * 10) / 10,
      suffix: "horas",
      subtitle: "Carga programada de hoy",
      icon: Clock3,
    },
    {
      title: "No asistieron",
      value: appointments.filter(
        (appointment) => appointment.status === "no_asistio",
      ).length,
      suffix: "citas",
      subtitle: "Inasistencias registradas",
      icon: UserX,
    },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.title}
          className="rounded-xl border border-border bg-card px-5 py-4 font-heading"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-primary/70">
              <p className="text-sm">{item.title}</p>
              <item.icon className="size-4.5" />
            </div>

            <div className="space-y-1">
              <p className="text-xl font-medium">
                {typeof item.value === "number"
                  ? item.value.toLocaleString("es-PE")
                  : item.value}{" "}
                {item.suffix && (
                  <span className="text-sm">
                    {item.value === 1
                      ? item.suffix.replace(/s$/, "")
                      : item.suffix}
                  </span>
                )}
              </p>
              <p className="text-xs text-primary/70">{item.subtitle}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
