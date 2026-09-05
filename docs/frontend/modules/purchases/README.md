# Compras

**Estado del módulo:** Prototipo funcional cerrado; pendiente de QA e integración con backend.

## Objetivo

Gestionar el abastecimiento de la sucursal activa desde la solicitud al proveedor hasta la recepción de productos y su impacto en Inventario.

Compras representa adquisiciones realizadas por el negocio. Los pedidos de clientes pertenecen al módulo de Pedidos/Ventas y quedan fuera de este alcance.

## Alcance funcional

| Sección | Ruta | Estado |
|---|---|---|
| Overview | `/app/[slug]/compras` | Primera versión funcional |
| Nueva orden | `/app/[slug]/compras/agregar` | Prototipo funcional completo |
| Detalle de orden | `/app/[slug]/compras/[purchaseId]` | Prototipo funcional completo |
| Edición | `/app/[slug]/compras/[purchaseId]/editar` | Prototipo funcional completo |
| Recepción | Diálogo dentro del detalle | Prototipo funcional completo |

## Flujo principal

1. Crear una orden en borrador.
2. Seleccionar proveedor, productos, cantidades y costos acordados.
3. Enviar la orden al proveedor.
4. Registrar una o más recepciones.
5. Generar entradas de inventario por las cantidades recibidas.
6. Cerrar la orden cuando todo haya sido recibido o cancelado.

## Estados de la orden

- `borrador`: editable y todavía no enviada.
- `enviada`: comunicada al proveedor; pendiente de recepción.
- `parcial`: recibió una parte de los productos.
- `recibida`: recepción completa y orden cerrada operativamente.
- `cancelada`: anulada sin recepciones posteriores.

El estado de pago se modelará por separado (`pendiente`, `parcial`, `pagado`) y no modificará el stock.

## Reglas principales

- Crear o enviar una orden no modifica Inventario.
- Cada recepción confirmada genera movimientos de tipo entrada.
- Una recepción no puede superar la cantidad pendiente de cada línea.
- Una orden recibida o cancelada no admite cambios ordinarios.
- El proveedor debe estar activo al crear la orden.
- Los importes se guardan con moneda y costos unitarios históricos.
- La sucursal activa proviene del layout y no se selecciona dentro del módulo.

## Fases del prototipo

1. Overview con KPIs, búsqueda, filtros, tabla, cards y vista previa. ✓
2. Alta de orden con líneas de productos y resumen de importes. ✓
3. Detalle, edición y transiciones de estado. ✓
4. Recepciones totales y parciales conectadas al store de Inventario. ✓
El alcance funcional acordado queda cerrado con estas cuatro fases.

## Evolución posterior

- Comprobantes, pagos y cuentas por pagar se abordarán con Finanzas o durante la integración.
- Contratos de API, permisos, auditoría, persistencia y QA pertenecen a la etapa de producción.
- Las mejoras posteriores se centralizan en [issues.md](./issues.md) y no bloquean el cierre del prototipo.

## Organización propuesta

```text
components/app/purchases/
├── overview/
├── add/
├── details/
├── edit/
├── receptions/
└── shared/
```

## Documentos

- [Overview](./overview.md)
- [Órdenes de compra](./purchase-orders.md)
- [Recepciones](./receptions.md)
- [Pendientes e issues](./issues.md)

## Siguiente módulo

El siguiente módulo planificado es [Promociones](../promotions/README.md), construido sobre productos y categorías de Catálogo.
