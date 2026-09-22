# Formularios

## Objetivo

Formularios centraliza la captación de datos desde Web, Marketplace, enlaces públicos o uso interno. Una respuesta podrá convertirse en cliente CRM, solicitud de cita o pedido sin duplicar información manualmente.

## Alcance planeado

1. Overview y ciclo de publicación.
2. Constructor de campos.
3. Preview y formulario público.
4. Bandeja y detalle de respuestas.
5. Conversión hacia CRM, Agenda o Pedidos.
6. Publicación por canal y métricas.

## Primer bloque implementado

- Contrato mock y store Zustand.
- Ruta `/app/[slug]/formularios`.
- KPIs de publicados, respuestas, pendientes y finalización.
- Búsqueda por nombre, descripción o enlace.
- Filtros por estado, tipo y canal.
- Ordenamiento por actualización, respuestas, finalización o nombre.
- Vistas tabla y cards con paginación.
- Preview con métricas, canal, destino y enlace público copiable.
- Acciones para publicar, pausar, reactivar, duplicar y eliminar borradores.
- Selector de plantilla en un diálogo antes de entrar al constructor.

## Segundo bloque implementado

- Constructor reutilizable para creación y edición.
- Plantillas de contacto, cotización, reserva, encuesta y formulario vacío.
- Campos de texto, correo, teléfono, número, texto largo, selección, fecha y casilla.
- Alta, edición, duplicación, eliminación y orden manual de campos.
- Etiqueta, placeholder, ayuda, obligatoriedad y opciones configurables.
- Configuración de canal, destino y mensaje posterior al envío.
- Vista previa inmediata dentro del editor.
- Creación y actualización persistidas en el store mock.
- Barra flotante compartida para guardar o cancelar.

## Estados

- `borrador`: editable y eliminable; no recibe respuestas.
- `activo`: publicado y disponible para captar respuestas.
- `pausada`: conserva estructura y respuestas, pero deja de captar.
- `finalizada`: archivado para consulta histórica.

## Tipos

- Contacto.
- Cotización.
- Reserva.
- Encuesta.
- Personalizado.

## Canales

- Sitio web.
- Marketplace.
- Enlace público.
- Uso interno.

## Destinos

- CRM.
- Agenda.
- Pedidos.
- Sin automatización.

## Tercer bloque implementado

- Ruta pública `/f/[publicSlug]` con validaciones nativas y confirmación de envío.
- Registro mock de respuestas y actualización de contadores.
- Bandeja por formulario con búsqueda y filtro por estado.
- Detalle completo de datos enviados y contexto de origen.
- Estados nueva, revisada, convertida y descartada.
- Acceso a respuestas desde las acciones de cada formulario.

## Bloque de cierre implementado

- Conversión mock según destino hacia CRM, Agenda o Pedidos.
- Referencia del registro generado sin eliminar la respuesta original.
- Historial cronológico de recepción, cambios de estado y conversión.
- Métricas derivadas por estado en la bandeja de respuestas.
- Estados y colores alineados con `StatusBadge` compartido.

## Decisiones de cierre

- El prototipo valida obligatoriedad y tipo mediante controles del navegador.
- Carga de archivos se reserva para la integración backend por seguridad y almacenamiento.
- Consentimiento puede modelarse con casillas; políticas, versión y retención quedan en backend.
- Bloques informativos y reglas condicionales quedan fuera del alcance MVP actual.
- Redirecciones, correos y webhooks requieren infraestructura backend y se documentan como integración.

## Estado

**Prototipo frontend cerrado.** Integración autoritativa, seguridad, archivos y automatizaciones reales permanecen documentados como issues de backend.

Ver [reglas](./rules.md) e [issues](./issues.md).
