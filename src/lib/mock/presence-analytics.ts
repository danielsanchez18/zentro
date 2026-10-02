/**
 * Analítica del sitio web.
 *
 * Alimenta el overview de `/presencia`, que es lo que un trabajador necesita
 * para evaluar el rendimiento de su página: visitas, interacción, de dónde
 * viene el tráfico y qué páginas rinden.
 *
 * Es un mock: no hay backend ni tracking real todavía. La forma de los datos
 * sigue lo que necesitará un `/analytics` de verdad (serie temporal, desgloses
 * por dimensión), para que el frontend no haya que rediseñar al integrar.
 */

/** Periodos relativos al día de hoy. Mismo criterio que Auditoría. */
export type PresencePeriod = "7d" | "30d" | "90d";

export const PRESENCE_PERIOD_LABELS: Record<PresencePeriod, string> = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
};

export const PRESENCE_PERIOD_DAYS: Record<PresencePeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/* -------------------------------------------------------------------------- */
/* Serie temporal                                                              */
/* -------------------------------------------------------------------------- */

export interface PresenceDailyPoint {
  /** ISO corto `MM-DD`. */
  day: string;
  /** Visitors únicos. */
  visitors: number;
  /** Vistas de página. */
  views: number;
  /** Interacciones con cualquier elemento rastreable (CTA, botón, formulario). */
  interactions: number;
}

/* -------------------------------------------------------------------------- */
/* Dimensiones                                                                  */
/* -------------------------------------------------------------------------- */

/** Origen del tráfico. */
export type TrafficSource = "buscador" | "directo" | "social" | "enlace";

export const TRAFFIC_SOURCE_LABELS: Record<TrafficSource, string> = {
  buscador: "Buscador",
  directo: "Directo",
  social: "Redes sociales",
  enlace: "Enlaces",
};

/** Página del sitio, por slug. */
export interface PageMetric {
  slug: string;
  label: string;
  views: number;
  /** Tiempo medio de permanencia en segundos. */
  avgSeconds: number;
  /** Porcentaje de salida sobre las vistas de la página. */
  bounceRate: number;
}

/** Región desde la que llegan las visitas. */
export interface RegionMetric {
  region: string;
  visitors: number;
  /** Cambio respecto al periodo anterior, en porcentaje. */
  deltaPct: number;
}

/** Página de entrada: por dónde empiezan los visitantes. */
export interface LandingMetric {
  path: string;
  label: string;
  entrances: number;
}

/** Eventos de interacción medidos. */
export interface InteractionMetric {
  kind: "cta_principal" | "menu" | "formulario" | "whatsapp" | "reserva";
  label: string;
  clicks: number;
  /** Porcentaje de clics que terminan completando la acción. */
  conversionPct: number;
}

/* -------------------------------------------------------------------------- */
/* Resumen                                                                     */
/* -------------------------------------------------------------------------- */

export interface PresenceAnalytics {
  organizationId: string;
  /** Visitantes únicos del periodo. */
  visitors: number;
  /** Cambio vs. periodo anterior (%). Positivo = subió. */
  visitorsDeltaPct: number;
  views: number;
  viewsDeltaPct: number;
  /**
   * Conteo total de interacciones del periodo (un `number`).
   *
   * El detalle por tipo de elemento va en `interactionBreakdown`, para que el
   * nombre `interactions` siempre signifique "cuántas".
   */
  interactions: number;
  interactionsDeltaPct: number;
  /** Tasa de interacción sobre vistas (%). */
  interactionRate: number;
  /** Segundos promedio de permanencia. */
  avgSessionSeconds: number;
  /** Tasa de rebote global (%). */
  bounceRate: number;
  daily: PresenceDailyPoint[];
  sources: { source: TrafficSource; visitors: number }[];
  pages: PageMetric[];
  regions: RegionMetric[];
  landings: LandingMetric[];
  /** Desglose de `interactions` por tipo de elemento. */
  interactionBreakdown: InteractionMetric[];
}

/* -------------------------------------------------------------------------- */
/* Semilla                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Genera la serie temporal de forma determinista (sin `Math.random`) para que
 * el mock sea estable entre recargas y los totales cuadren con la serie.
 */
