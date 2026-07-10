function normalizeSupabaseUrl(rawUrl: string | undefined) {
  const value = (rawUrl ?? "").trim();
  if (!value) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  const parsed = new URL(value);
  return parsed.origin;
}

function requireEnv(name: string, value: string | undefined) {
  const normalized = (value ?? "").trim();
  if (!normalized) {
    throw new Error(`Missing ${name}`);
  }
  return normalized;
}

function isPlaceholderSupabaseUrl(value: string) {
  return /your_project|example/i.test(value);
}

function isPlaceholderSupabaseKey(value: string) {
  return /your_anon_key|your_service_role_key|example/i.test(value);
}

function isLocalSupabaseHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isHostedSupabaseHostname(hostname: string) {
  return hostname.endsWith(".supabase.co") || hostname.endsWith(".supabase.in");
}

export function getSupabasePublicConfigError() {
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const rawAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (!rawUrl) {
    return "Falta NEXT_PUBLIC_SUPABASE_URL.";
  }

  if (!rawAnonKey) {
    return "Falta NEXT_PUBLIC_SUPABASE_ANON_KEY.";
  }

  if (isPlaceholderSupabaseUrl(rawUrl) || isPlaceholderSupabaseKey(rawAnonKey)) {
    return "La app no está conectada a un proyecto Supabase real. Revisa las variables de entorno.";
  }

  try {
    const parsed = new URL(rawUrl);
    const isLocal = isLocalSupabaseHostname(parsed.hostname);
    const isHosted = isHostedSupabaseHostname(parsed.hostname);

    if (!isLocal && !isHosted) {
      return "NEXT_PUBLIC_SUPABASE_URL debe apuntar al dominio base de Supabase o a un entorno local.";
    }

    if (isHosted && parsed.protocol !== "https:") {
      return "NEXT_PUBLIC_SUPABASE_URL debe usar https en Supabase hosted.";
    }

    if (isLocal && parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "NEXT_PUBLIC_SUPABASE_URL local debe usar http o https.";
    }
  } catch {
    return "NEXT_PUBLIC_SUPABASE_URL no es una URL valida.";
  }

  return "";
}

export function hasUsableSupabasePublicConfig() {
  return !getSupabasePublicConfigError();
}

export function getSupabasePublicConfig() {
  return {
    url: normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: requireEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };
}

export function getSupabaseServiceConfig() {
  return {
    url: normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRoleKey: requireEnv(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
  };
}
