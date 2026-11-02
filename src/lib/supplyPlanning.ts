export const QUOTE_SERVICES = {
  diesel: { quick: "Petróleo diésel a domicilio", quote: "Petróleo diésel a domicilio (empresa)", fuel: "Petróleo diésel" },
  parafina: { quick: "Parafina (kerosene) a domicilio", quote: "Parafina (kerosene) a domicilio", fuel: "Parafina (kerosene)" },
  generador: { quick: "Combustible para generador", quote: "Combustible para generador eléctrico", fuel: "Petróleo diésel" },
  maquinaria: { quick: "Combustible para maquinaria o flota", quote: "Combustible para maquinaria pesada / faena", fuel: "Petróleo diésel" },
  caldera: { quick: "Combustible para caldera", quote: "Combustible para caldera", fuel: "" },
  flota: { quick: "Combustible para maquinaria o flota", quote: "Abastecimiento para flota", fuel: "Petróleo diésel" },
  estanque: { quick: "Instalación de estanque", quote: "Instalación o mantención de estanque", fuel: "" },
  contrato: { quick: "Suministro periódico de combustible", quote: "Contrato de suministro periódico", fuel: "" },
} as const;

export type QuoteService = keyof typeof QUOTE_SERVICES;
export const QUICK_SERVICES = [...new Set(Object.values(QUOTE_SERVICES).map((s) => s.quick))];
export const QUOTE_SERVICE_OPTIONS = [...Object.values(QUOTE_SERVICES).map((s) => s.quote), "Otro"];

export type GeneratorInput = {
  consumption: number;
  hours: number;
  available: number;
  reserve: number;
};

export function calculateGeneratorSupply(input: GeneratorInput) {
  const { consumption, hours, available, reserve } = input;
  if (![consumption, hours, available, reserve].every(Number.isFinite)
    || consumption <= 0 || consumption > 10000 || hours <= 0 || hours > 8760
    || available < 0 || available > 1000000 || reserve < 0 || reserve > 1000000) {
    throw new Error("Revisa el consumo, las horas y los litros ingresados.");
  }
  const consumptionLitres = consumption * hours;
  return {
    consumptionLitres,
    autonomyHours: Math.max(0, available - reserve) / consumption,
    refillLitres: Math.max(0, consumptionLitres + reserve - available),
  };
}

export function generatorQuoteHref(input: GeneratorInput) {
  calculateGeneratorSupply(input);
  const query = new URLSearchParams({ servicio: "generador" });
  for (const [key, value] of Object.entries(input)) query.set(key, String(value));
  return `/cotizacion?${query}`;
}

export type QuoteDefaults = {
  service: string;
  fuel: string;
  message: string;
  installation: string;
};

type Query = Record<string, string | string[] | undefined>;
export function quoteDefaults(query: Query): QuoteDefaults {
  const key = typeof query.servicio === "string" && Object.hasOwn(QUOTE_SERVICES, query.servicio)
    ? query.servicio as QuoteService : null;
  const service = key ? QUOTE_SERVICES[key] : null;
  const defaults = { service: service?.quote ?? "", fuel: service?.fuel ?? "", message: "", installation: key === "generador" ? "Generador eléctrico" : "" };
  if (key !== "generador") return defaults;
  const keys = ["consumption", "hours", "available", "reserve"] as const;
  if (!keys.every((field) => typeof query[field] === "string" && /^\d{1,7}(?:\.\d{1,3})?$/.test(query[field] as string))) return defaults;
  const input = Object.fromEntries(keys.map((field) => [field, Number(query[field])])) as GeneratorInput;
  try {
    const result = calculateGeneratorSupply(input);
    const format = (n: number) => n.toLocaleString("es-CL", { maximumFractionDigits: 2 });
    defaults.message = `Planificación con la calculadora FENICE: consumo ${format(input.consumption)} L/h, operación ${format(input.hours)} h, combustible disponible ${format(input.available)} L y reserva definida ${format(input.reserve)} L. Consumo estimado: ${format(result.consumptionLitres)} L. Reposición calculada: ${format(result.refillLitres)} L. Solicito confirmar volumen de compra, capacidad útil del estanque y disponibilidad de despacho.`;
  } catch {
    // Los parámetros no válidos no modifican los campos del formulario.
  }
  return defaults;
}
