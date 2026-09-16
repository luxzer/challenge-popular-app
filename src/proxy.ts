import { NextRequest, NextResponse } from "next/server";
import { PROFILE_COOKIE, PROFILE_COUNT } from "@/lib/profile";

/**
 * Rerolls the demo profile every time someone (re)loads the dashboard,
 * so judges can see a different financial-health case just by refreshing
 * "/salud-financiera". Every other route in the module just reads whatever
 * was last set here, so navigating between tabs stays consistent.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname === "/salud-financiera") {
    const profileId = String(Math.floor(Math.random() * PROFILE_COUNT) + 1);
    response.cookies.set(PROFILE_COOKIE, profileId, { path: "/", sameSite: "lax" });
  }

  return response;
}

export const config = {
  matcher: ["/salud-financiera"],
};
