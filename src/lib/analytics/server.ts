const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface AnalyticsIdentityHeaders {
  visitorId: string | null;
  sessionId: string | null;
}

function isUuid(value: string | null) {
  return !!value && UUID_PATTERN.test(value);
}

export function readAnalyticsIdentityHeaders(request: Request): AnalyticsIdentityHeaders {
  const visitorId = request.headers.get("x-fenice-visitor-id");
  const sessionId = request.headers.get("x-fenice-session-id");

  return {
    visitorId: isUuid(visitorId) ? visitorId : null,
    sessionId: isUuid(sessionId) ? sessionId : null,
  };
}

export async function linkAnalyticsIdentity(
  serviceClient: {
    from: (table: string) => {
      insert: (
        values: Record<string, unknown>,
      ) => PromiseLike<{ error: { message?: string } | null }>;
    };
  },
  request: Request,
  relations: {
    leadId?: string | null;
    cotizacionId?: string | null;
    clientId?: string | null;
  },
) {
  const { visitorId, sessionId } = readAnalyticsIdentityHeaders(request);
  if (!visitorId) {
    return;
  }

  await serviceClient.from("analytics_identity_links").insert({
    visitor_id: visitorId,
    session_id: sessionId,
    lead_id: relations.leadId ?? null,
    cotizacion_id: relations.cotizacionId ?? null,
    client_id: relations.clientId ?? null,
  });
}
