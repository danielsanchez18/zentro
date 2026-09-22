# Agenda — especificación funcional del prototipo

**Auditoría:** 17 de septiembre de 2026  
**Alcance:** frontend mock, sin backend autoritativo  
**Rutas:** `/app/[slug]/agenda` y `/app/[slug]/agenda/configuracion`

## 1. Propósito del módulo

Agenda permite administrar citas y reservas de servicios sin obligar al negocio a usar inventario, pedidos, caja o una ubicación física. Está pensada para servicios presenciales, a domicilio y online, y puede combinar clientes de CRM, miembros de Equipo, recursos físicos y pagos parciales.

### Ventajas funcionales

- Reúne calendario, participantes, responsables, recursos, contacto y pago en una misma operación.
- Permite reservar sin cobrar inmediatamente.
- Conserva trazabilidad mock de cambios de estado, reprogramaciones y pagos.
- Evita cruces directos del mismo responsable o recurso.
- Admite clientes registrados y personas invitadas.
- Ofrece diferentes formas de visualizar la carga operativa.
- Se adapta a negocios sin sede física mediante citas online o a domicilio.

## 2. Mapa de componentes

### Overview

- `AgendaModule`: orquesta citas, filtros, conflictos, diálogos y acciones.
- `AgendaHeader`: título, descripción, acceso a Configuración y alta de cita.
- `AgendaKpis`: indicadores operativos.
- `AgendaToolbar`: vistas, fechas, búsqueda y filtros.
- `AgendaCalendar`: distribuye las citas entre día, semana, mes y lista.
- `AgendaDayView`: grilla horaria de un día.
- `AgendaWeekView`: grilla de siete días.
- `AgendaMonthView`: calendario mensual resumido.
- `AgendaListView`: listado cronológico.
- `AppointmentCard`: resumen de cita en la vista de lista.

### Operación de citas

- `CreateAppointmentDialog`: alta completa.
- `EditAppointmentDialog`: edición y reprogramación.
- `AppointmentPreviewDialog`: centro de detalle y acciones.
- `AppointmentPaymentDialog`: adelantos y pagos parciales.
- `AppointmentReasonDialog`: motivo obligatorio para cancelación o no asistencia.

### Configuración

- `AgendaSettingsModule`: contenedor de configuración con estado persistente local.
- `ScheduleSection`: disponibilidad semanal.
- `ResourcesSection`: recursos reservables.
- `BlocksSection`: días bloqueados y excepciones.
- `GeneralParametersSection`: duración, buffer, antelación, timezone y notificaciones.
- `CreateResourceDialog`: alta de recursos.
- `CreateBlockDialog`: alta de bloqueos.
- `TimeInputSelect`: entrada manual o selección de hora.

## 3. Overview

### 3.1 KPIs

El overview presenta:

- citas del día;
- citas pendientes de confirmación;
- horas reservadas del día, excluyendo cancelaciones e inasistencias;
- total de inasistencias registradas.

Restricción actual: el concepto de “hoy” usa la fecha mock fija `2026-09-12`; no toma la fecha activa del calendario ni el reloj actual.

### 3.2 Vistas

#### Día

- Selector rápido de los siete días de la semana.
- Grilla horaria con desplazamiento vertical.
- Posicionamiento de citas según inicio y duración.
- Distribución en columnas cuando existen citas superpuestas.
- Altura mínima para citas cortas.
- Línea visual de hora actual.
- Clic en la cita para abrir el preview.
- Acciones operativas ocultas visualmente en las tarjetas pequeñas.

La fila “Todo el día” existe visualmente, pero todavía no representa las citas cuyo campo `allDay` es verdadero.

#### Semana

- Siete columnas, de lunes a domingo.
- Navegación al día seleccionado.
- Distribución de citas por hora y resolución de superposiciones.
- Línea de hora actual.
- Clic para abrir el preview.

La fila de jornada completa aún no renderiza eventos `allDay`.

#### Mes

- Cuadrícula mensual.
- Hasta dos citas visibles por día.
- Indicador “+ N más” cuando existen citas adicionales.
- Clic en un día para seleccionarlo.
- Clic en una cita para abrir el preview.

#### Lista

- Orden cronológico por `startsAt`.
- Tarjetas con horario, servicio, cliente, estado, responsable, modalidad/ubicación y duración.
- Estado vacío reutilizable cuando los filtros no encuentran resultados.

### 3.3 Navegación temporal

- Anterior y siguiente.
- Avance por día en día/lista, siete días en semana y un mes en vista mensual.
- Botón “Hoy”.
- Selector de fecha con Calendar de shadcn.
- En vista semanal, el selector representa el rango lunes-domingo.

### 3.4 Búsqueda y filtros

La búsqueda consulta:

- nombre del cliente;
- servicio;
- responsable;
- número de cita.

Filtros disponibles:

