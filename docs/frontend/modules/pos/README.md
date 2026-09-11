# Punto de venta

**Estado del módulo:** Prototipo funcional completo; integración con backend pendiente.

## Objetivo

Permitir que un operador abra y cobre pedidos desde una ubicación activa. Abrir el pedido y registrar un pago son acciones independientes: el pedido puede quedar pendiente, recibir adelantos o pagos parciales y continuar modificándose hasta su cierre.

## Límite del módulo

POS sí se encarga de:

- Explorar y buscar productos disponibles.
- Construir el carrito y personalizar líneas.
- Seleccionar cliente y tipo de atención.
- Buscar clientes registrados y autocompletar sus datos de entrega.
- Aplicar promociones y descuentos manuales autorizados.
- Abrir un pedido sin exigir pago.
- Registrar uno o varios pagos, incluido un adelanto o pago parcial.
- Emitir comprobante cuando corresponda y crear el pedido.
- Configurar, agrupar y asignar un punto de atención.
- Suspender una venta y recuperarla durante la sesión.

POS no se encarga de:

- Administrar el ciclo posterior del pedido; corresponde a Pedidos.
- Abrir, cerrar o conciliar caja; corresponde a Caja.
- Editar catálogo, promociones o inventario.
- Administrar comprobantes históricos; corresponde a Facturación.
- Administrar la agenda; POS solo inicia la reserva y deriva su gestión a Agenda.

## Ruta y composición

| Superficie | Ruta | Propósito |
|---|---|---|
| Terminal POS | `/app/[slug]/pos` | Catálogo, carrito y cobro en una sola pantalla |
| Venta suspendida | Dialog dentro de POS | Recuperar una operación no confirmada |
| Cobro | Dialog o panel dentro de POS | Registrar un pago sin exigir cubrir el total |
| Resultado | Dialog dentro de POS | Confirmación, comprobante y acceso al pedido |

No se crearán rutas de listado o detalle de ventas dentro de POS. Pedidos, Caja y Facturación ya cubren esas consultas.

## Estructura de componentes

```text
components/app/pos/
├── terminal/
│   ├── PosModule.tsx
│   ├── PosHeader.tsx
│   ├── ProductBrowser.tsx
│   ├── ProductCard.tsx
│   ├── ProductFilters.tsx
│   └── CartPanel.tsx
├── cart/
│   ├── CartLine.tsx
│   ├── CustomerSelector.tsx
│   ├── ServiceTypeSelector.tsx
│   └── DiscountDialog.tsx
├── checkout/
│   ├── CheckoutDialog.tsx
│   ├── PaymentEntry.tsx
│   ├── ReceiptFields.tsx
│   └── SaleResultDialog.tsx
├── suspended/
│   └── SuspendedSalesDialog.tsx
├── service-points/
│   └── ServicePointDialog.tsx
└── shared/
```

## Reglas del prototipo

- La organización y sucursal activa provienen del layout.
- Solo aparecen productos activos; el stock agotado se muestra pero no puede agregarse.
- El precio y la promoción se copian al pedido como snapshot histórico.
- La cantidad no puede superar el stock disponible mock.
- Las promociones automáticas y descuentos manuales se muestran por separado.
- Un pedido puede abrirse sin pago y queda con `pago_pendiente`.
- Un cobro menor al total deja el pedido con `pago_parcial`; cubrir el saldo lo deja `pagado`.
- Los pagos múltiples pueden combinar efectivo, tarjeta, Yape, Plin o transferencia.
- El pedido puede vincularse a un punto de atención configurable de la ubicación: mesa, mostrador, cabina, silla, box u otro.
- Las mesas disponibles pueden agruparse temporalmente; el punto resultante suma sus capacidades y puede volver a separarse.
- Abrir o cobrar crea un pedido en el store mock y limpia el carrito.
- Un pedido abierto puede editarse posteriormente desde Pedidos, conservando historial de cambios.
- Una venta suspendida no reserva stock en el prototipo.

## Fases de implementación

1. Datos mock, tipos del carrito, sesión y store de POS. ✓
2. Terminal responsive con header, búsqueda, categorías y productos. ✓
3. Carrito con variantes, notas, cantidades y eliminación. ✓
4. Cliente, tipo de atención, mesa/recojo/delivery y dirección condicional. ✓
5. Descuento manual con motivo y espacio de integración para promociones. ✓
6. Apertura sin pago y checkout con adelantos, pagos parciales o combinados. ✓
7. Emisión mock de boleta/factura y creación del pedido. ✓
8. Suspender, recuperar y descartar ventas no confirmadas. ✓
9. Empty states, responsive móvil y QA técnico inicial. ✓
10. Cierre documental y separación de issues de backend. ✓
11. Configuración, selección, agrupación y acciones mock de puntos de atención. ✓
12. Ubicación en la UI de responsable de atención y cajero. Pendiente
13. Reserva de servicios integrada con Agenda y disponibilidad real. Pendiente

## Dependencias

- Catálogo: productos, variantes, categorías y precios.
- Inventario: disponibilidad y futura reserva/deducción.
- Promociones: reglas, prioridad, límites y elegibilidad.
- Pedidos: recibe la venta confirmada y continúa su operación.
- Caja: valida sesión abierta y recibe movimientos de cobro.
- Facturación: emite y conserva comprobantes reales.
- CRM: búsqueda o alta rápida de clientes y direcciones.
- Equipo: permisos para descuentos, anulaciones y cobros.

## Documentos

- [Flujo funcional](./workflow.md)
- [Issues de backend e integración](./issues.md)
