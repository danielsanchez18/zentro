# Reportes

## Objetivo

Reportes consolida la actividad del negocio en una vista global de indicadores: ventas, pedidos, rentabilidad, inventario, compras, clientes, citas y canales. Es un módulo de lectura que agrega la información producida por los demás módulos (Pedidos, Caja, Facturación, Inventario, Compras, CRM y Agenda) para responder "¿cómo le está yendo al negocio?".

## Alcance del prototipo

1. Vista consolidada global (para OWNER/ADMIN) con selector de período (hoy, 7, 30, 90 días, todo).
2. KPIs principales: ventas totales, pedidos, ticket promedio y clientes activos.
3. **Ventas**: serie por día, distribución por canal (POS/Web/Marketplace) y por método de pago.
4. **Pedidos**: distribución por estado y por tipo de servicio (mesa, recojo, delivery).
5. **Rentabilidad**: margen bruto estimado por producto (precio venta − costo unitario) y top productos.
6. **Inventario y compras**: stock crítico (bajo/agotado), valor del inventario y compras por proveedor.
7. **Clientes y citas**: top clientes por gasto, clientes nuevos por período y citas por estado.
8. Exportación mock a PDF/CSV (botón de descarga local con datos del período).

## Decisiones

- Reportes es un módulo **global** de solo lectura: no crea, edita ni elimina datos; agrega los mocks existentes.
- Globalidad heredada del contexto del workspace: quien tiene "Vista general" (OWNER/ADMIN) ve el consolidado; una ubicación activa filtra los datos con `locationId` cuando el dato lo tiene.
- El prototipo calcula **todo desde los mocks locales** (`orders`, `cashMovementsMock`, `crmCustomers`, `inventoryItems`, `purchaseOrders`, `appointments`, `invoices`); no hay llamadas de red ni backend.
- Las ventas se calculan sobre pedidos con pago registrado (estado `pagado` o `parcial`), excluyendo cancelados/reembolsados; los comprobantes anulados no suman a facturación.
- El ticket promedio es `ventas totales / número de pedidos` del período.
- El margen bruto del prototipo es estimado: usa `unitCost` del inventario como costo de venta y el `subtotal` de la línea del pedido como ingreso.
- La visualización usa barras de progreso y bloques de serie hechos con divs/tailwind, sin librerías de gráficos nuevas (no se instalan dependencias).
- El período se aplica a métricas con fecha (`createdAt`/`issuedAt`/`lastOrderAt`); métricas de estado (stock, inventario) se muestran siempre como "al momento".

## Estado

**Planificado → en construcción.** Este documento define alcance y decisiones del módulo. La página `/reportes` y la sección `docs/frontend/modules/reportes/` se crean en esta iteración.

Ver [reglas](./rules.md) e [issues](./issues.md).