- estado;
- servicio;
- responsable, incluyendo “Sin asignar”;
- modalidad.

No existe todavía filtro de ubicación.

## 4. Crear una cita

### 4.1 Datos del evento

- Título editable.
- Servicio del catálogo mock o servicio personalizado.
- Fecha y hora de inicio.
- Fecha y hora de finalización.
- Opción “Todo el día”; internamente usa 08:00–18:00.
- Repetición: ninguna, diaria, semanal, mensual o anual.
- Recurso reservable opcional.

Al seleccionar un servicio conocido se propone su nombre, duración y precio.

### 4.2 Participantes

- Cliente activo proveniente del store de CRM.
- Alternativa de invitado sin crear automáticamente un perfil CRM.
- Para invitado: nombre, teléfono y correo.
- Responsable activo proveniente de Equipo.
- Posibilidad de dejar la cita sin responsable.

Validación efectiva: debe existir un cliente seleccionado o un nombre de invitado. Teléfono y correo no son obligatorios en el alta actual.

### 4.3 Permisos y avisos

Se almacenan en la cita:

- permitir acompañantes;
- mostrar lista de participantes;
- solicitar notificación por correo;
- recordatorio de 10, 15, 30, 60 minutos, un día o ninguno.

Estos valores se guardan en el contrato mock, pero todavía no generan invitaciones, mensajes ni recordatorios reales.

### 4.4 Modalidades

#### Online

- Genera/guarda un enlace de reunión.
- Permite copiar el enlace.

El proveedor aún no crea una videollamada real; se utiliza un enlace mock.

#### Presencial

- Permite indicar sede, consultorio o nombre del lugar.
- La ubicación no es obligatoria en el formulario actual.

#### A domicilio

- Permite introducir una dirección.
- La UI la solicita, pero el alta no aplica todavía una validación obligatoria autoritativa.

### 4.5 Estado inicial

Las citas creadas manualmente nacen como:

- estado operativo: `confirmada`;
- pago: `sin_pago`;
- origen: `manual`.

### 4.6 Validación de conflictos

Antes de crear, se bloquea la operación si otra cita no cancelada ni marcada como inasistencia:

- usa el mismo responsable, o
- usa el mismo recurso,
- y sus intervalos se superponen.

No se consideran todavía:

- buffer configurado;
- horario semanal;
- bloqueos/excepciones;
- antelación mínima;
- capacidad grupal;
- ubicación;
- recurrencias futuras.

## 5. Preview y acciones

El preview es el centro operativo de la cita. Las tarjetas pequeñas priorizan la lectura y abren este diálogo.

### 5.1 Información presentada

- estado;
- número de cita;
- modalidad;
- servicio/título;
- fecha, rango horario y duración;
- enlace online, cuando existe;
- cliente, avatar y datos de contacto;
- responsable;
- ubicación o dirección;
- estado financiero;
- importe pagado, total, porcentaje y barra de progreso;
- notas;
- historial mock.

### 5.2 Contacto

- Abrir WhatsApp con el teléfono normalizado.
- Abrir cliente de correo.
- Iniciar llamada mediante `tel:`.
- Copiar enlace de videollamada.
- Abrir la videollamada en una pestaña nueva.
- Copiar un resumen compartible de la cita.

### 5.3 Transiciones operativas

- `pendiente_confirmacion → confirmada`: Confirmar cita.
- `confirmada → en_curso`: Iniciar atención.
- `en_curso → completada`: Completar cita.
- Cualquier estado distinto de cancelada puede mostrar las opciones Cancelar y No asistencia.

Cancelar y marcar no asistencia exigen un motivo. El motivo se guarda en `cancellationReason` y en el historial.

Restricción: el store no impone una máquina de estados autoritativa; las reglas dependen de lo que expone la UI.

### 5.4 Eliminación

Solo se habilita cuando:

- no existe pago;
- la cita no está `en_curso`;
- la cita no está `completada`.

Se recomienda cancelar en lugar de eliminar cuando se necesita trazabilidad. La eliminación mock remueve el elemento y no conserva una papelera o auditoría externa.

## 6. Editar y reprogramar

El formulario permite modificar:

- título/servicio;
- fechas y horas;
- todo el día;
- recurrencia;
- recurso;
- cliente o invitado;
- responsable;
- permisos y notificaciones;
- modalidad y lugar/enlace;
- notas;
- recordatorio.

Reglas:

- título y horario son obligatorios;
- el final debe ser posterior al inicio;
- si cambia inicio o final, el motivo de reprogramación es obligatorio;
- una edición sin cambio horario admite motivo opcional;
- se valida nuevamente el cruce por responsable o recurso;
- el cambio añade un evento `updated` o `rescheduled` al historial.

Limitación de recurrencia: editar `repeat` no crea ni actualiza una serie; solo guarda la configuración en la cita actual.

## 7. Pagos

Agenda permite registrar:

