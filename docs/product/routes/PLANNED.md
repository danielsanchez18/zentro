# Páginas planificadas del workspace

Estas rutas aparecen en el alcance o sidebar, pero todavía no cuentan con una página funcional.

## Clientes y servicios

## Finanzas

### `/app/[slug]/facturacion`

- Comprobantes, notas, estados, cliente fiscal y trazabilidad al pedido/pago.
- Vista global con filtros; proveedor fiscal e integración pendientes.

### `/app/[slug]/reportes`

- Ventas, pedidos, rentabilidad, inventario, compras, clientes, citas y canales.
- Consolidado para usuarios globales y filtro por ubicación/canal.
- **Estado:** prototipo frontend cerrado (ver `docs/frontend/modules/reportes/`).

## Presencia y canales

### `/app/[slug]/canales`

- Conectar, configurar, pausar y diagnosticar POS, Web Zentro, Marketplace, venta manual, redes sociales y futuras integraciones.
- Cada canal define cómo se asignan sus pedidos a una ubicación.

### `/app/[slug]/presencia` — CMS/Sitio web

- Constructor rápido del canal Web: identidad, páginas, navegación, contenido, catálogo y publicación.
- Blog será una sección interna del CMS, no la ruta principal `/blog`.

### `/app/[slug]/marketing`

- Campañas, audiencias, contenidos, promociones y rendimiento por canal.

### `/app/[slug]/marketplace`

- Ficha general del negocio, publicación, mapa y fichas públicas opcionales de ubicaciones.
- Puede publicarse sin catálogo; siempre requiere confirmación explícita.

## Administración

Las rutas de administración se movieron a [WORKSPACE.md](./WORKSPACE.md) porque
ya tienen prototipo funcional:

- `/app/[slug]/configuracion` y `/app/[slug]/configuracion/ubicaciones` →
  [WORKSPACE.md](./WORKSPACE.md#appslugconfiguracion).
- `/app/[slug]/auditoria` →
  [WORKSPACE.md](./WORKSPACE.md#appslugauditoria).

Pendiente en backend (no es ruta nueva): historial de cambios inmutable con
actor, acción, entidad, contexto, fecha y motivo, con vista filtrada según el
alcance del rol.
