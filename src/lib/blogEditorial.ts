import plan from "../../content/blog-plan-comercial.json";
import { businessDateTimeToIso, toBusinessDateTimeInput } from "./dates";

export const EDITORIAL_PLAN = plan;

export function buildEditorialPosts(now = new Date()) {
  const localDay = toBusinessDateTimeInput(now).slice(0, 10);
  return plan.map(({ days_after_start, ...post }) => {
    const day = new Date(`${localDay}T12:00:00Z`);
    day.setUTCDate(day.getUTCDate() + days_after_start);
    return {
      ...post, publicado: true,
      fecha_publicacion: days_after_start === 0 ? now.toISOString()
        : businessDateTimeToIso(`${day.toISOString().slice(0, 10)}T09:00`),
    };
  });
}
