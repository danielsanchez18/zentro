# Dashboard — issues de backend e integración

**Prototipo frontend:** organizaciones y onboarding cerrados el 09/09/2026. Los siguientes puntos no deben resolverse con lógica autoritativa en el cliente.

## Autenticación y registro

- [ ] Crear el usuario registrado y devolver su sesión e identidad reales.
- [ ] Impedir login y renovación a usuarios deshabilitados o bloqueados.
- [ ] Implementar verificación de correo, expiración de OTP, límite de intentos y reenvío.
- [ ] Definir e integrar proveedores OAuth soportados; los botones sociales no deben considerarse funcionales hasta entonces.
- [ ] Validar unicidad del correo normalizado sin filtrar información sensible.
- [ ] Rotar o invalidar sesiones ante cambios de credenciales según la política definida.

## Organizaciones y onboarding

- [ ] Crear organización y membresía `OWNER` de forma atómica e idempotente.
- [ ] Validar y reservar el slug de forma autoritativa.
- [ ] Persistir `OrganizationSetup` por organización y permitir reanudar borradores entre dispositivos.
- [ ] No crear ninguna sucursal por defecto. Crear `OrganizationBranch` únicamente tras una decisión explícita del usuario.
- [ ] Validar dependencias duras de capacidades en servidor sin convertir recomendaciones por rubro en obligaciones.
- [ ] Definir permisos para abrir configuración, administrar miembros, copiar/generar invitaciones y abandonar una organización.
- [ ] Impedir que el último Owner abandone la organización sin transferencia o cierre.
- [ ] Definir el ciclo de vida de borradores abandonados y su eliminación/archivo.

## Invitaciones, notificaciones y facturación

- [ ] Aceptar/rechazar invitaciones de forma idempotente y actualizar membresías en la misma transacción.
- [ ] Proveer notificaciones persistidas, conteo no leído y panel del header.
- [ ] Obtener suscripciones, límites, facturas y permisos de facturación por organización.
- [ ] Generar descargas de comprobantes desde URLs firmadas o endpoints autorizados.

## Soporte

- [ ] Persistir tickets, respuestas, adjuntos e historial de estados.
- [ ] Sustituir referencias aleatorias del cliente por correlativos generados en servidor.
