# Issues — Facturación

## FRONTEND — prototipo mock

- [x] Crear estructura de componentes: `src/components/app/billing/`
- [x] Crear mock data: `src/lib/mock/billing.ts`
- [x] Crear Zustand store: `src/stores/billing-store.ts`
- [x] Implementar overview con KPIs, búsqueda, filtros y paginación
- [x] Implementar detalle de comprobante con estado, ítems, totales y trazabilidad
- [x] Implementar emisión mock de boleta/factura desde pedido pagado
- [x] Implementar notas de crédito y débito
- [x] Implementar cliente fiscal (herencia desde pedido/CRM + registro manual)
- [x] Implementar filtros por estado, tipo, rango de fechas y método de pago
- [x] Implementar exportación mock a PDF (toast + vista previa de plantilla)
- [x] Implementar historial de comprobantes por sesión de caja
- [x] Crear rutas: `/app/[slug]/facturacion`, `/app/[slug]/facturacion/[invoiceId]`
- [x] Snapshot de configuración fiscal al emitir (regla 44)
- [x] Saldo vigente por notas de crédito/débito en detalle (regla 26)
- [x] KPI "Total emitido" neto considerando notas
- [x] Documentar cierre de prototipo en PROGRESS.md

## BACKEND — integración

- [ ] Definir esquema Prisma: `Invoice`, `InvoiceItem`, `InvoiceNote`, `FiscalConfig`
- [ ] Implementar CRUD de comprobantes con correlativos secuenciales
- [ ] Implementar emisión con validación de datos fiscales
- [ ] Implementar notas de crédito/débito con referencia a comprobante original
- [ ] Implementar estados: emitido, enviado, pagado, anulado
- [ ] Implementar snapshot de configuración fiscal al emitir
- [ ] Implementar vinculación con pedidos y pagos
- [ ] Implementar vinculación con sesiones de caja
- [ ] Implementar generación de PDF con datos fiscales
- [ ] Implementar envío por correo electrónico
- [ ] Implementar permisos: emitir, anular, ver, exportar

## INTEGRACIÓN — cross-module

- [ ] POS: reemplazar emisión mock por llamada a Facturación
- [ ] Órdenes: agregar campo `invoiceId` al pedido
- [ ] Caja: agregar referencia `invoiceId` a movimientos de venta
- [ ] CRM: consultar datos fiscales del cliente al emitir
- [ ] Configuración: agregar sección de configuración fiscal
- [ ] Reportes: agregar métricas de comprobantes emitidos, IGV recaudado

## PROVEEDOR FISCAL — futuro

- [ ] Integrar con proveedor de facturación electrónica (SUNAT, etc.)
- [ ] Implementar envío de XML firmado
- [ ] Implementar validación de respuesta del proveedor
- [ ] Implementar reintento en caso de rechazo
- [ ] Implementar consulta de estado de comprobante ante proveedor

## QA

- [x] Validar que no se pueda emitir comprobante sin pedido asociado (flujo: emisión solo desde pedido pagado)
- [x] Validar que no se pueda emitir comprobante sin pago registrado (botón emitir deshabilitado sin pago)
- [x] Validar que no se pueda emitir factura sin datos fiscales completos (validación y mensajes en diálogo)
- [x] Validar que el número correlativo sea secuencial y no editable (auto-generado, avanza la secuencia)
- [x] Validar que las notas de crédito no excedan el monto del comprobante original (límite en diálogo)
- [x] Validar que la anulación requiera motivo (diálogo de anulación)
- [x] Validar que los comprobantes anulados no tengan efecto fiscal (excluidos de KPIs)
- [x] Validar que la configuración fiscal snapshot se conserve en comprobantes emitidos (fiscalSnapshot) 
- [x] Validar que la config fiscal incompleta impida facturas y explique el motivo (mensajes al usuario)
