# Promociones

**Estado del módulo:** Overview en primera versión funcional; CRUD pendiente.

## Objetivo

Configurar beneficios comerciales temporales sobre productos o categorías del Catálogo, controlando vigencia, condiciones y compatibilidad sin modificar los precios base.

Promociones no gestiona pedidos ni cobros. Su resultado será consumido posteriormente por el flujo de Pedidos/Ventas para calcular descuentos aplicables.

## Alcance funcional

| Sección | Ruta | Estado |
|---|---|---|
| Overview | `/app/[slug]/promociones` | Primera versión funcional |
| Nueva promoción | `/app/[slug]/promociones/agregar` | Planeado |
| Detalle | `/app/[slug]/promociones/[promotionId]` | Planeado |
| Edición | `/app/[slug]/promociones/[promotionId]/editar` | Planeado |

## Tipos iniciales

- Descuento porcentual.
- Descuento de monto fijo.
- Precio promocional fijo.
- Compra una cantidad y recibe otra con descuento o gratis.

El primer prototipo priorizará porcentaje, monto fijo y precio promocional. Las promociones por cantidad podrán añadirse después de validar la experiencia del formulario.

## Aplicación

Una promoción podrá aplicarse a:

- Productos específicos.
- Una o más categorías.

La aplicación a variantes, combos dinámicos, clientes o canales específicos queda fuera del primer alcance.

## Estados

- `borrador`: configuración editable y no publicada.
- `programada`: publicada con fecha de inicio futura.
- `activa`: vigente y habilitada.
- `pausada`: detenida manualmente durante su vigencia.
- `finalizada`: terminó su periodo de aplicación.
- `cancelada`: descartada y no puede reactivarse.

## Reglas principales

- Una promoción no modifica el precio base del producto.
- Debe tener nombre, beneficio, alcance y rango de vigencia válidos.
- El valor porcentual debe estar entre 1 y 100.
- Un precio promocional debe ser menor que el precio base aplicable.
- Solo productos y categorías activas pueden añadirse al alcance.
- La sucursal activa proviene del layout; el módulo no incorpora otro selector.
- El primer prototipo no acumulará promociones: ante conflictos se usará una prioridad explícita.
- Pausar o cancelar una promoción no elimina su historial.

## Fases de implementación

1. Overview con KPIs, búsqueda, filtros, tabla/cards y acciones. ✓
2. Store y datos mock para el ciclo de estados. ✓
3. Alta y edición mediante formulario reutilizable.
4. Detalle con información, alcance y resumen del beneficio.
5. Acciones de publicar, pausar, reanudar, cancelar y eliminar borradores.
6. Vista previa de productos afectados y conflictos de prioridad.
7. Documentación de integración con Pedidos/Ventas y QA.

## Organización propuesta

```text
components/app/promotions/
├── overview/
├── add/
├── details/
├── edit/
└── shared/
```

## Dependencias

- Catálogo aporta productos, categorías, estados y precios base.
- El layout aporta organización y sucursal activa.
- Pedidos/Ventas consumirá las promociones, pero no bloquea el prototipo visual.

## Documentos

- [Overview](./overview.md)
- [Reglas y conflictos](./rules.md)
- [Pendientes e issues](./issues.md)
