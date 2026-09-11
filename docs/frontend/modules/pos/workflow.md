# Punto de venta — flujo funcional

## Flujo principal

```text
sesión disponible
  → elegir punto de atención y cliente
  → agregar productos
  → revisar stock, variantes y notas
  → aplicar promociones/descuento autorizado
  → abrir pedido sin pago o registrar cobro
  → emitir comprobante cuando corresponda
  → continuar el pedido o cerrarlo
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

- `mesa`: requiere un punto de atención; el cliente es opcional.
- `recojo`: requiere un nombre libre o un cliente registrado; la hora estimada es opcional.
- `delivery`: requiere cliente, teléfono y dirección.
- `servicio/cita`: crea el pedido y una reserva en Agenda; puede abrirse sin pago, con adelanto o con pago parcial.

Los puntos de atención pertenecen a una ubicación y no tienen tipos rígidos: pueden representar mesas, mostradores, cabinas, sillas o boxes. Pueden estar disponibles, ocupados, reservados o inactivos. Agrupar mesas es una operación temporal con historial, no una modificación destructiva de su configuración.

El selector muestra los puntos como cards operativas. La creación y edición usan un formulario modal separado. Cada punto puede habilitarse, deshabilitarse, editarse o eliminarse; si está ocupado, permite abrir el pedido asociado.

El cliente puede ser invitado. Los datos capturados desde POS no se convertirán automáticamente en un registro CRM hasta definir el contrato de integración.

Las tres modalidades permiten buscar un cliente por nombre o correo. Al seleccionar un perfil se muestra como ficha no editable y, en Delivery, se autocompletan el teléfono y la dirección guardados. Quitar la selección limpia todos los datos vinculados; escribir un nombre libre mantiene la operación como invitado.

## Descuentos

Las promociones elegibles se evalúan automáticamente. El operador puede quitar una promoción si la regla lo permite. El descuento directo admite importe o porcentaje, requiere motivo y dependerá de permisos en producción.

El pedido conserva por separado el snapshot de promociones y el descuento manual.

## Cobro

El operador puede abrir el pedido sin cobrar, registrar un adelanto, combinar pagos o cubrir el total. Efectivo calcula vuelto cuando se cubre el saldo; medios electrónicos admiten referencia. Se puede retirar un pago antes de registrarlo.

Abrir el pedido requiere datos de atención válidos, pero no un pago. La ubicación exacta del responsable y del cajero dentro de la interfaz se definirá en la siguiente iteración. Cada cobro generará un movimiento de Caja; el comprobante fiscal se emite según el momento y las reglas fiscales configuradas, no necesariamente al abrir el pedido.

## Resultado

El resultado muestra número de pedido, total, monto pagado, saldo y acciones para abrir el pedido o iniciar otra operación.

## Carritos en pausa

Un carrito puede guardarse temporalmente con nombre o referencia. Puede recuperarse o descartarse, pero no se considera pedido, cobro ni reserva de inventario hasta abrirse.

## Escaneo de productos

La sesión de escaneo admite dos entradas: un campo único para SKU, código o lector conectado que emule teclado, y la cámara del dispositivo. Cada lectura resuelve producto y variante, valida estado y stock, y se acumula en una bandeja temporal. El operador puede aumentar, reducir o quitar resultados antes de enviarlos juntos al carrito.

La cámara usa `getUserMedia` y `BarcodeDetector`, por lo que requiere HTTPS o localhost, permiso del usuario y un navegador compatible. Los lectores USB, Bluetooth, RFID o NFC funcionan cuando entregan el identificador como teclado y finalizan con Enter. Web NFC directo tiene soporte limitado y queda como integración posterior.
