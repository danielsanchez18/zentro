# Facturación

## Objetivo

Facturación emite, almacena y administra comprobantes de pago (boletas, facturas, notas de crédito/débito) vinculados a pedidos y pagos. Centraliza la trazabilidad fiscal del negocio, conectando ventas, cobros y datos del cliente para cumplimiento tributario.

## Alcance del prototipo

1. Overview global de comprobantes con búsqueda y filtros.
2. Detalle de comprobante con estado, ítems, totales y trazabilidad al pedido/pago.
3. Emisión mock de boleta y factura desde pedido pagado.
4. Estados del comprobante: emitido, anulado, enviado, pagado.
5. Notas de crédito y débito como complementos.
6. Cliente fiscal: RUC, razón social, dirección fiscal, correo electrónico.
7. Filtros por estado, tipo de comprobante, rango de fechas y método de pago.
8. Exportación mock a PDF.
9. Historial de comprobantes por sesión de caja.

## Decisiones

- Facturación es un módulo **global** (no atado a ubicación/terminal).
- Un comprobante siempre referencia al menos un pedido y su pago asociado.
- La emisión de comprobante es **post-pago**: solo se genera después de que el pedido tiene estado "pagado" o "parcial".
- Los comprobantes se pueden emitir desde el detalle del pedido, desde el POS al cobrar, o manualmente desde Facturación.
- El cliente fiscal es obligatorio para facturas (RUC de 11 dígitos + razón social + dirección fiscal) y para boletas (DNI de 8 dígitos o RUC de 11 dígitos + nombre completo).
- La emisión hereda datos fiscales del cliente desde el CRM cuando el pedido tiene cliente vinculado; de lo contrario se registran manualmente en el diálogo.
- La configuración fiscal del negocio debe estar completa antes de emitir **facturas**; una config incompleta bloquea la emisión y explica los requisitos en el diálogo (no afecta boletas).
- Cada comprobante guarda un **snapshot de la configuración fiscal** al momento de emitir; un cambio posterior no altera comprobantes ya emitidos.
- Las notas de crédito anulan o reducen el monto de un comprobante original (reflejado como saldo vigente y en el KPI neto).
- Las notas de débito incrementan el monto de un comprobante original.
- Las secuencias correlativas (B001/F001/NC001/ND001) avanzan automáticamente tras cada emisión y se muestran en Configuración.
- El proveedor de facturación electrónica (SUNAT, etc.) está pendiente de integración.
- Los comprobantes en estado "anulado" conservan el registro pero no tienen efecto fiscal.

## Estado

**Prototipo frontend cerrado.** Overview con KPIs netos, búsqueda, filtros (tipo, estado, método de pago, rango de fechas, sesión de caja) y paginación; detalle con línea de tiempo emitido → enviado → pagado → anulado, ítems, totales, saldo vigente por notas, trazabilidad y snapshot fiscal; emisión unificada desde Pedidos que registra el comprobante en Facturación; notas de crédito/débito con secuencia propia; configuración fiscal con correlativos secuenciales e IGV configurable.

Ver [reglas](./rules.md), [integraciones](./integrations.md) e [issues](./issues.md).
