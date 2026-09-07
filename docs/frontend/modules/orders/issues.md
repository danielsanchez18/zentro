# Pedidos — issues posteriores al prototipo

Este documento separa decisiones que no bloquean el prototipo UI/UX.

El prototipo visual del módulo está cerrado. No quedan issues de maquetación. Todos los puntos siguientes están marcados como `BACKEND`, `INTEGRACIÓN` o `PRODUCCIÓN` y no bloquean el cierre frontend.

## BACKEND — dominio y persistencia

- [ ] Definir correlativos por organización y sucursal.
- [ ] Confirmar transiciones permitidas y estrategia de concurrencia.
- [ ] Conectar la edición de líneas ya maquetada con validación transaccional, reserva/liberación de stock y permisos del backend.
- [ ] Definir impuestos, cargos de delivery, propinas y redondeo.
- [ ] Definir cancelaciones parciales y devoluciones.
- [ ] Aplicar permisos por acción y registrar auditoría.

## INTEGRACIÓN — otros módulos y servicios

- [ ] Definir contrato de creación desde POS, web y marketplace.
- [ ] Definir reserva, deducción y liberación de stock con Inventario.
- [ ] Evaluar promociones y persistir su snapshot desde el backend.
- [ ] Integrar clientes y direcciones con CRM.
- [ ] Integrar pagos, caja, comprobantes y reembolsos.
- [ ] Definir notificaciones y actualización en tiempo real.

## PRODUCCIÓN — evolución posterior

- [ ] Cocina/KDS habilitable para restaurantes.
- [ ] Conectar la asignación de repartidor y el tracking ya maquetados con disponibilidad real, geolocalización y eventos del backend.
- [ ] División de cuentas y propinas. Los abonos múltiples ya están maquetados; falta su integración transaccional.
- [ ] Impresión de comandas y comprobantes.
- [ ] Pedidos programados y recurrentes.

## PRODUCCIÓN — QA y resiliencia

- [ ] Probar pérdida de conexión, reintentos e idempotencia.
- [ ] Probar múltiples operadores actualizando el mismo pedido.
- [ ] Validar zonas horarias, formatos monetarios y tiempos de espera.
- [ ] Ejecutar QA responsive en escritorio y teléfono.
