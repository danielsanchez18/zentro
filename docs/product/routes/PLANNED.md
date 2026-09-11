# Páginas planificadas del workspace

Estas rutas aparecen en el alcance o sidebar, pero todavía no cuentan con una página funcional.

## Clientes y servicios

### `/app/[slug]/clientes` — CRM

- Perfil unificado del cliente, contacto, direcciones, consentimientos, pedidos, pagos, citas y actividad por canal.
- Vista global con filtrado por alcance; los miembros locales solo ven relaciones autorizadas.

### `/app/[slug]/agenda`

- Calendario de citas, disponibilidad, profesionales, recursos y ubicaciones.
- Debe funcionar para citas presenciales u online y para negocios sin inventario.

### `/app/[slug]/formularios`

- Formularios de captación, contacto, reservas y solicitudes.
- Publicación o asociación por canal; respuestas integradas con CRM.

## Finanzas

### `/app/[slug]/caja`

- Apertura, movimientos, arqueo, cierre y diferencias por terminal/ubicación.
- Módulo estrictamente local.

### `/app/[slug]/facturacion`

- Comprobantes, notas, estados, cliente fiscal y trazabilidad al pedido/pago.
- Vista global con filtros; proveedor fiscal e integración pendientes.

### `/app/[slug]/reportes`

- Ventas, pedidos, rentabilidad, inventario, compras, clientes, citas y canales.
- Consolidado para usuarios globales y filtro por ubicación/canal.

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

### `/app/[slug]/configuracion`

- Centro guiado de configuración, progreso y recomendaciones.
- Datos del negocio, capacidades, canales, seguridad, facturación y accesos delegables.

### `/app/[slug]/configuracion/ubicaciones`

- Crear y configurar ubicaciones flexibles, funciones, privacidad, horarios, cobertura, surtido y miembros.

### `/app/[slug]/auditoria`

- Historial de cambios con actor, acción, entidad, contexto, fecha y motivo.
- Vista global o filtrada según alcance; registros inmutables en backend.

