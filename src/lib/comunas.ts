// Fuente única de verdad de la cobertura de despacho.
//
// Incluye las 52 comunas de la Región Metropolitana (organizadas por provincia)
// más Valparaíso y Rancagua. Cada comuna tiene contenido propio (contexto y
// beneficios) para que su landing de cobertura sea única y no contenido duplicado
// —clave para el SEO local—. Las páginas se generan estáticamente desde esta lista
// vía una ruta dinámica, y los menús/formularios/sitemap derivan de aquí.

export interface Comuna {
  nombre: string;
  slug: string;
  region: string; // Región administrativa (para schema y textos)
  provincia: string; // Provincia (agrupa la RM en la página de cobertura)
  sector: string; // Ubicación relativa: "poniente", "norte", etc.
  perfil: string; // Perfil de clientes dominante
  contexto: string; // Párrafo de contexto único
  beneficios: string[]; // 3-4 bullets únicos
}

const RM = "Región Metropolitana";

export const COMUNAS_COBERTURA: Comuna[] = [
  // ───────────────────────── Provincia de Santiago ─────────────────────────
  {
    nombre: "Santiago", slug: "santiago", region: RM, provincia: "Provincia de Santiago",
    sector: "centro", perfil: "comercial, corporativo y de servicios",
    contexto:
      "Santiago Centro es el corazón administrativo, comercial y financiero de Chile, con una altísima densidad de edificios de oficinas, servicios públicos, comercio y hotelería. Estas edificaciones dependen de generadores de respaldo que requieren reabastecimiento periódico de petróleo diesel para mantener la continuidad operativa.",
    beneficios: [
      "Edificios de oficinas y torres de servicios con generadores de emergencia",
      "Hoteles y comercio de alta afluencia con sistemas de respaldo",
      "Instituciones públicas y educativas con energía crítica",
      "Estacionamientos subterráneos y salas de servidores con grupos electrógenos",
    ],
  },
  {
    nombre: "Cerrillos", slug: "cerrillos", region: RM, provincia: "Provincia de Santiago",
    sector: "poniente", perfil: "industrial y logístico en renovación",
    contexto:
      "Cerrillos combina un histórico polo industrial con el desarrollo del Parque Bicentenario y nuevos parques logísticos sobre los terrenos del antiguo aeropuerto. Conviven manufactura, bodegas y empresas de servicios que demandan combustible para maquinaria y generación de respaldo.",
    beneficios: [
      "Plantas manufactureras tradicionales del cordón industrial",
      "Centros logísticos y bodegas de distribución",
      "Constructoras y proyectos inmobiliarios del Parque Bicentenario",
      "Talleres y empresas de servicios con maquinaria propia",
    ],
  },
  {
    nombre: "Cerro Navia", slug: "cerro-navia", region: RM, provincia: "Provincia de Santiago",
    sector: "poniente", perfil: "residencial con pequeña y mediana industria",
    contexto:
      "Cerro Navia es una comuna mayoritariamente residencial del poniente de Santiago, con una base de pequeñas y medianas empresas, talleres y manufactura ligera. El despacho a domicilio facilita el abastecimiento de combustible a negocios que no cuentan con estanques de gran capacidad.",
    beneficios: [
      "Talleres y pymes manufactureras del sector poniente",
      "Empresas de transporte y distribución local",
      "Panaderías, lavanderías y negocios con equipos a diesel",
      "Constructoras con obras de vivienda y urbanización",
    ],
  },
  {
    nombre: "Conchalí", slug: "conchali", region: RM, provincia: "Provincia de Santiago",
    sector: "norte", perfil: "residencial-industrial",
    contexto:
      "Conchalí es una comuna del norte de Santiago con un tejido de pymes, talleres metalúrgicos y comercio que conviven con zonas residenciales densas. La demanda de combustible proviene principalmente de la mediana industria y de generadores de respaldo.",
    beneficios: [
      "Talleres metalúrgicos y de mantenimiento industrial",
      "Empresas de transporte y logística local",
      "Comercio y bodegas con equipos de respaldo",
      "Constructoras con proyectos de densificación urbana",
    ],
  },
  {
    nombre: "El Bosque", slug: "el-bosque", region: RM, provincia: "Provincia de Santiago",
    sector: "sur", perfil: "industrial y aeronáutico",
    contexto:
      "El Bosque alberga un importante cordón industrial en el sur de Santiago y la base aérea que le da nombre, con actividad manufacturera, metalmecánica y de servicios aeronáuticos. Estas operaciones requieren suministro constante de combustible para maquinaria y generación.",
    beneficios: [
      "Industria metalmecánica y manufacturera del sector sur",
      "Empresas de servicios aeronáuticos y mantenimiento",
      "Bodegas y centros de distribución",
      "Constructoras y empresas de movimiento de tierra",
    ],
  },
  {
    nombre: "Estación Central", slug: "estacion-central", region: RM, provincia: "Provincia de Santiago",
    sector: "centro-poniente", perfil: "comercial, universitario y de transporte",
    contexto:
      "Estación Central es un nodo de transporte y comercio mayorista de gran movimiento, con terminales de buses, universidades y galerías comerciales de alta afluencia. Los generadores de respaldo de estas instalaciones y el comercio mayorista requieren abastecimiento regular de combustible.",
    beneficios: [
      "Terminales de buses y empresas de transporte interurbano",
      "Universidades e institutos con energía de respaldo",
      "Comercio mayorista y galerías con generadores",
      "Hoteles y edificios comerciales de alta ocupación",
    ],
  },
  {
    nombre: "Huechuraba", slug: "huechuraba", region: RM, provincia: "Provincia de Santiago",
    sector: "norte", perfil: "corporativo e industrial",
    contexto:
      "Huechuraba concentra Ciudad Empresarial, uno de los polos corporativos más importantes de Santiago, junto a parques industriales y centros logísticos en el sector norte. La alta densidad de oficinas y bodegas hace indispensable el suministro de petróleo para grupos electrógenos.",
    beneficios: [
      "Ciudad Empresarial: torres corporativas con generadores de alto kVA",
      "Centros de datos y empresas de tecnología",
      "Parques industriales y centros de distribución",
      "Clínicas y edificios con respaldo energético crítico",
    ],
  },
  {
    nombre: "Independencia", slug: "independencia", region: RM, provincia: "Provincia de Santiago",
    sector: "norte", perfil: "salud, educación e industria ligera",
    contexto:
      "Independencia es un polo de salud y educación superior —con hospitales y facultades de medicina— además de comercio e industria ligera. Los establecimientos de salud dependen de generadores de emergencia con reabastecimiento crítico de combustible.",
    beneficios: [
      "Hospitales y centros de salud con respaldo energético crítico",
      "Facultades universitarias y centros de investigación",
      "Comercio e industria textil del sector norte",
      "Bodegas y empresas de distribución",
    ],
  },
  {
    nombre: "La Cisterna", slug: "la-cisterna", region: RM, provincia: "Provincia de Santiago",
    sector: "sur", perfil: "comercial y de transporte",
    contexto:
      "La Cisterna es un centro comercial y de conectividad del sur de Santiago, con su estación intermodal, comercio de alta afluencia y pymes de servicios. La demanda de combustible se concentra en el transporte y en los generadores del comercio.",
    beneficios: [
      "Estación intermodal y empresas de transporte",
      "Comercio y supermercados con generadores de respaldo",
      "Pymes de servicios y talleres",
      "Constructoras con proyectos de densificación",
    ],
  },
  {
    nombre: "La Florida", slug: "la-florida", region: RM, provincia: "Provincia de Santiago",
    sector: "sur-oriente", perfil: "residencial masivo y comercial",
    contexto:
      "La Florida es una de las comunas más pobladas de Santiago, con grandes centros comerciales, clínicas y edificaciones residenciales de alta densidad. Los malls, clínicas y condominios cuentan con generadores de emergencia que requieren petróleo diesel de forma periódica.",
    beneficios: [
      "Centros comerciales y malls con grupos electrógenos",
      "Clínicas y centros médicos con respaldo crítico",
      "Condominios y edificios residenciales de alta densidad",
      "Constructoras con proyectos inmobiliarios activos",
    ],
  },
  {
    nombre: "La Granja", slug: "la-granja", region: RM, provincia: "Provincia de Santiago",
    sector: "sur", perfil: "base operativa de Fenice SPA",
    contexto:
      "La Granja es la base operativa de Fenice SPA, desde donde coordinamos el despacho de petróleo a domicilio hacia toda la Región Metropolitana. Al estar en la comuna, ofrecemos a las empresas locales tiempos de respuesta especialmente ágiles para pedidos programados o urgentes.",
    beneficios: [
      "Tiempos de despacho mínimos por cercanía a nuestra base",
      "Pymes, talleres e industria ligera del sector sur",
      "Empresas de transporte y logística local",
      "Constructoras y condominios con generadores de respaldo",
    ],
  },
  {
    nombre: "La Pintana", slug: "la-pintana", region: RM, provincia: "Provincia de Santiago",
    sector: "sur", perfil: "agroindustrial e industrial",
    contexto:
      "La Pintana combina actividad industrial con un importante polo agroalimentario, incluyendo empresas de proceso, packing y el entorno del mercado mayorista. La maquinaria y las cámaras de frío de estas operaciones demandan combustible de manera continua.",
    beneficios: [
      "Empresas agroalimentarias y plantas de proceso",
      "Cámaras de frío y packing con generadores",
      "Industria y bodegas del sector sur",
      "Constructoras y empresas de urbanización",
    ],
  },
  {
    nombre: "La Reina", slug: "la-reina", region: RM, provincia: "Provincia de Santiago",
    sector: "oriente", perfil: "residencial y de servicios",
    contexto:
      "La Reina es una comuna residencial del sector oriente, con comercio de barrio, colegios y edificios que cuentan con sistemas de respaldo energético. El despacho a domicilio abastece a establecimientos educativos, de salud y condominios.",
    beneficios: [
      "Colegios y establecimientos educativos con generadores",
      "Centros médicos y consultas privadas",
      "Condominios y edificios residenciales",
      "Comercio y empresas de servicios de barrio",
    ],
  },
  {
    nombre: "Las Condes", slug: "las-condes", region: RM, provincia: "Provincia de Santiago",
    sector: "oriente", perfil: "corporativo y tecnológico",
    contexto:
      "Las Condes concentra las sedes corporativas más importantes de Chile, con edificios de oficinas de alta tecnología que cuentan con sistemas de generación eléctrica de emergencia. Además, la presencia de clínicas, centros de datos y edificaciones de alta complejidad hace indispensable el abastecimiento regular de petróleo para grupos electrógenos.",
    beneficios: [
      "Torres corporativas con generadores de emergencia de alto kVA",
      "Clínicas y centros médicos con sistemas de respaldo crítico",
      "Centros de datos y empresas de telecomunicaciones",
      "Hoteles y centros de convenciones con generadores propios",
    ],
  },
  {
    nombre: "Lo Barnechea", slug: "lo-barnechea", region: RM, provincia: "Provincia de Santiago",
    sector: "oriente cordillerano", perfil: "cordillerano, minero y de construcción",
    contexto:
      "Lo Barnechea se extiende hacia la cordillera y es puerta de acceso a faenas mineras, centros de esquí y grandes proyectos inmobiliarios de alta montaña. Las faenas y la construcción en altura requieren combustible para maquinaria y generación en zonas sin red eléctrica estable.",
    beneficios: [
      "Faenas y proveedores de la minería cordillerana",
      "Centros de esquí y turismo de montaña con generadores",
      "Grandes proyectos inmobiliarios y de construcción",
      "Condominios de alta montaña con respaldo energético",
    ],
  },
  {
    nombre: "Lo Espejo", slug: "lo-espejo", region: RM, provincia: "Provincia de Santiago",
    sector: "sur", perfil: "logístico e industrial",
    contexto:
      "Lo Espejo es un nodo logístico e industrial del sur de Santiago, en el entorno del mercado mayorista Lo Valledor y de importantes centros de distribución. El transporte de carga y las cámaras de frío generan una demanda sostenida de combustible.",
    beneficios: [
      "Mercado mayorista y empresas de distribución de alimentos",
      "Centros logísticos y flotas de transporte de carga",
      "Cámaras de frío y plantas con generadores",
      "Talleres e industria del cordón sur",
    ],
  },
  {
    nombre: "Lo Prado", slug: "lo-prado", region: RM, provincia: "Provincia de Santiago",
    sector: "poniente", perfil: "residencial con comercio y pymes",
    contexto:
      "Lo Prado es una comuna residencial del poniente con comercio de barrio y pequeñas empresas de servicios y manufactura. El despacho a domicilio facilita el abastecimiento de negocios y generadores que no cuentan con grandes estanques.",
    beneficios: [
      "Pymes de manufactura y servicios del sector poniente",
      "Comercio y bodegas con equipos a diesel",
      "Empresas de transporte y distribución local",
      "Constructoras con proyectos de vivienda",
    ],
  },
  {
    nombre: "Macul", slug: "macul", region: RM, provincia: "Provincia de Santiago",
    sector: "centro-oriente", perfil: "industrial ligero y universitario",
    contexto:
      "Macul combina zonas industriales ligeras, campus universitarios y comercio, con edificaciones que cuentan con generación de respaldo. La demanda proviene de la mediana industria, la educación superior y los condominios.",
    beneficios: [
      "Campus universitarios y centros de estudio con respaldo",
      "Industria ligera y talleres del sector",
      "Comercio y edificios con generadores de emergencia",
      "Constructoras con proyectos de densificación",
    ],
  },
  {
    nombre: "Maipú", slug: "maipu", region: RM, provincia: "Provincia de Santiago",
    sector: "poniente", perfil: "industrial y residencial de gran escala",
    contexto:
      "Maipú es una de las comunas más densas e industrializadas del poniente de Santiago. Cuenta con numerosos parques industriales, empresas de logística y construcciones de gran envergadura que requieren abastecimiento constante de combustible para maquinaria, generadores y flotas. Fenice SPA cubre Maipú con despacho de petróleo a domicilio para operaciones de cualquier tamaño.",
    beneficios: [
      "Plantas industriales y fábricas con consumo regular de diesel",
      "Empresas constructoras con obras activas en la comuna",
      "Empresas de logística y transporte pesado",
      "Condominios y edificios con generadores de emergencia",
    ],
  },
  {
    nombre: "Ñuñoa", slug: "nunoa", region: RM, provincia: "Provincia de Santiago",
    sector: "centro-oriente", perfil: "residencial y comercial de alta densidad",
    contexto:
      "Ñuñoa es una comuna residencial y comercial de alta densidad, con numerosos edificios, colegios, clínicas y recintos deportivos. Los generadores de emergencia de estas edificaciones requieren reabastecimiento periódico de petróleo diesel.",
    beneficios: [
      "Edificios residenciales de alta densidad con generadores",
      "Clínicas y centros médicos con respaldo crítico",
      "Colegios y recintos deportivos",
      "Comercio y empresas de servicios",
    ],
  },
  {
    nombre: "Pedro Aguirre Cerda", slug: "pedro-aguirre-cerda", region: RM, provincia: "Provincia de Santiago",
    sector: "sur-poniente", perfil: "industrial y manufacturero",
    contexto:
      "Pedro Aguirre Cerda es un cordón industrial tradicional del sur poniente de Santiago, con plantas manufactureras, talleres y bodegas de larga trayectoria. Estas operaciones demandan combustible de forma regular para maquinaria y generación.",
    beneficios: [
      "Plantas manufactureras del cordón industrial",
      "Talleres metalmecánicos y de mantenimiento",
      "Bodegas y centros de distribución",
      "Empresas de transporte y logística",
    ],
  },
  {
    nombre: "Peñalolén", slug: "penalolen", region: RM, provincia: "Provincia de Santiago",
    sector: "oriente", perfil: "residencial y precordillerano",
    contexto:
      "Peñalolén se extiende desde zonas residenciales densas hasta la precordillera, con comercio, colegios y proyectos inmobiliarios en expansión. La demanda de combustible proviene de generadores de respaldo y de la construcción en el sector alto.",
    beneficios: [
      "Condominios y edificios residenciales con generadores",
      "Colegios y centros educativos",
      "Constructoras con proyectos en la precordillera",
      "Comercio y empresas de servicios de barrio",
    ],
  },
  {
    nombre: "Providencia", slug: "providencia", region: RM, provincia: "Provincia de Santiago",
    sector: "centro-oriente", perfil: "comercial y corporativo",
    contexto:
      "Providencia es uno de los centros comerciales y de servicios más activos de Santiago, con una densa concentración de edificios de oficinas, hoteles, centros de salud y comercio. Los generadores de emergencia en estas instalaciones requieren mantenimiento y reabastecimiento periódico de combustible para garantizar la continuidad operacional.",
    beneficios: [
      "Edificios de oficinas y centros comerciales con generadores",
      "Hoteles y residencias de alta ocupación con sistema de respaldo",
      "Clínicas privadas y centros de salud con suministro crítico",
      "Centros educativos con sistemas de emergencia energética",
    ],
  },
  {
    nombre: "Pudahuel", slug: "pudahuel", region: RM, provincia: "Provincia de Santiago",
    sector: "poniente-norte", perfil: "logístico e industrial",
    contexto:
      "Pudahuel es el corazón logístico de Santiago, sede del Aeropuerto Internacional Comodoro Arturo Merino Benítez y de los principales centros de distribución de la RM. La alta concentración de empresas de carga, transporte y bodegas hace de esta zona un área de alta demanda de combustible industrial.",
    beneficios: [
      "Empresas de transporte de carga y logística aeroportuaria",
      "Centros de distribución y bodegas de gran volumen",
      "Plantas de manufactura en el parque industrial de Pudahuel",
      "Contratistas de obra con maquinaria pesada",
    ],
  },
  {
    nombre: "Quilicura", slug: "quilicura", region: RM, provincia: "Provincia de Santiago",
    sector: "norte", perfil: "industrial y de parques de negocios",
    contexto:
      "Quilicura concentra algunos de los parques industriales y logísticos más modernos del norte de Santiago. El crecimiento sostenido de la comuna ha traído consigo una gran cantidad de empresas manufactureras, bodegas y centros de distribución con alta demanda de combustible para maquinaria y generadores.",
    beneficios: [
      "Parques industriales con múltiples empresas locatarias",
      "Centros logísticos y de distribución de escala nacional",
      "Empresas de construcción activas en el sector norte",
      "Bodegas y almacenes con sistemas de generación de respaldo",
    ],
  },
  {
    nombre: "Quinta Normal", slug: "quinta-normal", region: RM, provincia: "Provincia de Santiago",
    sector: "centro-poniente", perfil: "industrial tradicional y logístico",
    contexto:
      "Quinta Normal es una comuna de tradición industrial y logística, con bodegas, imprentas y manufactura en el sector poniente del centro de Santiago. El despacho a domicilio abastece a estas operaciones y a sus generadores de respaldo.",
    beneficios: [
      "Bodegas y centros de almacenamiento",
      "Imprentas e industria gráfica con equipos a diesel",
      "Manufactura y talleres del sector poniente",
      "Empresas de transporte y distribución",
    ],
  },
  {
    nombre: "Recoleta", slug: "recoleta", region: RM, provincia: "Provincia de Santiago",
    sector: "norte", perfil: "comercio, textil y salud",
    contexto:
      "Recoleta es un polo de comercio mayorista e industria textil —en torno a Patronato y La Vega— además de importantes recintos de salud. El comercio de alta afluencia y los establecimientos de salud requieren respaldo energético con reabastecimiento de combustible.",
    beneficios: [
      "Comercio mayorista y galerías con generadores",
      "Industria textil y de confección",
      "Hospitales y centros de salud con respaldo crítico",
      "Bodegas y empresas de distribución",
    ],
  },
  {
    nombre: "Renca", slug: "renca", region: RM, provincia: "Provincia de Santiago",
    sector: "norponiente", perfil: "industrial pesado y logístico",
    contexto:
      "Renca alberga uno de los cordones industriales y logísticos más importantes del norponiente de Santiago, con parques industriales, empresas de energía y grandes centros de distribución. La demanda de combustible es alta y constante para maquinaria y flotas.",
    beneficios: [
      "Parques industriales y plantas de manufactura pesada",
      "Empresas de energía y servicios industriales",
      "Centros logísticos y flotas de transporte de carga",
      "Constructoras con faenas de gran envergadura",
    ],
  },
  {
    nombre: "San Joaquín", slug: "san-joaquin", region: RM, provincia: "Provincia de Santiago",
    sector: "sur", perfil: "industrial y universitario",
    contexto:
      "San Joaquín combina un cordón industrial consolidado con campus universitarios y centros de investigación en el sur de Santiago. La mediana y gran industria, junto a los recintos educativos, demandan combustible para maquinaria y generación de respaldo.",
    beneficios: [
      "Plantas industriales y manufactura del cordón sur",
      "Campus universitarios y centros de investigación",
      "Bodegas y centros de distribución",
      "Talleres y empresas de mantenimiento de maquinaria",
    ],
  },
  {
    nombre: "San Miguel", slug: "san-miguel", region: RM, provincia: "Provincia de Santiago",
    sector: "sur", perfil: "industrial y residencial en densificación",
    contexto:
      "San Miguel es una comuna de tradición industrial que vive un fuerte proceso de densificación residencial, con nuevos edificios junto a plantas y bodegas. Conviven la demanda de la industria y la de generadores de respaldo de los edificios.",
    beneficios: [
      "Industria y manufactura del sector sur",
      "Edificios residenciales nuevos con generadores",
      "Comercio y empresas de servicios",
      "Constructoras con proyectos inmobiliarios activos",
    ],
  },
  {
    nombre: "San Ramón", slug: "san-ramon", region: RM, provincia: "Provincia de Santiago",
    sector: "sur", perfil: "residencial con pymes y comercio",
    contexto:
      "San Ramón es una comuna residencial del sur de Santiago con una base de pymes, talleres y comercio local. El despacho a domicilio abastece a negocios y generadores que requieren combustible sin grandes capacidades de almacenamiento.",
    beneficios: [
      "Pymes y talleres del sector sur",
      "Comercio y bodegas con equipos a diesel",
      "Empresas de transporte y distribución local",
      "Constructoras con proyectos de vivienda",
    ],
  },
  {
    nombre: "Vitacura", slug: "vitacura", region: RM, provincia: "Provincia de Santiago",
    sector: "oriente", perfil: "corporativo y residencial de alto estándar",
    contexto:
      "Vitacura es un sector corporativo y residencial de alto estándar, con edificios de oficinas, comercio premium y clínicas que cuentan con sistemas de generación de emergencia. Estos grupos electrógenos requieren reabastecimiento periódico de petróleo diesel.",
    beneficios: [
      "Torres corporativas y oficinas con generadores de emergencia",
      "Comercio premium y hotelería con respaldo energético",
      "Clínicas y centros médicos con suministro crítico",
      "Edificios residenciales de alto estándar",
    ],
  },

  // ───────────────────────── Provincia de Cordillera ─────────────────────────
  {
    nombre: "Puente Alto", slug: "puente-alto", region: RM, provincia: "Provincia de Cordillera",
    sector: "sur-oriente", perfil: "industrial, residencial y minero",
    contexto:
      "Puente Alto es la comuna más poblada de Chile y tiene un perfil dual: residencial masivo y puerta de entrada a la actividad minera y de construcción del sector cordillerano. La demanda de combustible es alta tanto para generadores residenciales de emergencia como para maquinaria de construcción y empresas de servicios.",
    beneficios: [
      "Empresas de construcción con proyectos inmobiliarios activos",
      "Proveedores de servicios para la minería del sector cordillerano",
      "Condominios y edificios de alto consumo energético",
      "Flotas de maquinaria para movimiento de tierra",
    ],
  },
  {
    nombre: "Pirque", slug: "pirque", region: RM, provincia: "Provincia de Cordillera",
    sector: "sur-oriente", perfil: "agrícola y vitivinícola",
    contexto:
      "Pirque es una comuna rural y vitivinícola del piedemonte cordillerano, con viñas de prestigio, agroindustria y parcelas de agrado. La maquinaria agrícola, el riego y los generadores de respaldo demandan combustible especialmente en temporada.",
    beneficios: [
      "Viñas y bodegas con maquinaria de vendimia",
      "Empresas agrícolas y de agroindustria",
      "Parcelas y condominios rurales con generadores",
      "Constructoras y proyectos en el piedemonte",
    ],
  },
  {
    nombre: "San José de Maipo", slug: "san-jose-de-maipo", region: RM, provincia: "Provincia de Cordillera",
    sector: "cordillera", perfil: "cordillerano, minero y energético",
    contexto:
      "San José de Maipo es una comuna cordillerana donde se desarrollan faenas mineras, proyectos hidroeléctricos y turismo de montaña, muchas veces en zonas sin red eléctrica estable. Estas operaciones dependen de combustible para maquinaria y generación en terreno.",
    beneficios: [
      "Faenas mineras y proyectos hidroeléctricos de montaña",
      "Empresas de construcción en zonas cordilleranas",
      "Turismo, termas y recintos con generadores propios",
      "Maquinaria pesada para obras en altura",
    ],
  },

  // ───────────────────────── Provincia de Maipo ─────────────────────────
  {
    nombre: "San Bernardo", slug: "san-bernardo", region: RM, provincia: "Provincia de Maipo",
    sector: "sur", perfil: "industrial y de manufactura",
    contexto:
      "San Bernardo es un polo industrial consolidado al sur de Santiago, con una larga tradición manufacturera y presencia de empresas de mediana y gran escala. La zona cuenta con plantas de producción, talleres de maquinaria y empresas de logística que requieren abastecimiento regular de combustible.",
    beneficios: [
      "Plantas industriales con consumo continuo de diesel",
      "Talleres y empresas de mantenimiento de maquinaria pesada",
      "Empresas de reciclaje y gestión de residuos con flota propia",
      "Constructoras con proyectos en el sector sur de Santiago",
    ],
  },
  {
    nombre: "Buin", slug: "buin", region: RM, provincia: "Provincia de Maipo",
    sector: "sur", perfil: "agrícola y vitivinícola",
    contexto:
      "Buin es la puerta del sector vitivinícola y agrícola del sur de la Región Metropolitana. Viñedos, frutales y empresas de procesamiento agroindustrial requieren combustible para maquinaria de cosecha, irrigación y generadores eléctricos de respaldo durante períodos críticos de producción.",
    beneficios: [
      "Viñedos y bodegas de vino con maquinaria de vendimia",
      "Empresas agrícolas con necesidad de combustible en temporada",
      "Plantas de frío y procesamiento de frutas con generadores",
      "Constructoras con proyectos en el corredor sur",
    ],
  },
  {
    nombre: "Calera de Tango", slug: "calera-de-tango", region: RM, provincia: "Provincia de Maipo",
    sector: "sur-poniente", perfil: "rural-industrial y agrícola",
    contexto:
      "Calera de Tango es una comuna de carácter rural e industrial al sur poniente de la RM, con agricultura, aeródromo y empresas de logística en crecimiento. La maquinaria agrícola y las operaciones industriales demandan combustible de forma regular.",
    beneficios: [
      "Empresas agrícolas y agroindustriales con maquinaria",
      "Aeródromo y empresas de servicios aeronáuticos",
      "Bodegas y centros logísticos en expansión",
      "Constructoras y empresas de movimiento de tierra",
    ],
  },
  {
    nombre: "Paine", slug: "paine", region: RM, provincia: "Provincia de Maipo",
    sector: "sur", perfil: "agroindustrial y avícola",
    contexto:
      "Paine es un importante polo agroindustrial del sur de la RM, con producción avícola, frutícola y agroexportadora de gran escala. Las plantas de proceso, packing y cámaras de frío requieren combustible continuo para generación y maquinaria.",
    beneficios: [
      "Plantas avícolas y agroindustriales de gran escala",
      "Packing y cámaras de frío con generadores",
      "Empresas frutícolas y agroexportadoras",
      "Constructoras y faenas del corredor sur",
    ],
  },

  // ───────────────────────── Provincia de Melipilla ─────────────────────────
  {
    nombre: "Melipilla", slug: "melipilla", region: RM, provincia: "Provincia de Melipilla",
    sector: "poniente", perfil: "agroindustrial y ganadero",
    contexto:
      "Melipilla es la capital de su provincia y un polo agroindustrial y ganadero clave de la Región Metropolitana, con producción avícola, porcina y láctea de gran escala. Las plantas de proceso y la maquinaria agrícola demandan un abastecimiento de combustible alto y constante.",
    beneficios: [
      "Plantas agroindustriales avícolas, porcinas y lácteas",
      "Cámaras de frío y líneas de proceso con generadores",
      "Empresas agrícolas con maquinaria de temporada",
      "Transporte de carga y flotas agroexportadoras",
    ],
  },
  {
    nombre: "Alhué", slug: "alhue", region: RM, provincia: "Provincia de Melipilla",
    sector: "sur-poniente", perfil: "rural y minero",
    contexto:
      "Alhué es una comuna rural del sur poniente de la RM donde conviven la actividad agrícola con faenas mineras. La distancia a los centros urbanos hace del despacho a domicilio un servicio esencial para maquinaria y generadores en terreno.",
    beneficios: [
      "Faenas mineras y proveedores del sector",
      "Empresas agrícolas y ganaderas con maquinaria",
      "Generadores de respaldo en zonas sin red estable",
      "Constructoras y empresas de movimiento de tierra",
    ],
  },
  {
    nombre: "Curacaví", slug: "curacavi", region: RM, provincia: "Provincia de Melipilla",
    sector: "poniente", perfil: "agrícola y logístico de paso",
    contexto:
      "Curacaví se ubica sobre la Ruta 68 entre Santiago y Valparaíso, con una fuerte actividad agrícola —avícola y frutícola— y servicios logísticos de paso. La maquinaria de campo y las empresas de transporte demandan combustible de forma sostenida.",
    beneficios: [
      "Empresas agrícolas y avícolas con maquinaria propia",
      "Servicios logísticos y de transporte sobre la Ruta 68",
      "Packing y bodegas con generadores de respaldo",
      "Constructoras y faenas del corredor poniente",
    ],
  },
  {
    nombre: "María Pinto", slug: "maria-pinto", region: RM, provincia: "Provincia de Melipilla",
    sector: "poniente", perfil: "rural, agrícola y vitivinícola",
    contexto:
      "María Pinto es una comuna netamente rural del poniente de la RM, con agricultura, viñas y ganadería como principales actividades. El despacho a domicilio abastece de combustible a la maquinaria agrícola y a los generadores de predios alejados de la red.",
    beneficios: [
      "Viñas y empresas vitivinícolas con maquinaria",
      "Predios agrícolas y ganaderos con equipos a diesel",
      "Generadores de respaldo en zonas rurales",
      "Riego tecnificado y bombas a combustible",
    ],
  },
  {
    nombre: "San Pedro", slug: "san-pedro", region: RM, provincia: "Provincia de Melipilla",
    sector: "sur-poniente", perfil: "rural y agropecuario",
    contexto:
      "San Pedro es la comuna más austral de la RM, de carácter rural y agropecuario, con agricultura, ganadería y actividad forestal. La lejanía respecto a los centros urbanos hace del abastecimiento a domicilio un servicio clave para maquinaria y generación.",
    beneficios: [
      "Predios agrícolas, ganaderos y forestales con maquinaria",
      "Generadores de respaldo en zonas sin red estable",
      "Empresas de transporte y servicios rurales",
      "Faenas y constructoras del sector austral de la RM",
    ],
  },

  // ───────────────────────── Provincia de Talagante ─────────────────────────
  {
    nombre: "Talagante", slug: "talagante", region: RM, provincia: "Provincia de Talagante",
    sector: "sur-poniente", perfil: "agroindustrial e industrial",
    contexto:
      "Talagante, capital de su provincia, combina un polo industrial y agroindustrial consolidado con actividad agrícola en su entorno. Plantas de proceso, manufactura y maquinaria de campo demandan un suministro regular de petróleo diesel.",
    beneficios: [
      "Plantas industriales y agroindustriales de la provincia",
      "Empresas agrícolas con maquinaria de temporada",
      "Bodegas y centros de distribución",
      "Constructoras y faenas de urbanización",
    ],
  },
  {
    nombre: "El Monte", slug: "el-monte", region: RM, provincia: "Provincia de Talagante",
    sector: "sur-poniente", perfil: "agrícola y rural",
    contexto:
      "El Monte es una comuna agrícola y rural del corredor de Talagante, con cultivos, viñas y agroindustria de menor escala. La maquinaria de campo y los generadores de predios requieren abastecimiento a domicilio de combustible.",
    beneficios: [
      "Empresas agrícolas y viñas con maquinaria",
      "Agroindustria y packing con generadores",
      "Generadores de respaldo en predios rurales",
      "Constructoras y faenas locales",
    ],
  },
  {
    nombre: "Isla de Maipo", slug: "isla-de-maipo", region: RM, provincia: "Provincia de Talagante",
    sector: "sur-poniente", perfil: "vitivinícola y agrícola",
    contexto:
      "Isla de Maipo es reconocida por su tradición vitivinícola, con viñas y bodegas de exportación además de agricultura frutícola. La demanda de combustible se intensifica en vendimia, para maquinaria, riego y generación de respaldo.",
    beneficios: [
      "Viñas y bodegas de exportación con maquinaria de vendimia",
      "Empresas frutícolas y de agroproceso",
      "Cámaras de frío y packing con generadores",
      "Riego tecnificado y bombas a combustible",
    ],
  },
  {
    nombre: "Padre Hurtado", slug: "padre-hurtado", region: RM, provincia: "Provincia de Talagante",
    sector: "poniente", perfil: "industrial-agrícola en crecimiento",
    contexto:
      "Padre Hurtado combina actividad agrícola con un creciente desarrollo industrial y logístico en el poniente de la RM. Bodegas, plantas y maquinaria de campo demandan un abastecimiento de combustible cada vez mayor.",
    beneficios: [
      "Parques industriales y centros logísticos en crecimiento",
      "Empresas agrícolas y agroindustriales",
      "Bodegas y flotas de transporte",
      "Constructoras con proyectos inmobiliarios y de urbanización",
    ],
  },
  {
    nombre: "Peñaflor", slug: "penaflor", region: RM, provincia: "Provincia de Talagante",
    sector: "sur-poniente", perfil: "industrial y agroindustrial",
    contexto:
      "Peñaflor es un polo industrial y agroindustrial del corredor de Talagante, con manufactura, industria textil y plantas de proceso. Estas operaciones demandan combustible de forma regular para maquinaria y generación de respaldo.",
    beneficios: [
      "Plantas industriales y manufactura del corredor poniente",
      "Industria textil y agroindustria",
      "Bodegas y centros de distribución",
      "Constructoras y empresas de servicios",
    ],
  },

  // ───────────────────────── Provincia de Chacabuco ─────────────────────────
  {
    nombre: "Colina", slug: "colina", region: RM, provincia: "Provincia de Chacabuco",
    sector: "norte", perfil: "agrícola, industrial y minero",
    contexto:
      "Colina es una comuna de creciente actividad industrial y agrícola al norte de Santiago, con presencia de empresas de extracción, faenas de construcción y un sector rural que demanda combustible para maquinaria agrícola y generadores. La distancia al centro urbano hace del servicio a domicilio una necesidad operacional clave.",
    beneficios: [
      "Empresas agrícolas y viñedos con maquinaria de temporada",
      "Proyectos de construcción en la zona norte de la RM",
      "Empresas de extracción de áridos y material pétreo",
      "Condominios rurales con generadores de respaldo",
    ],
  },
  {
    nombre: "Lampa", slug: "lampa", region: RM, provincia: "Provincia de Chacabuco",
    sector: "norponiente", perfil: "agrícola-industrial",
    contexto:
      "Lampa es una de las zonas de mayor crecimiento industrial y logístico del norponiente de Santiago, con importantes parques industriales y una actividad agrícola sostenida. La distancia respecto al centro de la ciudad hace que el servicio de petróleo a domicilio sea especialmente valorado por las empresas de la zona.",
    beneficios: [
      "Parques industriales con alta concentración de bodegas y manufactura",
      "Empresas agrícolas con maquinaria de temporada alta",
      "Plantas de generación eléctrica de respaldo",
      "Proyectos inmobiliarios y constructoras activas en la zona",
    ],
  },
  {
    nombre: "Tiltil", slug: "tiltil", region: RM, provincia: "Provincia de Chacabuco",
    sector: "norte", perfil: "minero y extractivo",
    contexto:
      "Tiltil es una comuna del extremo norte de la RM con fuerte actividad minera y extractiva —cal, cobre y áridos— además de faenas industriales y agrícolas. Las operaciones en terreno, muchas veces alejadas de la red eléctrica, dependen del suministro de combustible para maquinaria y generación.",
    beneficios: [
      "Faenas mineras y extractivas de cal, cobre y áridos",
      "Plantas industriales y de procesamiento de minerales",
      "Generadores de respaldo en zonas sin red estable",
      "Maquinaria pesada y flotas de transporte de carga",
    ],
  },

  // ───────────────────────── Cobertura extendida (otras regiones) ─────────────────────────
  {
    nombre: "Valparaíso", slug: "valparaiso", region: "Región de Valparaíso", provincia: "Región de Valparaíso",
    sector: "costa", perfil: "portuario, industrial y naviero",
    contexto:
      "Valparaíso es el principal puerto de Chile y un importante polo industrial de la región costera. La actividad portuaria, naviera, pesquera e industrial genera una demanda sostenida de combustible para maquinaria de carga, generadores de instalaciones portuarias y flotas de transporte pesado que conectan el puerto con el interior del país.",
    beneficios: [
      "Empresas portuarias y terminales de carga con maquinaria pesada",
      "Industria naviera y astilleros con alta demanda de combustible",
      "Empresas pesqueras con flotas propias y plantas de proceso",
      "Industria química y manufactura del sector costero",
    ],
  },
  {
    nombre: "Rancagua", slug: "rancagua", region: "Región de O'Higgins", provincia: "Región de O'Higgins",
    sector: "región de O'Higgins", perfil: "minero e industrial",
    contexto:
      "Rancagua es la capital de la Región de O'Higgins y uno de los centros industriales y mineros más importantes de Chile, sede de empresas que abastecen a la gran minería del cobre y al sector agroindustrial de la región. La demanda de combustible es alta y constante para las faenas mineras, la maquinaria agrícola y las plantas de procesamiento.",
    beneficios: [
      "Proveedores de la gran minería del cobre en la región",
      "Empresas agroindustriales con flota de maquinaria propia",
      "Constructoras con faenas activas en la zona central",
      "Plantas de generación y empresas energéticas regionales",
    ],
  },
];

