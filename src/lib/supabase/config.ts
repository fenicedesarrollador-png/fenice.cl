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

export function hasUsableSupabasePublicConfig() {
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const rawAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (!rawUrl || !rawAnonKey) {
    return false;
  }

  if (isPlaceholderSupabaseUrl(rawUrl) || isPlaceholderSupabaseKey(rawAnonKey)) {
    return false;
  }

  try {
    const parsed = new URL(rawUrl);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname.endsWith(".supabase.co") ||
        parsed.hostname.endsWith(".supabase.in"))
    );
  } catch {
    return false;
  }
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
