# Inventario — pendientes e issues

Este documento concentra el trabajo posterior al cierre del prototipo. Ningún punto de esta lista bloquea el alcance visual y funcional acordado, pero debe resolverse antes de considerar Inventario listo para producción.

## Transversales

- [ ] Persistir existencias, movimientos, proveedores y preferencias de vista en backend.
- [ ] Obtener la sucursal activa y el usuario responsable desde la sesión real.
- [ ] Aplicar permisos por operación y conservar una auditoría inmutable.
- [ ] Resolver concurrencia e idempotencia para evitar diferencias de stock.
- [ ] Mover búsqueda, filtros, ordenamiento y paginación a consultas de servidor.
- [ ] Diseñar estados de carga, error, reintento y pérdida de conexión.
- [ ] Ejecutar QA visual y de interacción en escritorio y teléfono.
- [ ] Definir contratos de API antes de iniciar la integración.

## Existencias

- [ ] Reemplazar el estado Zustand en memoria; actualmente se reinicia al recargar.
- [ ] Confirmar reglas de stock reservado con el módulo de pedidos.

## Movimientos

- [ ] Hacer que la exportación use el conjunto filtrado y una fuente de datos del servidor.
- [ ] Incorporar documentos o comprobantes adjuntos.
- [ ] Validar formato, zona horaria y rango máximo de exportación.

## Proveedores

- [ ] Reemplazar la eliminación local por eliminación lógica persistida y reglas de bloqueo.
- [ ] Conectar los productos suministrados y el historial de entradas con relaciones reales de backend.
- [ ] Validar RUC/documento, duplicados y datos de contacto.
- [ ] Modelar múltiples contactos, direcciones y condiciones comerciales si el backend lo requiere.

## Marcas

- [ ] Sustituir la eliminación local por eliminación lógica persistida y permisos.
- [ ] Persistir relaciones entre marcas y productos.
- [ ] Definir reglas de duplicidad y eliminación para marcas con productos vinculados.

## Expansiones futuras

- [ ] Diseñar conteos físicos y conciliación formal de diferencias.
- [ ] Definir la administración avanzada de relaciones proveedor–producto junto con Compras.
- [ ] Evaluar una página individual de existencia solo si nuevos casos de uso superan lo que cubre el diálogo del overview.

## Fuera del módulo

- [ ] Revisar la advertencia de Next.js sobre múltiples lockfiles y la raíz inferida del workspace. No bloquea el prototipo de Inventario.
