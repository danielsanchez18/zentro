/**
 * Formatos de fecha del Hub. Las fechas viajan en ISO 8601 (UTC) y se
 * presentan en español; textos como "hace 2 días" nunca se guardan.
 */
const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

/** "hace 3 horas", "ayer", "en 6 días". */
export const formatRelative = (iso: string, now: Date = new Date()) => {
  const minutes = Math.round((new Date(iso).getTime() - now.getTime()) / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
};

/** Días completos que faltan hasta una fecha (0 si ya pasó). */
export const daysUntil = (iso: string, now: Date = new Date()) =>
  Math.max(0, Math.ceil((new Date(iso).getTime() - now.getTime()) / 86_400_000));

/** "15 Julio 2026" — formato largo usado en suscripciones y facturas. */
export const formatLongDate = (iso: string, timeZone = "America/Lima") => {
  const parts = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone }).formatToParts(
    new Date(iso),
  );
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const month = get("month");
  return `${get("day")} ${month.charAt(0).toUpperCase()}${month.slice(1)} ${get("year")}`;
};

/** "Octubre 2026" */
export const formatMonthYear = (iso: string, timeZone = "America/Lima") => {
  const value = new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric", timeZone }).format(new Date(iso));
  return value.charAt(0).toUpperCase() + value.slice(1).replace(" de ", " ");
};

/** Importe en unidades menores → "S/ 49.00". */
export const formatMoney = (minorUnits: number, currencyCode = "PEN") =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: currencyCode, minimumFractionDigits: 2 })
    .format(minorUnits / 100)
    .replace(/ /g, " ");

/** Saludo según la hora local. */
export const greetingFor = (now: Date = new Date()) => {
  const hour = now.getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
};
