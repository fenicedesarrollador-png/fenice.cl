export type Publication = { publicado: boolean; fecha_publicacion?: string | null };

export function publicationStatus(post: Publication, now = Date.now()) {
  if (!post.publicado) return "draft";
  if (!post.fecha_publicacion) return "published";
  const timestamp = Date.parse(post.fecha_publicacion);
  if (!Number.isFinite(timestamp)) return "draft";
  return timestamp > now ? "scheduled" : "published";
}

export function publicationFilter(now = new Date()) {
  return `fecha_publicacion.is.null,fecha_publicacion.lte.${now.toISOString()}`;
}
