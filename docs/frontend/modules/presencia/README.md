# Módulo Constructor Web / Mi sitio web (`/app/:slug/presencia`)

> Roadmap **tarea 24 · Fase 7 (Presencia y canales)**. Prototipo frontend (datos mock en Zustand).

Constructor de sitios por bloques. El negocio arma su página sin programar, y
el catálogo de Zentro alimenta la tienda automáticamente.

## Fuente de la spec

Todo el modelo sale de la documentación de Notion, no de criterio propio:

- `.notion/Zentro/04 - Modelo de Dominio/Capacidades/Constructor Web`
- `.notion/Zentro/04 - Modelo de Dominio/Capacidades/Blog`
- `.notion/Zentro/05 - Arquitectura Funcional/Mapa de Navegación`

Cada decisión del módulo está anotada en el código con la regla que la obliga
(`R1`…`R8` de Constructor Web, o `regla N de Blog`).

## Decisiones que la spec impone

### El sitio es de la organización, no de una sucursal

La spec dice que el sitio "no pertenece a una sucursal". Por eso
`WebPresenceModule` **no usa `activeLocation`**: el módulo ignora el selector de
ubicación a propósito. El resto de módulos sí dependen de él.

### Editar no es publicar (R3)

> "Los cambios se editan en un entorno de desarrollo y se publican manualmente."

Es la regla que estructura todo el módulo. El sitio tiene `lastPublishedAt` y
cada página `updatedAt`. Lo editado después del último publish está **pendiente**,
y el visitante del sitio público no lo ve hasta que alguien pulsa Publicar.

Esto se ve en la UI de tres formas: el botón del encabezado dice
`Publicar N cambios` (o `Todo publicado`, deshabilitado), el KPI "Pendiente de
publicar" marca la diferencia, y hay un botón Publicar por página.

En la semilla, **Las Rocas tiene 1 cambio pendiente**: la página *Contacto* dice
`status: "publicado"` pero su `updatedAt` (26-sep) es posterior al
`lastPublishedAt` (28-ago). Es el caso que demuestra la regla mejor que ninguna
explicación.

### Publicar el catálogo NO habilita carrito ni pedidos (R7)

> "Publicar un catálogo no obliga a habilitar carrito, pagos, inventario ni pedidos."

Por eso este módulo **no toca** `acceptsOrders` del canal "Sitio web" de
`channels.ts`. Publicar la página y abrir el canal de venta son dos decisiones
separadas y el usuario las toma en lugares distintos. Es intencional que no estén
acopladas.

### Dominio según el plan (R2)

> "El sitio se publica en dominio personalizado o subdominio zentro.app según el plan."

`DOMAIN_RULE_BY_PLAN` resuelve contra el plan real de la organización (vía
`dashboardSubscriptions` → `dashboardPlans`):

| Plan | Dominio |
|---|---|
| Esencial | Solo `subdominio.zentro.app` |
| Crecimiento | Subdominio **o** dominio propio |

Cuando el plan no lo permite, el botón "Dominio propio" se muestra **deshabilitado
con el motivo escrito** ("Disponible en el plan Crecimiento") en vez de
ocultarse, para que se entienda por qué.

> ⚠️ **Supuesto propio:** Notion dice "según el plan" sin decir cuál es el plan
> que incluye dominio propio. La asignación de la tabla es mía. Si el comercial
> decide otra cosa, es cambiar una línea en `DOMAIN_RULE_BY_PLAN`.

### Nada de HTML, CSS o JS propio

> "No se permite inyección de HTML, CSS o JS personalizado por razones de seguridad."

`SiteTheme` es un tipo de **tokens** (colores, fuente, escala, espaciado, logo).
No existe ningún campo donde escribir código o una cadena de estilo. El preview
aplica los tokens con `style` inline de valores de color definidos en el modelo.

## Bloques

Los 10 de la spec, con configuración propia según el tipo:

| Bloque | Configurable |
|---|---|
| Encabezado, Hero | Título, subtítulo, botón, imagen |
| Catálogo | Título y cantidad; **los productos vienen de Zentro** (R5) |
| Producto | Galería y botón de compra |
| Formulario | Título; se conecta a Formularios |
| Blog | Título y cantidad; **los artículos vienen de Blog** (R5) |
| Testimonios, Galería, FAQ | Título e items |
| Footer | Dirección, teléfono, redes |

