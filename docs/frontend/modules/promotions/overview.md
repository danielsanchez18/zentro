# Promociones — Overview

**Ruta:** `/app/[slug]/promociones`  
**Estado:** Primera versión funcional; pendiente del CRUD

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
