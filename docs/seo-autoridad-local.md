# Operación SEO local y autoridad comercial

Última revisión: 12 de agosto de 2026.

Este documento separa las tareas que puede resolver el código de las que requieren
acceso del representante legal o del propietario de cada perfil. El objetivo es
conseguir búsquedas y solicitudes comerciales, no inflar métricas ni publicar datos
que la empresa no pueda demostrar.

## Datos maestros antes de publicar perfiles

Usar una sola versión de estos datos en la web, Google, Instagram y directorios:

| Campo | Valor que usa la web | Validación pendiente |
| --- | --- | --- |
| Razón social | Sociedad de Transportes y Diesel SpA | Constituida en 2023, RUT 76.710.961-K |
| Nombre comercial | Fenice SPA | Confirmar mayúsculas finales para todas las fichas |
| Dirección | Calle La Granja 8396, San Ramón | ChilePymes muestra 8350; corregir solo con domicilio tributario vigente a la vista |
| Teléfono | +56 9 3957 9658 | Confirmar que será el número público permanente |
| Web | https://fenice.cl/ | Añadir UTM solo en enlaces de perfiles externos |
| Horario | Lun–Vie 09:00–19:00 | Mantener igual en todos los canales |
| Instagram | @fenice.combustible | También aparece @fenice.spa; decidir cuál es oficial antes de cambiar `sameAs` |

No crear una segunda ficha de Google si ya existe una. Primero buscar por razón
social, nombre comercial, teléfono y dirección; reclamar o corregir la existente.

## Prioridad 1: despliegue y Google Search Console

1. Desplegar la rama SEO.
2. Configurar `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` con el token de la propiedad.
3. Comprobar mediante inspección en vivo que `https://fenice.cl/sitemap.xml` responde.
4. Enviar `sitemap.xml` en Search Console.
5. Solicitar indexación de estas URL en este orden:
   - `/venta-petroleo-diesel`
   - `/venta-kerosene`
   - `/petroleo-a-domicilio`
   - `/servicios/instalacion-de-estanques`
   - `/servicios/transporte-de-combustible-rm`
   - `/empresas-faenas-flotas`
6. Revisar semanalmente páginas indexadas, consultas, clics, CTR y conversiones.

Guía oficial: https://support.google.com/webmasters/answer/7451001

## Prioridad 2: Perfil de Empresa en Google

Completar o reclamar una sola ficha y usar:

- Categoría primaria: elegir la categoría disponible que describa el servicio real
  de distribución/provisión de combustible, no una estación de servicio si el
  público no carga combustible en la dirección.
- Área de servicio: solo regiones o comunas que puedan atenderse de verdad.
- Servicios: diésel para empresas, kerosene/parafina a domicilio, combustible para
  generadores y maquinaria, transporte e instalación de estanques.
- Página de destino: `https://fenice.cl/?utm_source=google&utm_medium=organic&utm_campaign=perfil_empresa`
- Teléfono, horario y descripción idénticos a los datos maestros.
- Fotografías propias de camiones, operación y equipo; evitar imágenes de stock.

Las reseñas se piden a clientes reales después de una entrega. No comprar reseñas,
no ofrecer descuentos a cambio y no indicar qué texto deben escribir. Responder cada
reseña con datos útiles, sin revelar información comercial privada.

Guías oficiales:

- https://support.google.com/business/answer/7091
- https://support.google.com/business/answer/3474122

## Prioridad 3: proveedores B2B y compras públicas

La razón social ya aparece asociada públicamente a compras ágiles. El representante
debe revisar que la Ficha de Proveedor de Mercado Público esté hábil, completa y con
web, rubros, antecedentes y documentos vigentes. Desde diciembre de 2024 se exige
inscripción y estado hábil para contratar con el Estado.

- Registro oficial: https://www.chilecompra.cl/registro-de-proveedores/
- Alta como proveedor: https://www.chilecompra.cl/registrate-como-proveedor-del-estado/
- RedNegocios: https://rednegocios.cl/

En RedNegocios, registrar categorías estrictamente relacionadas con suministro y
transporte de combustibles. La acreditación y documentos deben cargarlos personas
autorizadas por la empresa.

## Prioridad 4: citas y enlaces que sí aportan autoridad

1. Corregir la ficha de ChilePymes cuando se confirme la dirección oficial y añadir
   teléfono, horario y `https://fenice.cl/` si la plataforma lo permite.
2. Pedir a clientes que autoricen un caso de éxito con operación, comuna y resultado
   verificable; publicar el caso en Fenice y solicitar un enlace desde el cliente.
3. Pedir a proveedores, asociaciones gremiales y plataformas donde Fenice esté
   acreditada que enlacen la página de servicio correspondiente, no siempre la home.
4. Publicar dos contenidos útiles por mes solo cuando exista experiencia real para
   sostenerlos: cálculo de consumo, recepción segura, planificación de abastecimiento,
   documentación y selección de estanques.
5. Reutilizar cada contenido en Instagram y LinkedIn con enlace UTM a la página
   comercial relacionada.

Evitar paquetes de backlinks, notas de prensa sin noticia, directorios masivos,
anclas repetidas y páginas creadas únicamente para intercambiar enlaces.

## Medición mínima

La atribución interna clasifica Google, Bing, DuckDuckGo y Yahoo como `organic`.
Registrar mensualmente:

| Indicador | Fuente | Objetivo operativo |
| --- | --- | --- |
| Consultas no marcarias | Search Console | Crecimiento sostenido en diésel, kerosene y comunas |
| CTR por página | Search Console | Mejorar títulos y descripciones de páginas con impresiones |
| Cotizaciones orgánicas | Analítica Fenice | Medir formulario y clic en WhatsApp |
| Tasa lead/clic orgánico | Analítica Fenice | Priorizar páginas que generan negocio |
| Llamadas y solicitudes | Perfil de Empresa | Comparar con búsquedas y páginas de destino |
| Reseñas reales | Perfil de Empresa | Flujo constante, sin campañas artificiales |

No declarar éxito por posiciones aisladas. La métrica principal es la cantidad y
calidad de cotizaciones provenientes de búsquedas no marcarias.
