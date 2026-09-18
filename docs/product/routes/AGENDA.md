# Rutas — Agenda

## Ruta implementada

### /app/[slug]/agenda

Centro operativo con KPIs, calendario diario/semanal/mensual, listado, búsqueda y filtro de estado. La creación y el preview viven actualmente en diálogos dentro de esta ruta.

Incluye alta mock, contacto del participante, modalidades presencial/domicilio/online, resumen de pago, acciones de estado y resumen compartible.

## Flujos resueltos en diálogos

### Detalle y operación

Detalle permanente con servicios, contacto, estado, pago, historial y acciones operativas. Hoy esta consulta está cubierta parcialmente por el preview.

### Edición y reprogramación

Edición y reprogramación con motivo e historial, resuelta desde el preview.

### Configuración

Horarios, excepciones, servicios reservables, capacidad, responsables, recursos, políticas y recordatorios.

## Decisión de navegación

No se requiere `/agenda/agregar` en el prototipo actual: la creación rápida se resuelve mediante un diálogo desde el overview. Solo se añadirá una ruta dedicada si el flujo futuro supera razonablemente el espacio del modal.

## Estado

Prototipo frontend cerrado en una ruta principal con diálogos operativos. Se crearán rutas dedicadas únicamente si el crecimiento del flujo lo justifica.
