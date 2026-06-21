import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchWithTimeout } from "@/lib/getSiteConfig";
import { buildMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/config";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

export const revalidate = 60;

const staticPosts: Record<string, { titulo: string; extracto: string; contenido: string; fecha_publicacion: string; categoria: string; autor: string; meta_title?: string; meta_description?: string }> = {
  "diferencia-entre-petroleo-y-diesel": {
    titulo: "Diferencia entre petróleo y diésel: guía para empresas chilenas",
    extracto: "Muchas empresas usan ambos términos de forma intercambiable. Te explicamos qué significa cada uno en el contexto del mercado de combustibles en Chile.",
    fecha_publicacion: "2024-01-15",
    categoria: "Técnico",
    autor: "Fenice SPA",
    contenido: `## ¿Petróleo o diésel? La confusión más común en la industria chilena

En Chile, los términos **"petróleo"** y **"diésel"** se usan frecuentemente como sinónimos en el contexto industrial, y técnicamente es correcto: cuando una empresa solicita "petróleo" para su maquinaria o generadores, en la práctica está solicitando petróleo diesel D2, que es el combustible estándar para motores de ciclo diésel.

## ¿Qué es el petróleo diésel (D2)?

El petróleo diésel, también denominado fuel oil N°2 o simplemente "diésel", es un destilado del petróleo crudo que se obtiene durante el proceso de refinación. En Chile, la Empresa Nacional del Petróleo (ENAP) regula las especificaciones técnicas de este combustible.

Sus características principales son:
- **Densidad:** 820-845 kg/m³ a 15°C
- **Punto de inflamación:** mínimo 55°C
- **Contenido de azufre:** ≤50 ppm (norma Euro V)
- **Color:** amarillento, con tinte rojizo cuando lleva aditivos de trazabilidad

## ¿Para qué equipos se usa?

El petróleo diésel es el combustible de elección para:
- Maquinaria de construcción (excavadoras, cargadores frontales, motoniveladoras)
- Grupos electrógenos y generadores de emergencia
- Flotas de transporte pesado y camiones
- Calderas industriales y equipos de calefacción
- Maquinaria agrícola (tractores, cosechadoras)

## Diferencias con otros combustibles

| Característica | Petróleo diésel (D2) | Gasolina | Kerosene |
|---|---|---|---|
| Uso principal | Maquinaria, camiones, generadores | Autos particulares | Calefacción, aviación |
| Ciclo motor | Compresión (diésel) | Chispa (Otto) | Turbinas |
| Precio | Menor por litro | Mayor | Variable |

## Conclusión

Si tu empresa necesita combustible para maquinaria pesada, generadores o equipamiento industrial, el producto que necesitas es el **petróleo diésel D2**, que en Chile simplemente se denomina "petróleo" en el lenguaje cotidiano de la industria.

En Fenice SPA despachamos petróleo diésel a domicilio en la Región Metropolitana para empresas e industria.`,
  },
  "como-calcular-consumo-petroleo-industrial": {
    titulo: "Cómo calcular el consumo de petróleo industrial para tu operación",
    extracto: "Método práctico para estimar cuánto combustible necesita tu maquinaria, generadores y flotas. Incluye tabla de consumo por tipo de equipo.",
    fecha_publicacion: "2024-02-10",
    categoria: "Guías",
    autor: "Fenice SPA",
    contenido: `## Cómo calcular el consumo de petróleo para tu operación industrial

Uno de los pasos más importantes antes de contratar un servicio de despacho de petróleo a domicilio es estimar correctamente el consumo de tu operación. Un cálculo preciso evita tanto la escasez —que paraliza tu producción— como el exceso de stock, que genera costos de almacenamiento innecesarios.

## Método de cálculo por tipo de equipo

### 1. Generadores eléctricos

El consumo de un generador diésel depende principalmente de su potencia (kVA) y la carga de trabajo. Como regla general:

**Fórmula:** Litros/hora ≈ (kW × 0.27) en carga al 75%

| Potencia generador | Consumo estimado (75% carga) |
|---|---|
| 10 kVA | ~2 litros/hora |
| 50 kVA | ~9 litros/hora |
| 100 kVA | ~18 litros/hora |
| 250 kVA | ~43 litros/hora |

### 2. Maquinaria de construcción

| Equipo | Consumo estimado |
|---|---|
| Excavadora mediana (20t) | 15-20 litros/hora |
| Cargador frontal | 12-18 litros/hora |
| Motoniveladora | 15-22 litros/hora |
| Bulldozer D6 | 18-25 litros/hora |
| Camión articulado | 20-30 litros/hora |

### 3. Cálculo de stock mensual

Para calcular el volumen mensual de petróleo que necesitas:

1. Identifica cada equipo y sus horas de operación diaria
2. Multiplica consumo/hora × horas/día × días operación al mes
3. Suma todos los equipos
4. Agrega un 10-15% de margen de seguridad

**Ejemplo práctico:**
- Generador de 100 kVA operando 8 horas/día, 22 días al mes
- Consumo: 18 L/h × 8 h × 22 días = **3.168 litros/mes**
- Con margen 15%: ~3.640 litros/mes

## Recomendaciones para optimizar el consumo

1. **Mantén el equipo calibrado:** motores con filtros sucios o inyectores descalibrados pueden aumentar el consumo hasta un 20%
2. **Monitorea la temperatura ambiente:** en invierno el consumo de los generadores aumenta
3. **Registra el consumo histórico:** llevar un log mensual permite detectar anomalías de consumo tempranamente
4. **Planifica los despachos:** con un consumo estimado conocido, puedes programar entregas antes de que el estanque llegue al 20% de capacidad

Para recibir una asesoría personalizada sobre el volumen de petróleo que necesita tu operación, contáctanos por WhatsApp.`,
  },
  "mantenimiento-de-estanques-de-petroleo": {
    titulo: "Mantenimiento de estanques de petróleo: guía completa",
    extracto: "Checklist de mantenimiento preventivo para estanques de combustible y cómo evitar los problemas más comunes que afectan la operación.",
    fecha_publicacion: "2024-03-05",
    categoria: "Mantenimiento",
    autor: "Fenice SPA",
    contenido: `## Mantenimiento de estanques de petróleo: lo que toda empresa debe saber

Un estanque de almacenamiento de petróleo correctamente mantenido garantiza la calidad del combustible, la seguridad de la instalación y el cumplimiento normativo exigido por la SEC. Sin embargo, muchas empresas descuidan el mantenimiento preventivo hasta que surge un problema costoso.

## ¿Por qué es crítico el mantenimiento del estanque?

1. **Contaminación del combustible:** el agua y los sedimentos que se acumulan en el fondo del estanque pueden contaminar el petróleo y dañar los inyectores y filtros de tus equipos
2. **Corrosión:** los estanques metálicos son susceptibles a la corrosión interna y externa si no se inspeccionan periódicamente
3. **Fugas:** una fuga no detectada puede generar multas SEC, daños ambientales y riesgos de incendio
4. **Cumplimiento normativo:** la SEC puede fiscalizar el estado de tu instalación en cualquier momento

## Checklist de mantenimiento preventivo

### Revisión mensual
- [ ] Verificar nivel de combustible y registrar consumo
- [ ] Inspección visual del exterior del estanque (corrosión, humedad, daños físicos)
- [ ] Revisar hermeticidad de tapas y conexiones
- [ ] Verificar indicadores de nivel (sensor o visor)
- [ ] Inspección de válvulas de seguridad

### Revisión trimestral
- [ ] Extraer muestra de combustible del fondo para detectar agua o sedimentos
- [ ] Verificar estado de filtros y reemplazar si es necesario
- [ ] Revisar sistema de ventilación
- [ ] Comprobar señalética de seguridad y estado del extintor asociado

### Revisión anual
- [ ] Inspección interna del estanque (limpieza de sedimentos y agua del fondo)
- [ ] Prueba de hermeticidad
- [ ] Revisión del sistema de contención secundaria
- [ ] Actualización de documentación ante la SEC si corresponde

## Señales de alerta que requieren atención inmediata

- Olor a combustible en zonas donde no debería haberlo
- Humedad visible bajo el estanque
- Consumo de combustible inusualmente alto en los equipos
- Coloración oscura o turbiedad en el petróleo
- Dificultades de arranque en maquinaria abastecida desde el estanque

Para servicio de mantenimiento de estanques o instalación de nuevos equipos certificados, contáctanos en Fenice SPA.`,
  },
  "normativa-sec-almacenamiento-combustible": {
    titulo: "Normativa SEC para almacenamiento de combustible en Chile (2024)",
    extracto: "Todo lo que necesitas saber sobre el Decreto N° 160 y la NCh 2597 para instalar y operar estanques de combustible de forma legal en Chile.",
    fecha_publicacion: "2024-04-20",
    categoria: "Normativa",
    autor: "Fenice SPA",
    contenido: `## Normativa SEC para almacenamiento de combustible: lo que toda empresa debe cumplir

La instalación y operación de estanques de combustible líquido en Chile está regulada por la Superintendencia de Electricidad y Combustibles (SEC) a través de un marco normativo específico que toda empresa debe cumplir para operar legalmente y con seguridad.

## Marco normativo principal

### Decreto N° 160 (Ministerio de Economía)
Este decreto establece el Reglamento de Calderas, Autoclaves y Recipientes a Presión, y se extiende a los sistemas de almacenamiento de combustibles líquidos. Define:
- Requisitos de diseño y materiales de los estanques
- Distancias mínimas de seguridad respecto a construcciones y límites de propiedad
- Requisitos de ventilación y contención de derrames
- Obligaciones de inspección y mantenimiento

### NCh 2597 — Instalaciones de almacenamiento de petróleo
Esta norma chilena específica para combustibles líquidos establece:
- Clasificación de los productos según su punto de inflamación
- Requerimientos de diseño para estanques enterrados y superficiales
- Sistemas de contención secundaria (batea) y su capacidad mínima
- Señalética obligatoria y equipamiento contra incendios

## ¿Cuándo se requiere permiso de la SEC?

Toda instalación de almacenamiento de combustibles líquidos con capacidad superior a **450 litros** requiere:
1. Proyecto de instalación firmado por instalador autorizado SEC
2. Declaración de instalación ante la SEC
3. Certificado de instalación al término de la obra

## Infracciones y multas

La SEC puede fiscalizar instalaciones en cualquier momento. Las sanciones por incumplimiento incluyen:
- Multas desde 10 hasta 1.000 UTM
- Clausura temporal o definitiva de la instalación
- Responsabilidad civil por daños a terceros en caso de accidente

## Instalación legal con Fenice SPA

En Fenice SPA realizamos la instalación de estanques de petróleo certificados cumpliendo con toda la normativa SEC vigente. Nos encargamos del proyecto, la ejecución y la tramitación de la documentación ante la autoridad.

Contáctanos para evaluar tu situación y cotizar la instalación o regularización de tu estanque.`,
  },
  "petroleo-para-generadores-guia-completa": {
    titulo: "Petróleo para generadores eléctricos: guía completa",
    extracto: "Qué tipo de combustible necesitan los generadores, cuánto consumen y cómo calcular la autonomía de tu grupo electrógeno. Guía práctica para empresas.",
    fecha_publicacion: "2024-05-12",
    categoria: "Guías",
    autor: "Fenice SPA",
    contenido: `## Petróleo para generadores eléctricos: guía completa para empresas

Los generadores eléctricos son equipos críticos para cualquier empresa que no puede permitirse interrupciones de suministro eléctrico. Sin embargo, su correcta operación depende de contar con el combustible adecuado, en la cantidad correcta y con la calidad garantizada.

## ¿Qué tipo de petróleo usan los generadores?

Los grupos electrógenos de ciclo diésel —que son la gran mayoría de los generadores industriales— utilizan **petróleo diésel D2**, el mismo producto que se usa en camiones, buses y maquinaria pesada. En Chile, coloquialmente se denomina simplemente "petróleo".

**Especificaciones recomendadas:**
- Diésel D2 con contenido de azufre ≤50 ppm (Euro V)
- Punto de inflamación ≥55°C
- Sin presencia de agua ni sedimentos

## ¿Cuánto petróleo consume un generador?

El consumo depende de la potencia del generador y el nivel de carga. Como referencia:

| Potencia | Consumo al 50% carga | Consumo al 75% carga | Consumo al 100% carga |
|---|---|---|---|
| 20 kVA | ~2 L/h | ~3 L/h | ~4 L/h |
| 50 kVA | ~5 L/h | ~8 L/h | ~10 L/h |
| 100 kVA | ~10 L/h | ~15 L/h | ~20 L/h |
| 250 kVA | ~25 L/h | ~37 L/h | ~48 L/h |
| 500 kVA | ~48 L/h | ~72 L/h | ~94 L/h |

## Cómo calcular la autonomía de tu generador

**Fórmula:** Autonomía (horas) = Capacidad del estanque (litros) ÷ Consumo (litros/hora)

**Ejemplo:** Generador de 100 kVA con estanque de 500 litros, operando al 75% de carga:
- Consumo: ~15 L/h
- Autonomía: 500 ÷ 15 ≈ **33 horas**

## Recomendaciones para el almacenamiento de combustible de generadores

1. **Estanque de reserva adecuado:** dimensiona el estanque para al menos 72 horas de autonomía en emergencia
2. **Renovación del stock:** el petróleo almacenado más de 12 meses puede degradarse; planifica rotación de stock
3. **Tratamiento del combustible:** si almacenas por períodos largos, considera aditivos estabilizadores
4. **Despacho programado:** acuerda con tu proveedor un calendario de reabastecimiento antes de llegar al 20% del estanque

## Servicio de despacho para generadores en la RM

En Fenice SPA ofrecemos despacho de petróleo a domicilio específicamente para empresas con generadores eléctricos en la Región Metropolitana. Podemos coordinar entregas programadas o urgentes según la criticidad de tu sistema.

Contáctanos por WhatsApp para coordinar el abastecimiento de tu generador.`,
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const result = await fetchWithTimeout(
      supabase
        .from("blog_posts")
        .select("titulo, extracto, meta_title, meta_description, imagen_destacada, fecha_publicacion, updated_at")
        .eq("slug", slug)
        .eq("publicado", true)
        .single(),
      2500,
    );
    const data = result?.data;
    if (data) {
      return buildMetadata({
        title: data.meta_title || data.titulo,
        description: data.meta_description || data.extracto,
        path: `/blog/${slug}`,
        type: "article",
        image: data.imagen_destacada || undefined,
        publishedTime: data.fecha_publicacion || undefined,
        modifiedTime: data.updated_at || data.fecha_publicacion || undefined,
      });
    }
  } catch {}

  const staticPost = staticPosts[slug];
  if (!staticPost) return { title: "Post no encontrado", robots: { index: false, follow: false } };
  return buildMetadata({
    title: staticPost.meta_title || staticPost.titulo,
    description: staticPost.meta_description || staticPost.extracto,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: staticPost.fecha_publicacion,
    modifiedTime: staticPost.fecha_publicacion,
  });
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("slug").eq("publicado", true);
    const dbSlugs = (data || []).map((p) => ({ slug: p.slug }));
    const staticSlugs = Object.keys(staticPosts).map((s) => ({ slug: s }));
    return [...staticSlugs, ...dbSlugs.filter((d) => !staticPosts[d.slug])];
  } catch {
    return Object.keys(staticPosts).map((s) => ({ slug: s }));
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: { titulo: string; contenido: string; extracto: string; fecha_publicacion: string; categoria: string; autor: string; imagen_destacada?: string; updated_at?: string } | null = null;

  try {
    const supabase = await createClient();
    const result = await fetchWithTimeout(
      supabase.from("blog_posts").select("*").eq("slug", slug).eq("publicado", true).single(),
      2500,
    );
    if (result?.data) post = result.data;
  } catch {}

  if (!post) {
    post = staticPosts[slug] || null;
  }

  if (!post) notFound();

  const base = SITE_CONFIG.site_url;
  const postUrl = `${base}/blog/${slug}`;
  const postImage = post.imagen_destacada || `${base}/opengraph-image`;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.extracto,
    image: postImage,
    author: { "@type": "Organization", name: post.autor || "Fenice SPA", url: `${base}/` },
    publisher: { "@id": `${base}/#organization` },
    datePublished: post.fecha_publicacion,
    dateModified: post.updated_at || post.fecha_publicacion,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    inLanguage: "es-CL",
    ...(post.categoria ? { articleSection: post.categoria } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb crumbs={[
          { name: "Inicio", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.titulo },
        ]} />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {post.categoria && (
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
            {post.categoria}
          </span>
        )}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
          {post.titulo}
        </h1>
        {post.fecha_publicacion && (
          <p className="text-gray-400 text-sm mb-8">
            Publicado el{" "}
            {new Date(post.fecha_publicacion).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.autor || "Fenice SPA"}
          </p>
        )}

        {/* Render markdown-ish content */}
        <div className="prose prose-gray max-w-none">
          {post.contenido.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith("- ")) return <li key={i} className="ml-4 text-gray-600">{line.slice(2)}</li>;
            if (line.startsWith("| ")) return <div key={i} className="text-sm text-gray-600 font-mono">{line}</div>;
            if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) return <li key={i} className="ml-4 text-gray-600 list-decimal">{line.slice(3)}</li>;
            if (line.startsWith("**")) return <p key={i} className="text-gray-700 font-semibold mb-2">{line.replace(/\*\*/g, "")}</p>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-gray-600 leading-relaxed mb-3">{line.replace(/\*\*([^*]+)\*\*/g, "$1")}</p>;
          })}
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8">
          <Link href="/blog" className="text-orange-600 hover:underline font-semibold">
            ← Volver al blog
          </Link>
        </div>
      </article>

      <CTASection />
    </>
  );
}
