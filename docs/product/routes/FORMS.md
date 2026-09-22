# Rutas — Formularios

## Implementadas

### /app/[slug]/formularios

Overview con KPIs, filtros, ordenamiento, tabla/cards, preview y acciones de ciclo de vida.

### /app/[slug]/formularios/agregar

Constructor de formulario. La plantilla se selecciona previamente desde un diálogo en el overview y se envía como parámetro de entrada.

### /app/[slug]/formularios/[formId]/editar

Edición de información, campos, orden, propiedades, canal, destino y mensaje final usando el constructor compartido.

### /app/[slug]/formularios/[formId]/respuestas

Bandeja implementada con búsqueda, filtro por estado y acceso al detalle.

### /app/[slug]/formularios/[formId]/respuestas/[responseId]

Detalle implementado con datos capturados, contexto, estado, historial y conversión mock hacia CRM, Agenda o Pedidos.

### /f/[publicSlug]

Formulario público funcional fuera del workspace, con validación y confirmación de envío.
