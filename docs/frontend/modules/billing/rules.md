# Reglas de negocio — Facturación

## Comprobantes

1. Un comprobante es un registro fiscal que referencia al menos un pedido y su pago asociado.
2. Tipos de comprobante: boleta (personas naturales) y factura (personas jurídicas).
3. Cada comprobante tiene un número correlativo secuencial por tipo (B001-0001, F001-0001).
4. Un comprobante puede estar en uno de los siguientes estados: emitido, enviado, pagado, anulado.
5. Un comprobante en estado "emitido" puede enviarse por correo al cliente.
6. Un comprobante en estado "pagado" está completo y no acepta modificaciones.
7. Un comprobante en estado "anulado" conserva el registro pero no tiene efecto fiscal.
8. La anulación de un comprobante requiere motivo y registro en el historial.
9. Un comprobante puede contener múltiples ítems (productos/servicios) con cantidad, precio unitario, descuento y subtotal.
10. El IGV se calcula por ítem según la tasa vigente (18% en Perú).
11. El total del comprobante es la suma de subtotales + IGV.
12. Un comprobante puede tener descuento global antes del cálculo de IGV.
13. La moneda del comprobante se hereda del pedido (PEN por defecto).
14. Un comprobante genera un PDF descargable con los datos fiscales completos.

## Cliente fiscal

15. Para emitir factura es obligatorio: RUC (11 dígitos), razón social y dirección fiscal.
16. Para emitir boleta es obligatorio: DNI o RUC, nombre completo.
17. El correo electrónico del cliente es opcional pero necesario para envío por correo.
18. El cliente fiscal puede ser registrado nuevo o seleccionado del CRM.
19. Si el cliente del pedido ya tiene datos fiscales en CRM, se heredan al comprobante.
20. La edición de datos fiscales del cliente no afecta registros anteriores.

## Notas de crédito

21. Una nota de crédito referencia un comprobante original y reduce o anula su monto.
22. Tipos de nota de crédito: descuento, devolución, anulación del comprobante.
23. Una nota de crédito genera un nuevo comprobante con número correlativo propio (NC001-0001).
24. El monto de la nota de crédito no puede exceder el monto del comprobante original.
25. Una nota de crédito anulación cambia el estado del comprobante original a "anulado".
26. Una nota de crédito parcial reduce el saldo del comprobante original.

## Notas de débito

27. Una nota de débito referencia un comprobante original e incrementa su monto.
28. Tipos de nota de débito: recargo, intereses, penalidades.
29. Una nota de débito genera un nuevo comprobante con número correlativo propio (ND001-0001).
30. El monto de la nota de débito no puede exceder un porcentaje configurable del comprobante original.

## Integración con pedidos

31. Un pedido con estado "pagado" o "parcial" puede generar comprobante.
32. Un pedido solo puede tener un comprobante principal (boleta o factura).
33. Si el pedido tiene múltiples pagos, el comprobante consolida el total pagado.
34. La emisión de comprobante no modifica el estado del pedido.
35. El comprobante hereda la fecha de emisión del pedido como fecha de venta.

## Integración con caja

36. Cada pago registrado en Caja que genere comprobante referencia el ID del comprobante.
37. El historial de comprobantes puede filtrarse por sesión de caja.
38. Los movimientos de tipo "venta" en Caja pueden vincularse a un comprobante específico.

## Permisos

39. Emitir comprobante requiere permiso de facturación en la organización.
40. Anular comprobante requiere permiso de facturación + nivel de autorización adicional.
41. Ver comprobantes requiere permiso de facturación o de lectura de ventas.
42. Exportar PDF no requiere permisos adicionales (solo lectura).

## Configuración fiscal

43. La configuración fiscal (RUC, razón social, dirección, logo) se define en Configuración del negocio.
44. Un cambio de configuración fiscal no afecta comprobantes ya emitidos.
45. El sistema debe validar que la configuración fiscal esté completa antes de emitir factura.

## Validaciones

46. No se puede emitir comprobante sin pedido asociado.
47. No se puede emitir comprobante sin pago registrado.
48. No se puede emitir factura sin datos fiscales del cliente (RUC, razón social, dirección).
49. No se puede emitir comprobante si la configuración fiscal del negocio está incompleta.
50. El número correlativo se genera automáticamente y no es editable.
