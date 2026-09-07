# Pedidos

**Estado del módulo:** Prototipo UI/UX funcional completo.

**Cierre de prototipo:** 7 de septiembre de 2026. No quedan issues de maquetación abiertos.

## Objetivo

Centralizar los pedidos de clientes provenientes del Punto de venta y, posteriormente, de la web o marketplace, permitiendo consultar su contenido y avanzar su preparación hasta la entrega o cancelación.

Pedidos no reemplaza al POS: el POS construye y cobra una venta; Pedidos administra y da seguimiento al resultado operativo.

## Alcance funcional

| Sección | Ruta | Estado |
|---|---|---|
| Overview | `/app/[slug]/pedidos` | Prototipo funcional |
| Detalle | `/app/[slug]/pedidos/[orderId]` | Prototipo funcional |
| Registro | `/app/[slug]/pos` | Pertenece a Punto de venta |

No se creará `/pedidos/agregar` en el alcance inicial para evitar duplicar el constructor de venta del POS.

## Tipos de atención

- `mesa`: consumo dentro del local; puede incluir número de mesa.
- `recojo`: el cliente recoge el pedido en la sucursal.
- `delivery`: requiere dirección y datos de entrega.

## Canales de origen

- Punto de venta.
- Sitio web, en una integración posterior.
- Marketplace, en una integración posterior.

## Estados operativos

- `nuevo`: recibido y pendiente de aceptación.
- `confirmado`: aceptado y con productos validados.
- `en_preparacion`: elaboración iniciada.
- `listo`: preparado para servir, recoger o despachar.
- `entregado`: completado operativamente.
- `cancelado`: detenido y fuera del flujo ordinario.

El estado de pago será independiente: `pendiente`, `parcial`, `pagado` o `reembolsado`.

## Flujo principal

1. El POS o un canal conectado genera el pedido.
2. El pedido aparece como nuevo en el overview.
3. El equipo lo confirma e inicia su preparación.
4. Se marca como listo.
5. Se entrega o despacha y se completa.
6. Si existe un problema, se cancela dejando motivo e historial.

## Reglas del prototipo

- La sucursal activa proviene del layout.
- Un pedido conserva precios, impuestos y descuentos históricos.
- Las promociones aplicadas se muestran, pero no se recalculan al consultar el pedido.
- Los estados avanzan mediante acciones explícitas y confirmaciones cuando corresponde.
- El pago y la preparación evolucionan de forma independiente.
- Los pedidos entregados o cancelados son de consulta.
- La reserva y deducción real de stock queda sujeta al contrato con Inventario.

## Fases del prototipo

1. Datos mock, tipos y store con transiciones de estado. ✓
2. Overview con header, KPIs, filtros, tabla/cards, paginación y preview. ✓
3. Detalle con cliente, líneas, importes, promociones, pago y entrega. ✓
4. Acciones para confirmar, preparar, marcar listo, entregar y cancelar. ✓
5. Historial visual de estados y eventos. ✓
6. Responsive, estados vacíos y QA técnico. ✓
7. Cierre documental y separación de pendientes de backend. ✓

## Funcionalidades cerradas en el prototipo

- Consulta, filtros, ordenamiento, tabla, cards y preview responsive.
- Transiciones del ciclo operativo y cancelación con motivo obligatorio.
- Registro de pagos parciales, cálculo de saldo e historial de abonos.
- Reembolsos parciales o totales con motivo.
- Emisión mock y descarga local de boleta o factura.
- Asignación de repartidor y avance del recorrido de delivery.
- Timeline interno con comentarios y eventos operativos y financieros.
- Edición controlada de líneas antes de marcar el pedido como listo: agregar, quitar, reemplazar y cambiar cantidades.
- Descuento directo por importe o porcentaje, separado de promociones y registrado en el historial.
- Historial de ajustes con motivo y snapshot completo antes/después.

## Organización propuesta

```text
components/app/orders/
├── overview/
├── details/
└── shared/
```

## Dependencias

- Catálogo aporta productos y variantes.
- Promociones aporta descuentos aplicables.
- Inventario aporta disponibilidad y futura reserva/deducción de stock.
- POS crea pedidos y registra cobros inmediatos.
- Caja y Facturación consumen pagos y comprobantes.
- CRM aporta clientes, direcciones e historial.

## Documentos

- [Overview](./overview.md)
- [Ciclo operativo](./lifecycle.md)
- [Detalle](./details.md)
- [Pendientes e issues](./issues.md)

## Siguiente módulo

El flujo continúa en [Punto de venta](../pos/README.md), responsable de construir, cobrar y generar los pedidos que este módulo administra.
