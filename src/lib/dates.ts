export const BUSINESS_TIME_ZONE = "America/Santiago";

function dateParts(value: string | Date) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("Fecha no válida.");
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function formatBusinessDate(value: string | Date) {
  const p = dateParts(value);
  return `${p.day}-${p.month}-${p.year}`;
}

export function formatBusinessDateTime(value: string | Date) {
  const p = dateParts(value);
  return `${p.day}-${p.month}-${p.year} ${p.hour}:${p.minute}`;
}

export function toBusinessDateTimeInput(value?: string | Date | null) {
  if (!value) return "";
  const p = dateParts(value);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** Convierte la hora de Santiago sin depender de la zona horaria del navegador. */
export function businessDateTimeToIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("Indica fecha y hora de publicación.");
  const target = Date.parse(`${value}:00Z`);
  if (!Number.isFinite(target) || new Date(target).toISOString().slice(0, 16) !== value) throw new Error("Fecha no válida.");
  let candidate = target;
  for (let i = 0; i < 4; i++) {
    const local = toBusinessDateTimeInput(new Date(candidate));
    const difference = target - Date.parse(`${local}:00Z`);
    if (difference === 0) return new Date(candidate).toISOString();
    candidate += difference;
  }
  throw new Error("Esta hora no existe en Santiago por el cambio de horario. Elige otra hora.");
}
