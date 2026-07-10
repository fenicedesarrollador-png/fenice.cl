import {
  getSupabasePublicConfig,
  getSupabasePublicConfigError,
} from "@/lib/supabase/config";

function emptyResponse() {
  return new Response(null, { status: 204 });
}

export async function POST(request: Request) {
  const configError = getSupabasePublicConfigError();
  if (configError) {
    return emptyResponse();
  }

  let body = "";

  try {
    body = await request.text();
  } catch {
    return emptyResponse();
  }

  if (!body) {
    return emptyResponse();
  }

  try {
    const { url, anonKey } = getSupabasePublicConfig();

    await fetch(`${url}/functions/v1/track-analytics-event`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
      },
      body,
      cache: "no-store",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[analytics] No se pudo reenviar evento", error);
    }
  }

  return emptyResponse();
}
