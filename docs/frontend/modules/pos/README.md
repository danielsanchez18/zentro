# Punto de venta

**Estado del módulo:** Planificado; prototipo pendiente.

## Objetivo

Permitir que un operador construya y cobre una venta rápidamente desde la sucursal activa. Al confirmar, POS genera un pedido con snapshot de productos, precios, descuentos, cliente, atención y pagos; su seguimiento posterior pertenece a Pedidos.

## Límite del módulo

POS sí se encarga de:

- Explorar y buscar productos disponibles.
- Construir el carrito y personalizar líneas.
- Seleccionar cliente y tipo de atención.
- Aplicar promociones y descuentos manuales autorizados.
- Registrar uno o varios medios de pago.
- Emitir un comprobante y crear el pedido.
- Suspender una venta y recuperarla durante la sesión.

POS no se encarga de:

- Administrar el ciclo posterior del pedido; corresponde a Pedidos.
- Abrir, cerrar o conciliar caja; corresponde a Caja.
- Editar catálogo, promociones o inventario.
- Administrar comprobantes históricos; corresponde a Facturación.

## Ruta y composición

| Superficie | Ruta | Propósito |
|---|---|---|
| Terminal POS | `/app/[slug]/pos` | Catálogo, carrito y cobro en una sola pantalla |
| Venta suspendida | Dialog dentro de POS | Recuperar una operación no confirmada |
| Cobro | Dialog o panel dentro de POS | Distribuir y confirmar pagos |
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
└── shared/
```

## Reglas del prototipo

- La organización y sucursal activa provienen del layout.
- Solo aparecen productos activos; el stock agotado se muestra pero no puede agregarse.
- El precio y la promoción se copian al pedido como snapshot histórico.
- La cantidad no puede superar el stock disponible mock.
- Las promociones automáticas y descuentos manuales se muestran por separado.
- El total pagado debe cubrir el total antes de confirmar, salvo que el negocio permita crédito en una fase futura.
- Los pagos múltiples pueden combinar efectivo, tarjeta, Yape, Plin o transferencia.
- Confirmar una venta crea un pedido en el store mock y limpia el carrito.
- Una venta suspendida no reserva stock en el prototipo.

## Fases de implementación

1. Datos mock, tipos del carrito, sesión y store de POS.
2. Terminal responsive con header, búsqueda, categorías y productos.
3. Carrito con variantes, notas, cantidades, reemplazo y eliminación.
4. Cliente, tipo de atención, mesa/recojo/delivery y dirección condicional.
5. Evaluación visual de promociones y descuento manual con motivo/permisos mock.
6. Checkout con pagos simples, parciales y combinados; cálculo de vuelto.
7. Emisión mock de boleta/factura y creación del pedido.
8. Suspender, recuperar y descartar ventas no confirmadas.
9. Empty states, navegación por teclado, responsive móvil y QA técnico.
10. Cierre documental y separación de issues de backend.

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
