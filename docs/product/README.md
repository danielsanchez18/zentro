# Mapa de producto y páginas de Zentro

Esta carpeta es la fuente rápida para responder cuatro preguntas:

1. ¿Qué páginas existen o están planeadas?
2. ¿Qué debe hacer cada página?
3. ¿Qué está terminado en el prototipo y qué falta?
4. ¿Cuál es el siguiente paso de desarrollo?

La documentación detallada de cada dominio continúa en `docs/frontend/modules/`. Esta carpeta no la reemplaza: organiza el producto por rutas y enlaza el progreso transversal.

## Archivos principales

- [ROADMAP.md](./ROADMAP.md): orden de desarrollo y siguiente paso.
- [PROGRESS.md](./PROGRESS.md): fotografía breve del estado actual.
- [routes/](./routes/): contrato funcional de cada página, exista o no todavía.

Catálogo de rutas: [Landing](./routes/LANDING.md), [Auth](./routes/AUTH.md), [Hub](./routes/HUB.md), [Workspace](./routes/WORKSPACE.md), [Catálogo](./routes/CATALOG.md), [Inventario y compras](./routes/INVENTORY.md), [Promociones](./routes/PROMOTIONS.md), [Pedidos](./routes/ORDERS.md), [POS](./routes/POS.md) y [módulos planificados](./routes/PLANNED.md).

## Estados utilizados

- **Completo (prototipo):** UI y flujo local cubiertos; puede conservar issues de backend.
- **Parcial:** existe una página, pero no cubre todavía el alcance acordado.
- **Planificado:** alcance definido sin página implementada.
- **Pendiente de definir:** aún requiere una decisión de producto.
- **Integración pendiente:** el prototipo existe, pero necesita backend o proveedor externo.

## Regla de mantenimiento

Toda página nueva o decisión de alcance debe actualizar en la misma tarea:

1. su archivo dentro de `routes/`;
2. `PROGRESS.md`;
3. `ROADMAP.md` si cambia el orden de trabajo;
4. los issues del módulo si el pendiente corresponde a backend o integración.
