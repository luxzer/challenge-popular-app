"use server";

import { cookies } from "next/headers";
import { PROFILE_COOKIE, PROFILE_COUNT } from "./profile";

/**
 * Rerolls the demo profile cookie. Called once on mount from the dashboard
 * (see ProfileRoller) so every visit/refresh of "/salud-financiera" shows a
 * different financial-health case. Runs as a Server Action (not
 * Proxy/Middleware) so Netlify bundles it as a normal function — Next.js 16
 * Proxy files were getting bundled as Edge Functions, which fails to build
 * from Windows (see docs/DEPLOYMENT.md).
 */
export async function rerollDemoProfile() {
  const store = await cookies();
  const profileId = String(Math.floor(Math.random() * PROFILE_COUNT) + 1);
  store.set(PROFILE_COOKIE, profileId, { path: "/", sameSite: "lax" });
}
