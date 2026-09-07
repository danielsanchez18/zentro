# Promociones — pendientes de integración

**Maquetación:** cerrada para el alcance inicial. Los puntos siguientes requieren contrato de API, reglas de negocio o datos provenientes del backend.

## Backend y Pedidos/Ventas

- [ ] Definir motor de reglas y contrato de evaluación con Pedidos/Ventas.
- [ ] Definir impuestos y orden de aplicación de descuentos.
- [ ] Implementar reglas de prioridad, detección de solapamientos y mejor precio.
- [ ] Definir comportamiento por zona horaria al iniciar o finalizar.
- [ ] Aplicar permisos para crear, publicar, pausar y cancelar.
- [ ] Registrar auditoría de cambios de configuración y estado.

## Fuera del alcance inicial

- [ ] Promociones por cantidad tipo 2x1 o 3x2.
- [ ] Cupones y códigos promocionales.
- [ ] Segmentación por cliente, canal o sucursal.
- [ ] Límites de uso individuales por cliente (el prototipo ya contempla límite global o ilimitado).
- [ ] Persistir el conteo de usos de forma atómica desde pedidos para evitar sobrepasar el límite.
- [ ] Métricas de ventas incrementales y costo del descuento.