R5 ("el catálogo y blog se sincronizan automáticamente") es la razón de que
`catalogo` y `blog` no guarden datos propios: son punteros, no copias.

Cada bloque se puede ocultar sin eliminarlo, y reordenar con ↑/↓.

## Por qué NO hay drag & drop

La spec lo pide ("los bloques se arrastran y sueltan") y también pide "vista
previa en tiempo real". En un prototipo con datos mock, un constructor visual
arrastrable es mucho trabajo y no demuestra nada que el preview no muestre. La
decisión: **lista de bloques reordenable con ↑/↓ + preview de solo lectura**.
Está registrado en `issues.md`.

## Arquitectura

| Archivo | Rol |
|---|---|
| `src/lib/mock/web-presence.ts` | `WebSite`, `SitePage`, `SiteBlock` (union discriminada), `SiteTheme`, `SITE_TEMPLATES`, `SITE_OBJECTIVES`, `DOMAIN_RULE_BY_PLAN`, semilla. |
| `src/stores/web-presence-store.ts` | Mutaciones. `publish` es explícita y separada del resto. |
| `src/components/app/presencia/WebPresenceModule.tsx` | Contenedor: guard, KPIs, tabs, botón de publicación. |
| `src/components/app/presencia/PresenceKPI.tsx` | Páginas, bloques, borradores, pendientes de publicar. |
| `src/components/app/presencia/SiteTab.tsx` | Objetivos del sitio y dominio público. |
| `src/components/app/presencia/PagesTab.tsx` | Lista de páginas + constructor por bloques. |
| `src/components/app/presencia/BlockEditor.tsx` | Campos de texto por tipo de bloque. |
| `src/components/app/presencia/AddBlockMenu.tsx` | Menú de alta de bloques. |
| `src/components/app/presencia/PagePreview.tsx` | Preview de solo lectura con los tokens del tema. |
| `src/components/app/presencia/DesignTab.tsx` | Plantillas + tokens de personalización. |
| `src/components/app/presencia/shared/PresenceTabs.tsx` | Tabs (patrón de `AgendaSettingsNav`). |
| `src/app/app/[slug]/presencia/page.tsx` | Ruta. |

## Una trampa de Zustand que conviene no pisar

El store **no expone** selectores que devuelvan arrays derivados
(`pagesByOrganization`, `pendingPages`). Sequitaron a propósito:

> Una función tiene identidad estable. Si un componente hace
> `useStore(s => s.pendingPages)` y memoriza sobre esa función, el `useMemo`
> nunca vuelve a correr cuando cambia el store, y la vista queda desactualizada.
> Pasó durante el desarrollo: tras publicar, el botón seguía diciendo
> "Publicar 1 cambio".

Los componentes se suscriben a `sites` / `pages` (los arrays crudos, cuya
identidad sí cambia) y derivan ellos mismos.

## Permisos

Clave `presencia` (ya existía en `team.ts`, label "Sitio web", dominio
`presencia`). Requiere `admin` o `operate`. Roles estándar quedan en `none`.

## Cómo probarlo

1. `/app/las-rocas/presencia` (Owner): 3 páginas, 4 bloques en la portada,
   botón **"Publicar 1 cambio"**.
2. Pulsar **Publicar** → el botón pasa a **"Todo publicado"** (deshabilitado) y el
   KPI "Pendiente de publicar" baja a 0.
3. Pestaña **Páginas** → la portada muestra 4 bloques; el primero tiene "Subir"
   deshabilitado. Probar ↑/↓, ocultar y eliminar.
4. **Agregar bloque** → agregar un FAQ → "Editar contenido" → cambiar el título.
5. **Vista previa** → debe verse la portada con los colores de la plantilla
   *Moderna* y el catálogo con placeholders.
6. Pestaña **Diseño** → aplicar *Clásica* → volver a **Vista previa**: cambian
   colores y tipografía.
7. `/app/cafe-del-valle/presencia` (plan Crecimiento): "Dominio propio"
   **habilitado** con `cafedelvalle.pe`.
8. `/app/las-rocas/presencia` (plan Esencial): "Dominio propio" **deshabilitado**
   con el motivo visible.
9. `/app/fonda-la-abuela/presencia` (Vendedor): "Sin acceso al sitio web".

## Lo que quedó fuera

Ver `issues.md`. Lo más relevante: Blog es un módulo aparte (decisión de scope),
no hay drag & drop ni preview en tiempo real, no hay persistencia, y el guard es
solo de UI.