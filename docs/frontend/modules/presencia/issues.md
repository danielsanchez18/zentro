# Pendientes — Módulo Constructor Web

## 1. Drag & drop y preview en tiempo real (lo que la spec pide y no se hizo)

La spec pide explícitamente:

- "Los bloques se arrastran y sueltan para construir la página"
- "Implementar vista previa en tiempo real"

Lo entregado es lista reordenable con ↑/↓ y preview de solo lectura (conmutable
con un botón). Es un recorte conscious: en mock, un builder arrastrable cuesta
mucho y no demuestra más que el preview. Si se quiere Approaches real, falta:

1. Librería de drag & drop (o sortable nativo) para reordenar bloques.
2. Preview que se actualiza mientras se edita, sin alternar de pestaña.
3. Breakpoints responsive en el preview. La spec dice "el sitio es responsivo por
   defecto, optimizado para móvil" — el preview actual es de un solo ancho.

## 2. Bloques con contenido real

`catalogo` y `blog` muestran placeholders. Falta conectarlos de verdad:

- **Catálogo**: leer de `src/lib/mock/catalog.ts` y aplicar `limit` y
  `categoryIds` de verdad.
- **Producto**: el selector de `productId` está vacío; hay que elegir del catálogo.
- **Blog**: leer artículos del módulo Blog (que todavía no existe) y filtrar por
  estado publicado, porque R4 de Blog impide que se vea un borrador.
- **Formulario**: `formId` sin selector; hay que listar los formularios de la org.
- **Testimonios / Galería / FAQ**: sus items se editan como JSON, no con un
  editor de lista.

## 3. Páginas: edición de nombre, slug y SEO

`updatePage` existe en el store pero **no hay UI** para editar nombre, slug ni
metatítulos. Faltan:
- Validación de slug único por organización en la UI (el store ya la resuelve con
  sufijo numérico).
- Previsualización del `metaTitle` / `metaDescription` en un resultado de búsqueda.

## 4. Dominio: verificación y certificado

La R2 dice "dominio personalizado o subdominio zentro.app según el plan", pero
nada verifica nada. En producción:
- Verificación de propiedad del dominio (DNS/TXT o CNAME).
- Emisión real del certificado SSL y su estado.
- Renombrado de subdominio con verificación de disponibilidad.
- Manejo de conflictos: dos orgs pidiendo el mismo subdominio.

## 5. Sin guard de servidor

`canViewModule("/presencia")` es solo de UI. Los endpoints deben validar el
permiso `presencia` por rol antes de leer o escribir el sitio.

## 6. Sin persistencia

Todo vive en memoria Zustand. Sitios, páginas, bloques y tema necesitan
persistencia autoritativa. Ojo con la regla de R3 al persistir: `lastPublishedAt`
y `updatedAt` son la base del cálculo de pendientes, y en un backend real lo
correcto es versionar el contenido publicado (snapshots) en vez de guardar la
última publicación como una sola fecha.

## 7. R7 y el canal "Sitio web"

Deliberadamente desacoplado: publicar el catálogo no habilita carrito ni pedidos,
porque la R7 dice que no obliga. Cuando exista backend hay que decidir si se
avisa al usuario ("tu sitio está publicado pero el canal de venta sigue cerrado")
o si se deja como está.

## 8. Objetivos y capacidades

`site.objectives` es declarativo y no condiciona nada todavía. Cuando exista el
backend, "vender" debería exigir canal de venta activo y "reservas" debería
ofrecer el bloque de agenda. Ahora es solo metadata.

## 9. Blog es módulo aparte (decisión de scope)

El roadmap 24 decía "Blog vivía dentro de este módulo", pero Notion lo trata como
capacidad separada con su propia clave de permiso y sus propias reglas. Se
construyó solo el Constructor Web; el bloque Blog apunta a artículos que todavía
no existen. `/blog` sigue siendo un enlace muerto del sidebar.