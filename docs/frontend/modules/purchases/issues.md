# Compras — pendientes e issues

Este documento concentra decisiones que no bloquean el diseño inicial, pero deben resolverse antes de producción.

## Dominio y backend

- [ ] Definir correlativos por organización y sucursal.
- [ ] Definir impuestos, descuentos, redondeo y monedas soportadas.
- [ ] Definir contratos de órdenes, líneas, recepciones y pagos.
- [ ] Resolver concurrencia e idempotencia al confirmar recepciones.
- [ ] Aplicar permisos para crear, enviar, recibir, cancelar y eliminar borradores.
- [ ] Registrar auditoría inmutable de cambios y recepciones.

## Integraciones

- [ ] Obtener proveedores y productos desde servicios reales.
- [ ] Generar entradas persistidas en Inventario al confirmar recepciones.
- [ ] Definir la actualización del costo promedio o último costo.
- [ ] Integrar comprobantes, pagos y cuentas por pagar.

## QA

- [ ] Validar estados vacíos, errores y reintentos.
- [ ] Probar órdenes con recepciones parciales y múltiples.
- [ ] Probar formatos monetarios, fechas y zonas horarias.
- [ ] Ejecutar QA responsive en escritorio y teléfono.
