# Reportes — Issues del módulo

## Frontend

- [x] Vista consolidada global con selector de período
- [x] Filtro por ubicación activa del workspace (caja vía sesión y citas; el resto global en el mock)
- [x] KPIs: ventas, pedidos, ticket promedio, clientes activos
- [x] Serie de ventas por día
- [x] Distribución por canal y por método de pago
- [x] Pedidos por estado y por tipo de servicio
- [x] Rentabilidad estimada y top productos
- [x] Stock crítico y valor de inventario
- [x] Compras por proveedor
- [x] Top clientes y clientes nuevos
- [x] Citas por estado
- [x] Exportación mock (CSV + PDF) del período
- [x] Estado vacío por período sin datos
- [ ] Gráficos interactivos (tooltips, zoom) — opcional, sin fecha

## Backend / Integración

- [ ] Consultas agregadas reales con SQL/Prisma (GROUP BY por día, canal, método, estado)
- [ ] Filtro por ubicación/canal autoritativo con permisos de servidor
- [ ] Cálculo de rentabilidad con costo real de compras y ajustes de inventario
- [ ] Reporte PDF real generado en servidor
- [ ] Programación/exportación de reportes por correo
- [ ] Métricas en tiempo real del POS y sesiones de caja activas
- [ ] Auditoría de acceso a reportes (quién consultó, desde dónde)

## Consistencia entre módulos

- [x] Ventas alineadas con Pedidos y Caja (misma semántica de pago registrado)
- [x] Facturación anulada no suma a los indicadores
- [ ] Conectar métricas de Reportes con el Overview del workspace (dashboard) cuando exista
- [ ] Reconciliar gastos de Caja con compras pagadas (proveedor)