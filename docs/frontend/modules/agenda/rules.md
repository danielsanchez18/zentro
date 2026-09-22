# Agenda — reglas de negocio

## Reglas implementadas en el prototipo

1. Una cita requiere cliente CRM o nombre de invitado.
2. La hora final debe ser posterior a la inicial.
3. Reprogramar exige un motivo.
4. Un responsable o recurso no puede tener citas activas superpuestas.
5. Canceladas e inasistencias se excluyen del control de cruces.
6. Cancelar o marcar no asistencia exige motivo.
7. Una cita puede existir sin responsable, recurso, ubicación, pedido o pago.
8. Un pago debe ser mayor a cero y no superar el saldo.
9. Pagar parcialmente no cambia por sí solo el estado operativo.
10. No se elimina una cita en curso, completada o con pagos.
11. Cliente, responsable, servicio, recurso y contacto se guardan como snapshot mock.
12. Ediciones, reprogramaciones, estados y pagos generan historial mock.

## Reglas decididas pero aún no aplicadas

1. Horario semanal, bloqueos, buffer y antelación deben determinar disponibilidad.
2. Una cita a domicilio deberá exigir dirección válida.
3. Una cita online deberá exigir un medio de contacto y enlace válido.
4. La recurrencia deberá crear una serie y distinguir edición de ocurrencia o serie.
5. Las citas de jornada completa deberán ocupar su fila específica.
6. Los recursos disponibles deberán provenir del store/configuración activa.
7. Los servicios grupales deberán respetar capacidad concurrente.
8. Toda fecha autoritativa deberá normalizar timezone/UTC en backend.
9. Deshabilitar entidades no deberá eliminar citas históricas.
10. Permisos y alcance deberán controlar lectura y acciones por organización/ubicación.