// Orden de provincias para agrupar la página de cobertura.
export const PROVINCIAS_RM = [
  "Provincia de Santiago",
  "Provincia de Cordillera",
  "Provincia de Maipo",
  "Provincia de Melipilla",
  "Provincia de Talagante",
  "Provincia de Chacabuco",
] as const;

// Busca una comuna por su slug (p. ej. "maipu").
export function getComunaBySlug(slug: string): Comuna | undefined {
  return COMUNAS_COBERTURA.find((c) => c.slug === slug);
}

// Lista simple {nombre, slug} ordenada alfabéticamente — para menús, formularios,
// footer completo y sitemap. Retrocompatible con el antiguo config.COMUNAS.
export const COMUNAS = [...COMUNAS_COBERTURA]
  .map(({ nombre, slug }) => ({ nombre, slug }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

// Subconjunto destacado (alta demanda industrial) para el home, el footer y los
// teasers de servicios, donde mostrar las 54 comunas sería demasiado largo.
const DESTACADAS_SLUGS = [
  "maipu", "pudahuel", "quilicura", "renca", "huechuraba", "puente-alto",
  "san-bernardo", "colina", "lampa", "las-condes", "la-florida", "melipilla",
];
export const COMUNAS_DESTACADAS = DESTACADAS_SLUGS.map((slug) => {
  const c = COMUNAS_COBERTURA.find((x) => x.slug === slug)!;
  return { nombre: c.nombre, slug: c.slug };
});
