import { cookies } from "next/headers";

/**
 * 4 demo profiles (financial-health scenarios) share the same seeded user
 * ("John Doe"), selected per browser session via a cookie set by
 * middleware.ts whenever the dashboard route is visited. Any other page
 * just reads whatever profile is already pinned, so navigating between
 * tabs stays consistent — only revisiting/reloading the dashboard rerolls.
 */
export const PROFILE_COOKIE = "demo_profile_id";
export const PROFILE_COUNT = 4;
export const DEFAULT_PROFILE_ID = 2;

export async function getActiveProfileId(): Promise<number> {
  const store = await cookies();
  const raw = store.get(PROFILE_COOKIE)?.value;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= PROFILE_COUNT) return parsed;
  return DEFAULT_PROFILE_ID;
}
