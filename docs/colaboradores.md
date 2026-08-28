# Colaboradores / empresas asociadas

## Qué es

Sección pública en la Home (`data-analytics-section="colaboradores"`, entre
"Certificaciones" y "Cobertura") con el carrusel de logos **"Colaboradores que
trabajan con nosotros"**, más el módulo administrativo `/admin/colaboradores`
para gestionarlos.

Es un módulo distinto de `/admin/clientes`: *clientes* son empresas a las que
Fenice abastece (aparecen en `/clientes` y en el marquee "Empresas que
abastecemos"); *colaboradores* son proveedores, marcas y organizaciones
asociadas. No se tocó ninguna de las dos cosas de la otra.

## Modelo de datos (`supabase/migration_collaborators.sql`)

Tabla `collaborators`:

| Columna | Notas |
| --- | --- |
| `name` | Obligatorio. `check` de 1–120 caracteres útiles. |
| `logo_url` | URL pública del objeto en Storage. `check` de esquema http/https. |
| `logo_path` | Ruta dentro del bucket. **Necesaria** para borrar el archivo al reemplazar o eliminar y no dejar huérfanos. |
| `website_url` | Opcional. `check` que sólo admite `http://` o `https://`. |
| `alt_text` | Opcional; si viene vacío se guarda `Logo de {name}`. |
| `display_order` | 0–9999. El panel renumera 1..n al reordenar. |
| `is_active` | Sólo los activos salen en el carrusel. |

Las validaciones importantes están **en la base**, no sólo en el formulario:
aunque alguien use la API con una sesión de admin, no puede insertar un
`javascript:` en `website_url` ni un nombre vacío.

`updated_at` se mantiene con la función genérica `update_updated_at_column()`
que ya existía en el proyecto (creada en `migration_website_videos.sql`); no se
duplicó.

## RLS

- `anon` y `authenticated`: `select` **sólo** de `is_active = true`.
- `authenticated` (= admin, mismo criterio que el resto del proyecto):
  `select` completo + `insert` / `update` / `delete`.
- No existe ninguna política de escritura para `anon`.

El gate real de "¿es un admin activo?" lo sigue aplicando
`src/app/admin/layout.tsx` contra `admin_profiles.activo`, igual que en los
demás módulos.

## Storage

Bucket `collaborators-logos`: público para lectura, 5 MB, MIME limitado a
`image/png`, `image/jpeg`, `image/jpg`, `image/webp`.

**SVG queda fuera a propósito.** Un SVG es un documento ejecutable y se serviría
desde el dominio de Supabase; sanitizarlo con garantías exige una dependencia
extra. Como el panel convierte todo a WebP antes de subir, no hace falta.

Rutas: `{slug}/{slug}-{timestamp}-{aleatorio}.webp`. El nombre **nunca** se
deriva del `file.name` del navegador — se construye en `buildLogoPath()` a
partir del nombre del colaborador, así que no hay path traversal ni colisiones.

## Optimización de imágenes

`src/lib/admin/collaboratorUpload.ts` convierte el logo a WebP con canvas y lo
reescala a 480 px de ancho antes de subirlo, con calidad 0.92 para no degradar
las tipografías del logo. La transparencia se conserva. Si el navegador no
puede procesarlo, sube el original: la subida nunca falla por la optimización.

## Carrusel

`src/components/colaboradores/CollaboratorsCarouselClient.tsx` — sin
dependencias nuevas. Es un contenedor con scroll nativo (`overflow-x: auto`) y
un bucle de `requestAnimationFrame` que avanza `scrollLeft` a 32 px/s.

De ahí salen gratis el swipe táctil y el desplazamiento manual. El loop
infinito se logra envolviendo `scrollLeft` al ancho de **una** copia de la
lista: el contenido se repite exactamente cada `setWidth` px, así que el salto
es invisible. El número de copias se calcula tras medir, de modo que funciona
igual con 1 colaborador que con 30.

Se pausa al pasar el mouse, al tocar, al usar la rueda, al enfocar con teclado
y cuando la sección no está en pantalla. Con `prefers-reduced-motion: reduce`
no hay animación: se renderiza una sola copia en `flex-wrap` centrado.

Sólo la primera copia se expone a lectores de pantalla y al foco; las copias de
relleno van con `aria-hidden` y sin enlaces, para no duplicar contenido ni
dejar elementos focalizables dentro de una región oculta.

Las tarjetas tienen alto y ancho fijos por breakpoint (~2 logos en móvil, 3–5
en tablet, 5–7 en escritorio) y el logo va con `object-contain`: nunca se
deforma, y al reservar el espacio no hay CLS.

Si no hay colaboradores activos, `CollaboratorsSection` devuelve `null`: no se
renderiza el título con un carrusel vacío.

## Panel

`/admin/colaboradores` es una sola página: formulario arriba, tabla debajo.
Todo el CRUD ocurre en el cliente contra Supabase y actualiza el estado local
sin recargar; tras cada mutación se llama a `/api/revalidate?path=/` para
refrescar el ISR de la Home.

- Contadores Total / Activos / Inactivos, en vivo.
- Buscador (nombre, URL, ALT) y filtros Todos / Activos / Inactivos.
- Ordenamiento por nombre, fecha, orden y estado.
- Reordenamiento por drag & drop (sólo con la lista completa sin filtrar) y por
  flechas ↑↓, que funcionan siempre — incluido en móvil.
- Al reemplazar un logo, el archivo anterior se borra **después** de confirmar
  el `UPDATE`. Si el `UPDATE` falla, se borra el logo recién subido. En ninguno
  de los dos caminos queda un huérfano.

Los errores técnicos de Supabase van a `console.error`; al usuario se le
muestra un mensaje accionable.

## Ampliaciones futuras

Los campos previstos (descripción, categoría, destacado, logo claro/oscuro,
tipo de alianza, página individual) se agregan con un `alter table` más su
columna en `ADMIN_COLLABORATOR_COLUMNS` / `PUBLIC_COLLABORATOR_COLUMNS` y un
campo en el formulario. Ni el carrusel ni la tabla asumen el conjunto actual de
columnas.
