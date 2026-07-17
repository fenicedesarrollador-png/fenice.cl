import { SITE_CONFIG } from "@/lib/config";

/**
 * Plantillas HTML de correo — compatibles con Gmail/Outlook (tablas + estilos inline).
 * Paleta corporativa: navy #0a1628 · verde #1a6b3c · ámbar #f5a623.
 */

const BASE = SITE_CONFIG.site_url;

function esc(value: string | null | undefined): string {
  if (!value) return "—";
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: string | null | undefined, highlight = false) {
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #eef2f7;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;white-space:nowrap;vertical-align:top;width:190px;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #eef2f7;font-size:14px;color:#0a1628;${highlight ? "font-weight:800;color:#1a6b3c;" : "font-weight:500;"}">${esc(value)}</td>
    </tr>`;
}

function shell({ badge, title, subtitle, content }: { badge: string; title: string; subtitle: string; content: string }) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(10,22,40,0.10);">

        <!-- Header corporativo -->
        <tr>
          <td style="background:#0a1628;padding:28px 32px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="display:inline-block;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Fenice</span>
                  <span style="display:inline-block;font-size:11px;font-weight:800;color:#f5a623;letter-spacing:0.22em;margin-left:6px;">SPA</span>
                  <div style="font-size:11px;color:#94a3b8;margin-top:4px;">Distribución de combustible · Región Metropolitana</div>
                </td>
                <td align="right" style="vertical-align:top;">
                  <span style="display:inline-block;background:rgba(245,166,35,0.14);border:1px solid rgba(245,166,35,0.4);color:#f5a623;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;padding:6px 12px;border-radius:999px;">${badge}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:4px;background:linear-gradient(90deg,#1a6b3c,#f5a623,#1a6b3c);font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Título -->
        <tr>
          <td style="padding:28px 32px 6px;">
            <h1 style="margin:0;font-size:20px;font-weight:800;color:#0a1628;line-height:1.3;">${title}</h1>
            <p style="margin:8px 0 0;font-size:14px;color:#64748b;line-height:1.6;">${subtitle}</p>
          </td>
        </tr>

        ${content}

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #eef2f7;padding:20px 32px;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;">
              FENICE SpA · Calle La Granja 8396, San Ramón, Región Metropolitana<br>
              <a href="mailto:notifica@fenice.cl" style="color:#1a6b3c;text-decoration:none;font-weight:600;">notifica@fenice.cl</a> ·
              <a href="tel:${SITE_CONFIG.telefono}" style="color:#1a6b3c;text-decoration:none;font-weight:600;">${SITE_CONFIG.telefono}</a> ·
              <a href="${BASE}" style="color:#1a6b3c;text-decoration:none;font-weight:600;">fenice.cl</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export type CotizacionEmailData = {
  id: string;
  nombre: string;
  empresa: string;
  rut_empresa: string | null;
  email: string;
  telefono: string;
  comuna: string | null;
  servicio_solicitado: string;
  volumen_estimado: string | null;
  frecuencia: string | null;
  mensaje: string | null;
  // Campos del formulario potenciado (opcionales)
  tipo_combustible?: string | null;
  direccion_entrega?: string | null;
  fecha_estimada?: string | null;
  tipo_instalacion?: string | null;
};

/** Notificación interna: nueva solicitud de cotización (para el equipo Fenice). */
export function cotizacionInternaEmail(data: CotizacionEmailData): string {
  const fecha = new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date());
  const folio = data.id.slice(0, 8).toUpperCase();

  const content = `
    <tr>
      <td style="padding:16px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0faf4;border:1px solid #d6efe0;border-radius:12px;">
          <tr>
            <td style="padding:12px 16px;font-size:13px;color:#166534;line-height:1.6;">
              <strong style="color:#14532d;">📎 PDF adjunto:</strong> esta solicitud incluye el documento de cotización con el detalle completo &middot;
              <span style="font-weight:800;color:#1a6b3c;">Folio N° ${folio}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef2f7;border-radius:12px;overflow:hidden;">
          <tr>
            <td colspan="2" style="background:#f0faf4;padding:10px 16px;font-size:11px;font-weight:800;color:#1a6b3c;text-transform:uppercase;letter-spacing:0.08em;">Servicio solicitado</td>
          </tr>
          ${row("Servicio", data.servicio_solicitado, true)}
          ${data.tipo_combustible ? row("Tipo de combustible", data.tipo_combustible) : ""}
          ${row("Volumen estimado", data.volumen_estimado)}
          ${row("Frecuencia", data.frecuencia)}
          ${row("Comuna / zona", data.comuna)}
          ${data.direccion_entrega ? row("Dirección de entrega", data.direccion_entrega) : ""}
          ${data.fecha_estimada ? row("Fecha estimada de entrega", data.fecha_estimada) : ""}
          ${data.tipo_instalacion ? row("Instalación / equipo", data.tipo_instalacion) : ""}
          <tr>
            <td colspan="2" style="background:#f0faf4;padding:10px 16px;font-size:11px;font-weight:800;color:#1a6b3c;text-transform:uppercase;letter-spacing:0.08em;">Datos del solicitante</td>
          </tr>
          ${row("Nombre", data.nombre)}
          ${row("Empresa", data.empresa)}
          ${row("RUT empresa", data.rut_empresa)}
          ${row("Correo", data.email)}
          ${row("Teléfono", data.telefono)}
          ${data.mensaje ? row("Mensaje", data.mensaje) : ""}
          ${row("Recibida", fecha)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 30px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding-right:6px;width:50%;">
              <a href="${BASE}/admin/cotizaciones" style="display:block;background:#1a6b3c;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;padding:13px 10px;border-radius:10px;text-align:center;">Ver en el panel</a>
            </td>
            <td align="center" style="padding-left:6px;width:50%;">
              <a href="mailto:${esc(data.email)}" style="display:block;background:#f5a623;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;padding:13px 10px;border-radius:10px;text-align:center;">Responder al cliente</a>
            </td>
          </tr>
        </table>
        <p style="margin:14px 0 0;font-size:12px;color:#94a3b8;text-align:center;">También puedes responder directamente a este correo — llegará a ${esc(data.email)}.</p>
      </td>
    </tr>`;

  return shell({
    badge: "Nueva cotización",
    title: `${data.empresa} solicita cotización`,
    subtitle: `${data.nombre} envió una solicitud de cotización desde fenice.cl. La solicitud quedó registrada en el panel administrativo.`,
    content,
  });
}

/** Confirmación automática al cliente que cotizó. */
export function cotizacionClienteEmail(data: CotizacionEmailData): string {
  const content = `
    <tr>
      <td style="padding:20px 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef2f7;border-radius:12px;overflow:hidden;">
          <tr>
            <td colspan="2" style="background:#f0faf4;padding:10px 16px;font-size:11px;font-weight:800;color:#1a6b3c;text-transform:uppercase;letter-spacing:0.08em;">Resumen de tu solicitud</td>
          </tr>
          ${row("Servicio", data.servicio_solicitado, true)}
          ${data.tipo_combustible ? row("Tipo de combustible", data.tipo_combustible) : ""}
          ${row("Volumen estimado", data.volumen_estimado)}
          ${row("Frecuencia", data.frecuencia)}
          ${row("Comuna / zona", data.comuna)}
          ${data.direccion_entrega ? row("Dirección de entrega", data.direccion_entrega) : ""}
          ${data.fecha_estimada ? row("Fecha estimada de entrega", data.fecha_estimada) : ""}
          ${data.tipo_instalacion ? row("Instalación / equipo", data.tipo_instalacion) : ""}
          ${row("Empresa", data.empresa)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 30px;">
        <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.7;">
          Un ejecutivo de Fenice SPA revisará tu requerimiento y te contactará a la brevedad
          en horario <strong style="color:#0a1628;">Lun–Vie 09:00 a 19:00</strong>.
          Si tu necesidad es urgente, escríbenos directamente por WhatsApp.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              <a href="https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, acabo de enviar una cotización desde fenice.cl y quiero agilizar mi solicitud.")}" style="display:inline-block;background:#1a6b3c;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;padding:13px 28px;border-radius:10px;">Hablar por WhatsApp</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  return shell({
    badge: "Solicitud recibida",
    title: `¡Gracias, ${data.nombre.split(" ")[0]}! Recibimos tu cotización`,
    subtitle:
      "Tu solicitud de cotización de combustible fue recibida correctamente por nuestro equipo comercial.",
    content,
  });
}

