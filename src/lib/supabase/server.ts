import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key. Never import this
 * from a Client Component — it bypasses RLS entirely. This app is a
 * single-tenant demo (one seeded user), so Server Components and route
 * handlers query through here and pass plain data down as props.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
