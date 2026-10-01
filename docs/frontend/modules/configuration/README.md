# Módulo Centro de configuración y ubicaciones

Configuración del negocio: hub de secciones, gestión de la entidad **Ubicación**
(funciones "¿Qué sucede aquí?") y datos fiscales.

**Estado:** prototipo frontend cerrado (mock). Pendientes de backend en [issues.md](./issues.md).

## Rutas

| Ruta | Descripción |
|---|---|
| `/app/[slug]/configuracion` | Hub: tarjetas de sección (Ubicaciones, Facturación) + atajos a configuraciones de otros módulos |
| `/app/[slug]/configuracion/ubicaciones` | CRUD de ubicaciones: lista en cards, alta/edición, publicación y eliminación |
| `/app/[slug]/configuracion/facturacion` | Datos fiscales (reusa `BillingSettingsModule` del módulo Facturación) |

> `/configuracion/facturacion` también es el destino del botón "Gestionar" de la
> tarjeta de suscripción del dashboard hub (antes devolvía 404).

## Estructura de componentes

```
src/components/app/configuration/
├── ConfigurationModule.tsx          # Hub: tarjetas de sección + atajos por módulo
├── ConfigurationHeader.tsx          # Encabezado estándar de sección
└── locations/
    ├── LocationsModule.tsx          # Contenedor: lista, empty state, alta/edición, toasts
    ├── LocationCard.tsx             # Card: estado, funciones, contacto, presencia pública
    └── LocationFormDialog.tsx       # Alta/edición: datos + "¿Qué sucede aquí?" + ficha pública

src/app/app/[slug]/configuracion/
├── page.tsx                         # Hub
├── ubicaciones/page.tsx             # Ubicaciones
└── facturacion/page.tsx             # Datos fiscales (wrapper de BillingSettingsModule)
```

## Modelo de datos (mock)

Ubicación: `src/lib/mock/locations.ts`

- **`LocationFunctionKey`** — 8 funciones configurables: `atencion`, `pos`,
  `inventario`, `preparacion`, `recojo`, `delivery`, `citas`, `presencia`.
- **`LOCATION_FUNCTIONS`** — Catálogo con `label` y `description` por función
  (usado en el dialog y en las cards).
- **`WorkspaceLocation`** — Entidad ubicación. Extiende `OrganizationBranch`
  (`id`, `organizationId`, `name`, `status`, `isPrimary`, `address`, `phone`,
  `openingHours`) y agrega `functions` y `publicProfile`.
- **`LocationPublicProfile`** — Ficha pública opcional: `published`, `headline`,
  `description`, `coverImage`.
- **`seedLocations()`** — Semilla desde `dashboardBranches` (mismos ids, para no
  romper el contexto) con funciones coherentes por organización.

Store: `src/stores/locations-store.ts`

- `upsertLocation` (alta y edición), `removeLocation`, `toggleFunction`,
  `togglePublished`, `setPrimary`, `locationsByOrganization`.

## Integración con el contexto del workspace

`locations-store` es la **fuente de verdad de ubicaciones** del workspace:

- `src/hooks/use-workspace-context.ts` consume `locations` en lugar de
  `dashboard-store.branches` y las entrega a `buildWorkspaceContext` (una
  `WorkspaceLocation` es compatible con `OrganizationBranch`).
- Consecuencia: altas, ediciones, publicación y eliminaciones se reflejan
  de inmediato en el selector de ubicación del sidebar (Vista general +
  ubicaciones permitidas por alcance) y en las vistas dependientes del contexto
  (Reportes, Resumen).

`dashboard-store.branches` se mantiene para los conteos del dashboard hub
(suscripción/onboarding) y `team-store.branches` para la asignación de
ubicaciones de roles; ambos parten de los mismos ids de semilla.

## Reglas de negocio (mock)

- **Entidad flexible, sin tipos rígidos**: no hay "sucursal" ni "almacén" como
  tipos; una ubicación combina las funciones que el Owner marque. Un almacén es
  simplemente una ubicación con `inventario`.
- **Funciones mínima**: al crear, se preseleccionan `atencion` y `pos`.
- **Ubicación principal**: única por organización. Al crearse o marcarse
  principal, las demás quedan desmarcadas; al eliminarla se promueve la
  primera ubicación activa restante.
- **Ficha pública opcional**: `published` es independiente de las funciones
  (puede ser privada y aun así tener funciones de operación).
- **Visibilidad por permisos**: el módulo `configuracion` requiere al menos
  `view` en el módulo; los roles sin acceso no ven el ítem en el sidebar
  (verificado con Fonda La Abuela, rol Vendedor).

## Verificación realizada

- `npx tsc --noEmit --pretty` → limpio.
- HTTP 200 en `/configuracion`, `/configuracion/ubicaciones` y
  `/configuracion/facturacion` (las-rocas, cafe-del-valle, fonda-la-abuela).
- Flujo probado en navegador: alta de ubicación (aparece en el selector del
  sidebar), edición precargada, publicación desde la card, contador de activas.
- Sidebar de Fonda La Abuela (MEMBER → Vendedor) no muestra Configuración.