const buildDaily = (
  days: number,
  seed: { visitors: number; views: number; interactions: number },
): PresenceDailyPoint[] => {
  const points: PresenceDailyPoint[] = [];
  const today = new Date("2026-10-01T12:00:00.000Z");

  for (let offset = days - 1; offset >= 0; offset--) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - offset);

    // Onda semanal: fines de semana con más tráfico.
    const weekday = date.getUTCDay();
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.25 : 1;
    // Variación determinista por día, para que la línea no sea plana.
    const wobble = 0.82 + (((days - offset) * 7) % 11) / 40;

    const visitors = Math.round(seed.visitors * weekendBoost * wobble);
    const views = Math.round(
      visitors * (1.6 + (((days - offset) * 3) % 7) / 20),
    );
    const interactions = Math.round(views * (0.28 + (((days - offset) * 5) % 9) / 60));

    points.push({
      day: date.toISOString().slice(5, 10),
      visitors,
      views,
      interactions,
    });
  }

  return points;
};

const sum = (items: number[]) => items.reduce((a, b) => a + b, 0);

/** Datos que se pasan a la semilla; el resto se calcula. */
type AnalyticsExtras = Pick<
  PresenceAnalytics,
  | "avgSessionSeconds"
  | "bounceRate"
  | "sources"
  | "pages"
  | "regions"
  | "landings"
  | "interactionBreakdown"
>;

/** Consolida la serie diaria en un `PresenceAnalytics`. */
const buildAnalytics = (
  organizationId: string,
  days: number,
  extras: AnalyticsExtras,
  base: { visitors: number; views: number; interactions: number },
): PresenceAnalytics => {
  const daily = buildDaily(days, base);
  const visitors = sum(daily.map((point) => point.visitors));
  const views = sum(daily.map((point) => point.views));
  const interactions = sum(daily.map((point) => point.interactions));

  // Los deltas contra el periodo anterior se calculan con un factor fijo por
  // org en vez de almacenar otra serie: en el mock es suficiente y mantiene
  // el tamaño del archivo manejable.
  const growth = 1 + ((organizationId.charCodeAt(5) % 7) - 2) / 20;

  return {
    organizationId,
    visitors,
    visitorsDeltaPct: Math.round((growth - 1) * 100),
    views,
    viewsDeltaPct: Math.round((growth - 1) * 100),
    interactions,
    interactionsDeltaPct: Math.round((growth - 1) * 100),
    interactionRate: Number(((interactions / Math.max(views, 1)) * 100).toFixed(1)),
    avgSessionSeconds: extras.avgSessionSeconds,
    bounceRate: extras.bounceRate,
    daily,
    sources: extras.sources,
    pages: extras.pages,
    regions: extras.regions,
    landings: extras.landings,
    interactionBreakdown: extras.interactionBreakdown,
  };
};

