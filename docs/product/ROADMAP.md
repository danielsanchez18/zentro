# Roadmap maestro por flujos y páginas

Este roadmap ordena el prototipo frontend. “Completo” no significa listo para producción: los pendientes de backend permanecen en los archivos `issues.md` de cada módulo.

## Fase 1 — Acceso personal

1. **Login** — completo en mock.
   - Email y contraseña, validaciones visuales, recuperación y redirección al Hub.
   - Falta sesión real, usuarios deshabilitados, rate limiting y OAuth.
2. **Signup** — completo en mock.
   - Registro por pasos y acceso al Hub personal.
   - Falta unicidad autoritativa, persistencia y verificación real.
3. **Recuperación** — completa en mock.
   - Solicitud, OTP y nueva contraseña.
   - Falta envío, expiración, intentos e invalidación de servidor.

## Fase 2 — Dashboard Hub

4. **Overview, cuenta, organizaciones, invitaciones, suscripciones y ayuda** — auditados para prototipo.
5. **Onboarding de organización** — completo en mock.
   - Actividad, capacidades, ubicación opcional y resumen.
   - Nunca crea una ubicación implícita.

## Fase 3 — Base del workspace

6. **Layout y selector de contexto** — selector implementado; navegación dinámica pendiente.
7. **WorkspaceContext mock** — siguiente paso.
8. **Equipo, perfiles, permisos y alcance** — readecuación pendiente.
9. **Centro de configuración y ubicaciones** — planificado.

## Fase 4 — Comercio y operación

10. **Catálogo** — completo en prototipo.
11. **Inventario** — completo en prototipo.
12. **Compras** — completo en prototipo.
13. **Promociones** — completo en prototipo.
14. **Pedidos** — completo en prototipo.
15. **POS** — prototipo funcional completo; conexión autoritativa a WorkspaceContext pendiente.

## Fase 5 — Relación con clientes y servicios

16. **CRM** — planificado.
17. **Agenda** — planificada para citas presenciales u online.
18. **Formularios** — planificados para captación y flujos de canales.

## Fase 6 — Finanzas

19. **Caja** — planificada y local por ubicación/terminal.
20. **Facturación** — planificada y global con trazabilidad por pedido.
21. **Reportes** — planificados en vista consolidada o por ubicación/canal.

## Fase 7 — Presencia y canales

22. **Canales de venta** — planificado como entidad y página propia.
23. **Marketplace Zentro** — planificado.
24. **CMS/Sitio web** — planificado; Blog vivirá dentro de este módulo.
25. **Marketing** — planificado por audiencias y canales.

## Fase 8 — Gobierno y cierre frontend

26. **Auditoría del workspace** — planificada.
27. **QA responsive, accesibilidad y estados vacíos/error** — transversal.
28. **Auditoría final del frontend y congelamiento de contratos mock**.
29. **Plan de integración backend**, sin reintroducir un selector mock/API.
