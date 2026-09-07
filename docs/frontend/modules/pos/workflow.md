# Punto de venta — flujo funcional

## Flujo principal

```text
sesión disponible
  → elegir atención y cliente
  → agregar productos
  → revisar stock, variantes y notas
  → aplicar promociones/descuento autorizado
  → cobrar
  → emitir comprobante
  → crear pedido
  → abrir Pedidos o iniciar una nueva venta
```

## Terminal

La pantalla se divide en un explorador de productos y un carrito persistente. En teléfono, el carrito se abre como panel inferior y conserva un resumen fijo con unidades y total.

El explorador incluye búsqueda, categorías, disponibilidad y cards compactas. Agregar un producto con variantes abre su selector; uno sin variantes se agrega directamente.

## Carrito

Cada línea permite:

- Cambiar cantidad dentro del stock disponible.
- Seleccionar variante.
- Añadir una nota de preparación.
- Quitar el producto.
- Mostrar precio base, descuento de línea y total.

El resumen distingue subtotal, promociones, descuento directo, delivery, impuestos futuros, total, pagado, saldo y vuelto.

## Atención y cliente

- `mesa`: requiere mesa o identificador de atención.
- `recojo`: requiere nombre o cliente y hora estimada.
- `delivery`: requiere cliente, teléfono y dirección.

El cliente puede ser invitado. Los datos capturados desde POS no se convertirán automáticamente en un registro CRM hasta definir el contrato de integración.

## Descuentos

Las promociones elegibles se evalúan automáticamente. El operador puede quitar una promoción si la regla lo permite. El descuento directo admite importe o porcentaje, requiere motivo y dependerá de permisos en producción.

El pedido conserva por separado el snapshot de promociones y el descuento manual.

## Cobro

El operador agrega uno o varios pagos hasta cubrir el total. Efectivo calcula vuelto; medios electrónicos admiten referencia. Se puede retirar un pago antes de confirmar.

La venta solo se confirma cuando los datos de atención son válidos y el monto recibido cubre el total. Al confirmar se crea el pedido, se registra el movimiento de caja futuro y se solicita el comprobante.

## Resultado

La confirmación muestra número de pedido, total, pagos, comprobante y acciones para imprimir/descargar, abrir el pedido o iniciar otra venta.

## Ventas suspendidas

Una venta puede guardarse temporalmente con nombre o referencia. Puede recuperarse o descartarse, pero no se considera pedido, cobro ni reserva de inventario hasta confirmarse.