export const PRESENCE_ANALYTICS: PresenceAnalytics[] = [
  buildAnalytics(
    "org_001",
    30,
    {
      avgSessionSeconds: 96,
      bounceRate: 38,
      sources: [
        { source: "buscador", visitors: 742 },
        { source: "directo", visitors: 415 },
        { source: "social", visitors: 298 },
        { source: "enlace", visitors: 121 },
      ],
      pages: [
        { slug: "/", label: "Portada", views: 1180, avgSeconds: 74, bounceRate: 31 },
        { slug: "/carta", label: "Carta", views: 642, avgSeconds: 128, bounceRate: 22 },
        { slug: "/nosotros", label: "Nosotros", views: 410, avgSeconds: 61, bounceRate: 44 },
        { slug: "/contacto", label: "Contacto", views: 302, avgSeconds: 88, bounceRate: 27 },
      ],
      regions: [
        { region: "Lima", visitors: 1043, deltaPct: 12 },
        { region: "Callao", visitors: 221, deltaPct: 4 },
        { region: "Ica", visitors: 96, deltaPct: -8 },
        { region: "Arequipa", visitors: 74, deltaPct: 21 },
        { region: "Trujillo", visitors: 51, deltaPct: -3 },
        { region: "Extranjero", visitors: 38, deltaPct: 33 },
      ],
      landings: [
        { path: "/", label: "Portada", entrances: 612 },
        { path: "/carta", label: "Carta", entrances: 288 },
        { path: "/contacto", label: "Contacto", entrances: 141 },
      ],
      interactionBreakdown: [
        { kind: "cta_principal", label: "Reservar mesa", clicks: 342, conversionPct: 46 },
        { kind: "menu", label: "Ver carta", clicks: 291, conversionPct: 62 },
        { kind: "whatsapp", label: "Escribir por WhatsApp", clicks: 168, conversionPct: 71 },
        { kind: "formulario", label: "Enviar formulario", clicks: 87, conversionPct: 55 },
        { kind: "reserva", label: "Confirmar reserva", clicks: 157, conversionPct: 100 },
      ],
    },
    { visitors: 52, views: 88, interactions: 24 },
  ),
  buildAnalytics(
    "org_002",
    30,
    {
      avgSessionSeconds: 71,
      bounceRate: 46,
      sources: [
        { source: "directo", visitors: 320 },
        { source: "buscador", visitors: 268 },
        { source: "social", visitors: 194 },
        { source: "enlace", visitors: 62 },
      ],
      pages: [
        { slug: "/", label: "Portada", views: 690, avgSeconds: 52, bounceRate: 48 },
        { slug: "/menu", label: "Menú", views: 401, avgSeconds: 83, bounceRate: 34 },
      ],
      regions: [
        { region: "Lima", visitors: 512, deltaPct: 6 },
        { region: "Barranco", visitors: 138, deltaPct: 9 },
        { region: "Extranjero", visitors: 121, deltaPct: 27 },
      ],
      landings: [
        { path: "/", label: "Portada", entrances: 402 },
        { path: "/menu", label: "Menú", entrances: 190 },
      ],
      interactionBreakdown: [
        { kind: "menu", label: "Ver menú", clicks: 310, conversionPct: 48 },
        { kind: "reserva", label: "Reservar mesa", clicks: 142, conversionPct: 100 },
        { kind: "whatsapp", label: "Escribir por WhatsApp", clicks: 96, conversionPct: 64 },
      ],
    },
    { visitors: 27, views: 44, interactions: 12 },
  ),
  buildAnalytics(
    "org_003",
    30,
    {
      avgSessionSeconds: 58,
      bounceRate: 52,
      sources: [
        { source: "buscador", visitors: 180 },
        { source: "directo", visitors: 96 },
        { source: "enlace", visitors: 44 },
        { source: "social", visitors: 31 },
      ],
      pages: [
        { slug: "/", label: "Portada", views: 310, avgSeconds: 44, bounceRate: 55 },
      ],
      regions: [
        { region: "Lima", visitors: 264, deltaPct: 2 },
        { region: "Junín", visitors: 51, deltaPct: -6 },
        { region: "Extranjero", visitors: 36, deltaPct: 14 },
      ],
      landings: [{ path: "/", label: "Portada", entrances: 351 }],
      interactionBreakdown: [
        { kind: "menu", label: "Ver carta", clicks: 142, conversionPct: 51 },
        { kind: "whatsapp", label: "Escribir por WhatsApp", clicks: 74, conversionPct: 69 },
      ],
    },
    { visitors: 12, views: 21, interactions: 5 },
  ),
];

export const analyticsByOrganization = (
  organizationId: string,
  period: PresencePeriod = "30d",
): PresenceAnalytics | undefined => {
  const base = PRESENCE_ANALYTICS.find(
    (item) => item.organizationId === organizationId,
  );
  if (!base) return undefined;
  // Para periodos cortos se reescala la serie; en el mock es aproximado pero
  // mantiene la coherencia entre KPIs y gráficos.
  if (period === "30d") return base;

  const days = PRESENCE_PERIOD_DAYS[period];
  const daily = base.daily.slice(-days);
  const ratio = days / base.daily.length;
  return {
    ...base,
    daily,
    visitors: Math.round(base.visitors * ratio),
    views: Math.round(base.views * ratio),
    interactions: Math.round(base.interactions * ratio),
  };
};