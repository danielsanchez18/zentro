# Pedidos — pendientes de integración

Este documento separa decisiones que no bloquean el prototipo UI/UX.

## Dominio y backend

- [ ] Definir correlativos por organización y sucursal.
- [ ] Confirmar transiciones permitidas y estrategia de concurrencia.
- [ ] Definir edición de líneas después de confirmar.
- [ ] Definir impuestos, cargos de delivery, propinas y redondeo.
- [ ] Definir cancelaciones parciales y devoluciones.
- [ ] Aplicar permisos por acción y registrar auditoría.

## Integraciones

- [ ] Definir contrato de creación desde POS, web y marketplace.
- [ ] Definir reserva, deducción y liberación de stock con Inventario.
- [ ] Evaluar promociones y persistir su snapshot desde el backend.
- [ ] Integrar clientes y direcciones con CRM.
- [ ] Integrar pagos, caja, comprobantes y reembolsos.
- [ ] Definir notificaciones y actualización en tiempo real.

## Evolución posterior

- [ ] Cocina/KDS habilitable para restaurantes.
- [ ] Conectar la asignación de repartidor y el tracking ya maquetados con disponibilidad real, geolocalización y eventos del backend.
- [ ] División de cuentas, propinas y pagos múltiples.
- [ ] Impresión de comandas y comprobantes.
- [ ] Pedidos programados y recurrentes.

## QA de producción

- [ ] Probar pérdida de conexión, reintentos e idempotencia.
- [ ] Probar múltiples operadores actualizando el mismo pedido.
- [ ] Validar zonas horarias, formatos monetarios y tiempos de espera.
- [ ] Ejecutar QA responsive en escritorio y teléfono.
