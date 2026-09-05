# Promociones — reglas y conflictos

## Vigencia

El estado visible se deriva de la publicación, las fechas y una posible pausa manual. El frontend debe mostrar fechas en la zona horaria de la organización y el backend será la fuente definitiva del estado.

## Prioridad

El primer prototipo asignará una prioridad numérica. Cuando dos promociones vigentes afecten al mismo producto, se mostrará como aplicable la de mayor prioridad. Si empatan, prevalece la que produzca el mejor precio para el cliente.

## Acumulación

Las promociones no serán acumulables en el primer alcance. Cupones, descuentos manuales, programas de fidelidad y reglas por cliente se diseñarán como capacidades separadas.

## Validaciones

- Inicio anterior a finalización.
- Beneficio válido para el tipo elegido.
- Al menos un producto o categoría en el alcance.
- Sin elementos duplicados.
- Advertencia ante conflictos de vigencia y alcance.
- Las promociones activas no permiten cambiar directamente su beneficio; deben pausarse primero.
# Control de uso

- `usageLimit: null` representa una promoción sin límite total de clientes.
- Una promoción limitada muestra los usos actuales, el total y la disponibilidad restante.
- El backend deberá impedir nuevos usos cuando `usageCount` alcance `usageLimit`.