export type PrecioPorVencer = {
  name: string;
  price: number | null;
  unit: string;
  vence_at: string;
};

/** Alerta interna: precios de combustible por vencer (se envía a las 10:00 del día anterior). */
export function preciosAlertaEmail(precios: PrecioPorVencer[]): string {
  const fmtFecha = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  });

  const filas = precios
    .map((p) => {
      const precio = p.price !== null ? `$${p.price.toLocaleString("es-CL")} ${esc(p.unit.replace("$", ""))}` : "Sin precio";
      return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eef2f7;font-size:14px;font-weight:800;color:#0a1628;">${esc(p.name)}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eef2f7;font-size:14px;color:#1a6b3c;font-weight:700;white-space:nowrap;">${precio}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eef2f7;font-size:13px;color:#b45309;font-weight:700;">${esc(fmtFecha.format(new Date(p.vence_at)))}</td>
      </tr>`;
    })
    .join("");

  const content = `
    <tr>
      <td style="padding:20px 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fde68a;background:#fffbeb;border-radius:12px;">
          <tr>
            <td style="padding:14px 16px;font-size:13px;color:#92400e;line-height:1.6;">
              <strong>⚠ Importante:</strong> si los precios no se actualizan antes de su fecha de
              caducidad, se <strong>ocultarán automáticamente</strong> de la web pública y los
              clientes verán "consultar disponibilidad".
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef2f7;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#f0faf4;padding:10px 16px;font-size:11px;font-weight:800;color:#1a6b3c;text-transform:uppercase;letter-spacing:0.08em;">Combustible</td>
            <td style="background:#f0faf4;padding:10px 16px;font-size:11px;font-weight:800;color:#1a6b3c;text-transform:uppercase;letter-spacing:0.08em;">Precio actual</td>
            <td style="background:#f0faf4;padding:10px 16px;font-size:11px;font-weight:800;color:#1a6b3c;text-transform:uppercase;letter-spacing:0.08em;">Vence</td>
          </tr>
          ${filas}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:22px 32px 30px;" align="center">
        <a href="${BASE}/admin/precios-combustible" style="display:inline-block;background:#1a6b3c;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:10px;">Actualizar precios ahora</a>
        <p style="margin:14px 0 0;font-size:12px;color:#94a3b8;line-height:1.6;">
          Puedes actualizar el precio, extender la fecha de caducidad o dejar
          programado el nuevo precio para que se publique automáticamente.
        </p>
      </td>
    </tr>`;

  return shell({
    badge: "Alerta de precios",
    title: `${precios.length === 1 ? "Un precio de combustible vence pronto" : `${precios.length} precios de combustible vencen pronto`}`,
    subtitle:
      "Verifica los cambios de precios de combustible y actualiza los valores publicados en fenice.cl antes de que caduquen.",
    content,
  });
}

export type ContactoEmailData = {
  nombre: string;
  telefono: string | null;
  email: string | null;
  comuna: string;
  tipo_operacion: string;
  volumen: string | null;
  mensaje: string | null;
};

/** Notificación interna: nuevo mensaje de contacto (lead). */
export function contactoInternoEmail(data: ContactoEmailData): string {
  const fecha = new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date());

  const content = `
    <tr>
      <td style="padding:20px 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef2f7;border-radius:12px;overflow:hidden;">
          ${row("Nombre", data.nombre)}
          ${row("Tipo de operación", data.tipo_operacion, true)}
          ${row("Comuna", data.comuna)}
          ${row("Volumen", data.volumen)}
          ${row("Teléfono", data.telefono)}
          ${row("Correo", data.email)}
          ${data.mensaje ? row("Mensaje", data.mensaje) : ""}
          ${row("Recibido", fecha)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 30px;" align="center">
        <a href="${BASE}/admin/leads" style="display:inline-block;background:#1a6b3c;color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;padding:13px 28px;border-radius:10px;">Ver solicitudes en el panel</a>
      </td>
    </tr>`;

  return shell({
    badge: "Nuevo contacto",
    title: `${data.nombre} envió un mensaje de contacto`,
    subtitle: "Se registró una nueva solicitud de contacto desde fenice.cl.",
    content,
  });
}
