# Compras — Recepciones

**Estado:** Prototipo funcional completo; pendiente de integración con backend.

## Objetivo

Confirmar qué cantidades llegaron realmente y trasladar ese resultado a las existencias de la sucursal.

## Reglas

- Una orden puede tener varias recepciones.
- Solo se reciben líneas incluidas en la orden.
- La cantidad acumulada no puede superar la solicitada.
- Cada confirmación genera un movimiento de entrada por producto.
- Debe conservarse el usuario, fecha, documento y costo unitario de la recepción.
- Una recepción confirmada no se edita: cualquier corrección se realiza mediante un ajuste trazable.

## Resultado

- Si no se recibió todo, la orden pasa a `parcial`.
- Si todas las líneas quedan completas, pasa a `recibida`.
- El stock y el historial de Inventario se actualizan al confirmar, nunca al guardar un borrador.

## Implementado en el prototipo

- [x] Recepción total o parcial por línea.
- [x] Límite según la cantidad pendiente.
- [x] Actualización del progreso y estado de la orden.
- [x] Incremento de existencias en el store compartido de Inventario.
- [x] Actualización del costo unitario desde la línea recibida.
- [x] Movimiento de entrada con orden, proveedor y usuario responsable.
