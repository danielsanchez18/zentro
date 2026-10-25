/** "15 de julio de 2026" → "15 Julio 2026" (formato de fechas del Hub). */
export const formatLongDate = (value: string) =>
  value
    .replace(/ de /g, " ")
    .replace(/(\d+) (\p{L})(\p{L}*) (\d{4})/u, (_, day, first, rest, year) => `${day} ${first.toUpperCase()}${rest} ${year}`);
