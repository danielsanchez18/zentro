# Módulo Canales de venta (`/app/:slug/canales`)

> Roadmap **tarea 22 · Fase 7 (Presencia y canales)**. Prototipo frontend (datos mock en Zustand).

Entidad propia que unifica los "canales" que estaban dispersos en **tres unions
distintas** y separa lo que son dos conceptos diferentes.

## El problema que resuelve

El término "canal" significaba cosas distintas según el módulo:

| Origen | Tipo | Valores |
|---|---|---|
| `OrderChannel` (`orders.ts`) | union | `pos \| web \| marketplace` |
| `CustomerChannel` (`crm.ts`) | union | `pos \| web \| marketplace \| whatsapp \| manual` |
| `FormChannel` (`forms.ts`) | union | `web \| enlace \| marketplace \| interno` |

Nadie gobernaba el concepto. Reportes solo agregaba lo que Pedidos le pasaba.

## La distinción: propio vs. integración

Es la decisión central del módulo. **Un canal y una integración no son lo mismo:**

- **Canal propio** (`kind: "native"`): el pedido **nace dentro de Zentro**
  (POS, sitio web, Marketplace Zentro). Zentro es la fuente de verdad → se
  **activa/desactiva** con un toggle.
- **Integración externa** (`kind: "external"`): el pedido **nace afuera**
  (WhatsApp, TikTok, Instagram, Shopify, Mercado Libre). Zentro se conecta,
  sincroniza y consume → tiene **estado de conexión**
  (`no_disponible`, `desconectado`, `conectando`, `conectado`, `error`),
  cuenta externa, capacidades y `lastSyncAt`. **No es un toggle.**

Por eso una integración futura necesita credenciales y webhooks, y el modelo ya
tiene la forma para recibirlos sin rediseñar la entidad.

## Integraciones externas (catalogadas, no conectables)

Las cinco plataformas están **visibles pero deshabilitadas** con sus capacidades
declaradas. `available: false` en `INTEGRATION_CATALOG` es lo que las muestra
como "Próximamente".

| Plataforma | Capacidades declaradas |
|---|---|
| WhatsApp | pedidos, clientes |
| TikTok | productos, pedidos, inventario |
| Instagram | productos, pedidos, clientes |
| Shopify | productos, pedidos, pagos, inventario |
| Mercado Libre | productos, pedidos, pagos |

Cuando exista el conector: se cambia `available` a `true`, se implementa la
conexión y el canal aparece en la lista con su estado real.

## Permisos

Clave nueva `canales` en `PermissionModuleKey` (antes no existía; se convivía con
`marketplace`):

| Rol | Nivel |
|---|---|
| Owner | `admin` (automático desde el catálogo) |
| Administrador | `admin` |
| Contenido y canales | `operate` |
| Roles estándar (vendedor, cajero, etc.) | `none` |

Motivo: separar "ver Canales" de "ver Marketplace". El perfil **Contenido y
canales** puede administrar los canales de venta sin que eso le conceda acceso al
Marketplace.

## Archivos

| Archivo | Rol |
|---|---|
| `src/lib/mock/channels.ts` | Entidad `SalesChannel`, `NATIVE_CHANNELS`, `INTEGRATION_CATALOG`, `IntegrationConnection`, resolución de claves legacy y semilla. |
| `src/stores/channels-store.ts` | Estado, `upsertChannel`, `setChannelStatus`, `toggleAcceptsOrders` y selectores (`nativeChannelsByOrganization`, `externalChannelsByOrganization`, `resolveLegacyChannel`). |
| `src/components/app/channels/ChannelsModule.tsx` | Contenedor: guard, KPIs, tabla de propios e integraciones. |
| `src/components/app/channels/ChannelsKPI.tsx` | Canales activos, propios, que reciben pedidos, integraciones `x/5`. |
| `src/components/app/channels/ChannelsTable.tsx` | Tabla de canales propios con activar/desactivar y editar. |
| `src/components/app/channels/ExternalIntegrations.tsx` | Catálogo de plataformas externas. |
| `src/components/app/channels/ChannelFormDialog.tsx` | Edición (nombre, descripción, estado, pedidos entrantes). |
| `src/app/app/[slug]/canales/page.tsx` | Ruta del workspace. |

## Integración con otros módulos

- `Sidebar`: entrada "Canales de venta" en el grupo **Presencia**.
- `Breadcrumb`: etiqueta `canales: "Canales de venta"`.
- `MODULE_PERMISSION_KEY`: `"/canales": "canales"`.
- Hub de Configuración: tarjeta "Canales de venta" con el conteo de activos,
  que **cierra la promesa rota** del copy ("ubicaciones, datos fiscales y canales
  de venta") que no tenía dónde llevar.
- `orderChannelLabel` (`orders.ts`) ahora resuelve contra `NATIVE_CHANNELS`, con
  el ternario viejo como respaldo.

## Comportamiento

- **Desactivar no borra nada**: el canal deja de admitir pedidos y su historial
  queda intacto.
- **Desactivar fuerza `acceptsOrders: false`**, y el botón de pedidos entrantes
  queda deshabilitado mientras el canal está inactivo.
- **No se pueden crear canales propios**: el catálogo es cerrado (POS, sitio web,
  Marketplace). Crear tiene sentido cuando las integraciones se conecten.
- Las integraciones no son editables todavía.

## Cómo probarlo

1. `/app/las-rocas/canales` (Owner): 3 canales propios, 2 activos; 0/5 integraciones.
2. Editar "Sitio web" → desactivar "Recibe pedidos" → guardar. El KPI "Reciben pedidos" baja de 2 a 1.
3. Activar "Marketplace Zentro" → toast "Canal vuelve a admitir pedidos".
4. El Marketplace inactivo muestra "No acepta" deshabilitado.
5. `/app/fonda-la-abuela/canales` (Vendedor): "Sin acceso a los canales".
6. `/app/las-rocas/configuracion`: la tarjeta "Canales de venta" muestra el conteo real.