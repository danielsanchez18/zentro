# Promociones — Overview

**Ruta:** `/app/[slug]/promociones`  
**Estado:** Prototipo UI/UX completo

La ruta `/app/[slug]/promociones/agregar` ya permite crear borradores mediante el formulario reutilizable del módulo.
La ruta `/app/[slug]/promociones/[promotionId]/editar` reutiliza el formulario para borradores, programadas y pausadas.
La ruta `/app/[slug]/promociones/[promotionId]` muestra información operativa, preview comercial, alcance y rendimiento mock de usos y ventas atribuidas.

## Objetivo

Permitir encontrar promociones rápidamente, entender su vigencia y ejecutar las acciones válidas para cada estado.

## Alcance del prototipo

- [x] KPIs de promociones activas, programadas, por finalizar y productos afectados.
- [x] Búsqueda por nombre o identificador.
- [x] Filtros por estado, tipo y alcance.
- [x] Filtro por rango de vigencia.
- [x] Ordenamiento por creación, inicio, finalización y prioridad.
- [x] Vista tabla y cards responsive.
- [x] Cards con vista comercial del beneficio, vigencia y consumo administrativo.
- [x] Conteo de usos con límite total configurable o modalidad ilimitada.
- [x] Paginación y estado vacío.
- [x] Vista previa al pulsar una fila o card.
- [x] Menú contextual con acciones según el estado.
- [x] Alta, edición y detalle mediante rutas funcionales.
- [x] Preview comercial y cards de productos o categorías afectadas.
- [x] Rendimiento mock de usos y ventas atribuidas.

No quedan issues de maquetación abiertos para el alcance inicial.

## Información visible

- Nombre e identificador.
- Tipo y valor del beneficio.
- Productos o categorías afectados.
- Fecha de inicio y finalización.
- Prioridad.
- Estado.

## Acciones

- Borrador: ver, editar, publicar o eliminar.
- Programada: ver, editar, pausar o cancelar.
- Activa: ver, pausar o cancelar.
- Pausada: ver, editar, reanudar o cancelar.
- Finalizada y cancelada: consultar.
