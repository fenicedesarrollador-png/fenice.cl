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
