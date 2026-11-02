# SEO y captación comercial

Fecha de revisión: 02-11-2026. Horario de referencia: America/Santiago.

## Línea base de Google Search Console

Propiedad: `sc-domain:fenice.cl`. Período de rendimiento: 31-07-2026 al 30-10-2026.

| Indicador | Valor observado |
| --- | --- |
| Clics orgánicos | 203 |
| Impresiones | Aproximadamente 4.620 |
| CTR medio | 4,4 % |
| Posición media | 11,4 |
| Páginas indexadas | 49 |
| Páginas sin indexar | 39 |

La propiedad de dominio está verificada. El sitemap registrado figura como correcto, leído el 01-11-2026 con 73 URL descubiertas antes del nuevo contenido.

La indexación corresponde al informe actualizado el 22-10-2026. Las 39 exclusiones se distribuyen en 7 redirecciones, 20 páginas descubiertas sin indexar y 12 rastreadas sin indexar. Las exclusiones incluyen recursos como fuentes, favicon, imagen Open Graph y manifiesto; su ausencia del índice de páginas no constituye por sí sola una falla SEO.

Entre las URL comerciales rastreadas sin indexar aparecen `/blog`, `/contacto`, `/petroleo-a-domicilio` y páginas de cobertura de Huechuraba y Pudahuel. También persiste una URL histórica `/blog?q={search_term_string}`. El sitio actual no declara un buscador inexistente y utiliza canonical sin parámetros para el blog.

Consultas observadas en el informe:

| Consulta | Clics | Impresiones |
| --- | --- | --- |
| fenice spa | 21 | 33 |
| fenice | 19 | 73 |
| parafina a domicilio | 6 | 70 |
| parafina a domicilio maipu | 5 | 96 |
| parafina a domicilio santiago | 4 | 200 |
| combustible a domicilio | 3 | 74 |
| parafina a domicilio puente alto | 2 | 69 |
| petroleo a domicilio | 1 | 97 |
| kerosene a domicilio | 1 | 65 |
| venta de diesel a domicilio | 1 | 62 |

Son consultas del primer bloque visible de Search Console; no representan todas las búsquedas ni permiten atribuir los 203 clics exclusivamente a marca. No hay volumen suficiente en el informe de Core Web Vitals para evaluar experiencia de usuarios reales.

## Hallazgos y correcciones

| Área | Hallazgo | Configuración resultante |
| --- | --- | --- |
| Entrada al sitio | Una animación superpuesta retrasaba el acceso comercial durante varios segundos | El contenido público y sus acciones aparecen sin esa espera artificial |
| Portada | Documentos y certificados de vehículos visibles en el inicio | La portada no consulta ni muestra el módulo documental; la gestión de flota continúa en el administrador |
| Contacto | Para iniciar una consulta era necesario navegar a formularios adicionales | Formulario rápido en inicio con nombre, teléfono, comuna y servicio |
| Registro de prospectos | La respuesta esperaba generación de PDF y canales de notificación | La respuesta se emite después de guardar; los avisos se procesan con `after` |
| Validación | El contacto admitía solicitudes sin teléfono ni correo | Se requiere un canal de contacto válido y se rechaza el campo trampa de bots |
| Blog | Base de producción sin artículos | Ocho guías originales administrables en Supabase |
| Programación | El booleano `publicado` permitía leer contenidos con fecha futura | Filtro temporal en listado, artículo, metadata, portada, servicios y sitemap; RLS restringe lectura anónima por fecha |
| Fecha y hora | La edición no ofrecía hora ni zona de publicación | Publicación en hora de Santiago, conversión a UTC y validación de cambios de horario |
| Lectura de artículos | Enlaces Markdown sin convertir y listas sin estructura completa | Markdown con enlaces, tablas, listas, subtítulos y formato semántico; HTML sin procesar deshabilitado |
| Descubrimiento | El contenido editorial no enlazaba desde las páginas comerciales | Guías en inicio y servicios, artículos relacionados y enlaces hacia cotización |
| Sitemap | Caché sin vencimiento explícito para nuevas publicaciones | Revalidación cada 60 segundos; artículos futuros excluidos |
| Metadatos | Algunas páginas heredaban tarjetas sociales genéricas | Metadata consistente para blog y página B2B; imagen y fechas por artículo |
| Identidad comercial | Organization podía diferir de LocalBusiness al cambiar configuración | Teléfono, dirección, correo e Instagram se alimentan de la misma configuración |
| Parafina | Search Console muestra demanda comercial en Santiago, Maipú y Puente Alto | Título, descripción, preguntas visibles y entradas internas hacia `/venta-kerosene` |
| Dependencias | Next.js 16.2.9 tenía avisos críticos de seguridad | Next.js y configuración ESLint actualizados a 16.4.3; parches compatibles de dependencias |

La retirada del módulo documental de la portada no revoca enlaces de archivos que ya fueron publicados en almacenamiento público. La administración conserva los documentos y su configuración de visibilidad.

## Calendario editorial cargado

| Publicación en Santiago | Artículo |
| --- | --- |
| 02-11-2026 | Cómo cotizar petróleo diésel a domicilio en Santiago |
| 02-11-2026 | Consumo de diésel de un generador: cómo planificar la carga |
| 02-11-2026 | Diésel para maquinaria pesada: planifica tu faena |
| 05-11-2026 09:00 | Despachos programados de combustible para empresas |
| 12-11-2026 09:00 | Control de combustible para flotas: registros que sirven |
| 19-11-2026 09:00 | Kerosene para calderas: planifica la compra del edificio |
| 26-11-2026 09:00 | Cómo preparar la recepción de combustible en tu empresa |
| 03-12-2026 09:00 | Cómo elegir proveedor de diésel para tu empresa |