- adelanto;
- uno o más pagos parciales;
- pago total.

Reglas efectivas:

- el importe debe ser numérico y mayor que cero;
- no puede superar el saldo pendiente;
- se puede completar automáticamente el saldo;
- si el acumulado alcanza el precio, el estado pasa a `pagado`;
- si queda saldo, pasa a `adelanto`;
- cada registro añade un evento financiero al historial.

Restricciones:

- no se selecciona método de pago, caja, terminal, moneda alternativa ni responsable del cobro;
- no existen devoluciones desde Agenda;
- los pagos viven en el store de Agenda y aún no crean movimientos en Pedidos, POS o Caja.

## 8. Historial

Tipos soportados:

- creación;
- actualización;
- reprogramación;
- cambio de estado;
- cambio de pago.

Cada entrada puede guardar:

- identificador;
- tipo;
- título;
- detalle o motivo;
- fecha;
- actor mock “Usuario actual”.

Las citas iniciales sin historial muestran una entrada visual derivada de `createdAt`, pero esa entrada no se inserta en el store hasta que exista una acción posterior.

## 9. Configuración de Agenda

La ruta `/app/[slug]/agenda/configuracion` contiene cuatro secciones.

### 9.1 Horario semanal

- Activar o desactivar cada día.
- Definir apertura y cierre.
- Escribir la hora o elegirla en intervalos de 30 minutos.
- Mostrar duración calculada de la jornada.
- Copiar el horario del lunes a martes-viernes.

### 9.2 Recursos reservables

Tipos:

- cabina;
- sala;
- silla o sillón;
- equipo o aparatología.

Acciones:

- crear;
- activar/desactivar;
- eliminar;
- visualizar empty state.

El nombre es obligatorio.

### 9.3 Bloqueos y excepciones

- Crear bloqueo de jornada completa.
- Seleccionar fecha con Calendar de shadcn.
- Añadir motivo obligatorio.
- Eliminar bloqueo.
- Empty state cuando no existen registros.

### 9.4 Parámetros generales

- Duración predeterminada: 15, 30, 45, 60 o 90 minutos.
- Buffer entre citas: 0, 5, 10, 15 o 30 minutos.
- Antelación mínima: inmediata, 1, 2, 6 o 24 horas.
- Zona horaria visible: `America/Lima (GMT-5)`.
- Confirmaciones automáticas por WhatsApp.
- Confirmaciones automáticas por correo.
- Restablecer valores iniciales.
- Guardar cambios con confirmación visual.

### Persistencia de configuración

`agenda-settings-store` usa Zustand `persist` con la clave `zentro-agenda-settings`; horarios, recursos, bloqueos y parámetros sobreviven una recarga en el mismo navegador.

Restricción crítica: el formulario de citas usa todavía `agendaResources` estático y no el store de configuración. Los recursos nuevos/deshabilitados y las demás reglas configuradas no gobiernan aún el alta ni la edición.

## 10. Estado y persistencia

### Citas

- Zustand en memoria mediante `useAgendaStore`.
- Al recargar la página, las citas vuelven a los datos mock iniciales.
- Alta, edición, estados, pagos e historial no persisten entre recargas.

### Configuración

- Zustand persistente en `localStorage`.
- Independiente del store de citas.
- Restablecer reemplaza horarios, recursos y parámetros, y deja bloqueos vacíos.

## 11. Ventajas del diseño actual

- Un único preview evita saturar las tarjetas con acciones delicadas.
- Cancelación e inasistencia mantienen motivo.
- Reprogramar exige justificación.
- Los pagos están desacoplados del estado operativo.
- Los filtros pueden combinarse.
- El módulo funciona con o sin cliente CRM, responsable, recurso o ubicación.
- La configuración está separada de la operación diaria.
- La estructura está preparada para sustituir stores mock por contratos de backend.

## 12. Restricciones conocidas

- Los KPIs usan una fecha mock fija.
- Las citas no persisten tras recargar.
- Configuración y operación aún no están conectadas entre sí.
- Recurrencia no genera series.
- Todo el día no aparece en la fila dedicada.
- Horarios, bloqueos, buffer y antelación no impiden reservas.
- Los recursos configurados no alimentan crear/editar.
- No existe filtro de ubicación.
- No hay capacidad grupal.
- No hay permisos reales por rol/alcance.
- No hay mensajería ni recordatorios reales.
- No hay integración financiera autoritativa.
- No hay sincronización con calendarios externos.
- Los IDs, actores y enlaces son mock.

## 13. Criterio de cierre

El módulo se considera **cerrado a nivel de prototipo frontend y maquetación** porque existen overview, vistas, alta, edición, preview, estados, historial, pagos y configuración navegable.

No se considera cerrado a nivel de reglas autoritativas o producción. Las restricciones del apartado 12 permanecen registradas como issues de integración/frontend y backend.