Los artículos incluyen autor corporativo, resumen, categoría, imagen, título y descripción para buscadores y acciones comerciales. No incorporan precios ficticios, acreditaciones nuevas, reseñas inventadas ni promesas de entrega inmediata.

El contenido se administra en `/admin/blog`. Un artículo activado con fecha futura aparece como **Programado**. Las vistas públicas lo incorporan desde su fecha, con la actualización de caché y la siguiente visita; no se requiere un cron externo. La actualización no equivale a que Google lo indexe a esa hora.

## Configuración y carga en otros entornos

1. Aplicar `supabase/migration_blog_programado.sql` antes de cargar fechas futuras.
2. Para generar una transacción con la política de lectura y los ocho artículos, ejecutar `node scripts/prepare-blog-seed.mjs` y abrir el SQL resultante en el editor del proyecto Supabase correspondiente.
3. La carga utiliza `ON CONFLICT (slug) DO NOTHING`: repetirla conserva contenido y fechas que ya existan.
4. En instalaciones con la migración aplicada, el botón **Cargar 8 guías** de `/admin/blog` importa el mismo plan. Requiere un perfil activo de administrador o editor.
5. La fecha inicial se toma del día de carga en Santiago. Las cinco siguientes se programan a tres días y luego cada siete días, a las 09:00.
6. Mantener credenciales de servicio exclusivamente en el servidor. La validación local del contenido público usa la clave anónima; no requiere acceso de servicio.

## Medición y prioridades comerciales

La referencia inicial debe conservarse para comparar períodos equivalentes de 28 días. La estacionalidad de la parafina impide comparar meses de invierno y verano como si tuvieran la misma demanda.

- **Visibilidad:** impresiones y consultas no marcarias de diésel, parafina, generadores y comunas.
- **Captación:** formularios registrados y clics en WhatsApp o teléfono por página de entrada.
- **Conversión comercial:** consultas calificadas, cotizaciones emitidas y ventas confirmadas por el equipo comercial. Un clic en WhatsApp no equivale a un prospecto confirmado ni a una venta.
- **Contenido:** artículos con impresiones, CTR y solicitudes; ajustar títulos según consultas reales.
- **Indexación:** revisar páginas comerciales excluidas después de que Google vuelva a rastrearlas. Los recursos estáticos y las redirecciones no requieren forzar su indexación.

Los eventos del formulario rápido utilizan `formName=inicio_rapido`; las acciones editoriales identifican enlaces y cotización. La atribución utiliza la analítica existente, sin presentar eventos como ingresos ni ventas.

Search Console permite enviar el sitemap e inspeccionar las URL publicadas. Las solicitudes de indexación se limitan a páginas disponibles, sin reenvíos repetitivos del mismo contenido. Google decide si rastrea, indexa y posiciona cada URL.

## Disponibilidad y limitaciones observadas

Al inicio de la revisión, `fenice.cl` y `www.fenice.cl` agotaron el tiempo de respuesta en varias comprobaciones, mientras `fenice-cl.onrender.com` respondió. El dominio volvió a responder durante la sesión. El registro A observado (`216.24.57.1`) coincide con la documentación de Render. La causa de la intermitencia no quedó determinada. Conviene medir disponibilidad continua para distinguir fallas intermitentes de un incidente aislado.

El panel Supabase muestra un aviso de cuota excedida del ciclo anterior y posibles restricciones desde el 27-11-2026 si el exceso continúa. La capacidad y la facturación requieren revisión antes de esa fecha.

No se atribuyen aumentos de visitas o ventas a esta publicación sin un período de medición posterior. La posición media es una referencia agregada y no garantiza una ubicación fija en resultados de búsqueda.

## Referencias

- [Propiedad de Search Console](https://search.google.com/search-console?resource_id=sc-domain%3Afenice.cl).
- [Contenido útil y fiable](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- [Sitemaps y descubrimiento](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).
- [Dominios personalizados en Render](https://render.com/docs/custom-domains).
- [DNS para Render](https://render.com/docs/configure-other-dns).

## Verificación de la implementación

- Compilación de producción y TypeScript: correctos con Next.js 16.4.3.
- ESLint sobre los archivos modificados: correcto.
- Seis pruebas automatizadas: publicación y zona horaria, integridad editorial, validación de contactos, persistencia y notificaciones independientes.
- Recorrido HTTP de las 77 URL del sitemap en la compilación local: respuesta 200, un H1, descripción, canonical propio y JSON-LD válido como JSON.
- Cinco URL de artículos futuros y un artículo inexistente: respuesta 404.
- Redirecciones comerciales antiguas: respuesta 308 hacia la URL canónica.
- Importación editorial sin sesión: respuesta 401.
- Consulta anónima a la base de producción: tres artículos visibles y ningún artículo futuro.
- Validación de contactos sin datos: respuesta 400. Las pruebas de solicitudes válidas usan servicios simulados; no acreditan recepción real de correos ni disponibilidad de WhatsApp.
- Auditoría de dependencias de producción: sin avisos altos ni críticos; permanecen nueve avisos moderados en dependencias transitivas.

La comprobación de JSON-LD verifica sintaxis y estructura emitida; no equivale a una certificación de resultados enriquecidos de Google.
