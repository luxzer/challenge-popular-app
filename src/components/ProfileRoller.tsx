"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { rerollDemoProfile } from "@/lib/actions";

/** Invisible: rerolls the demo profile once per mount of the dashboard page
 * (i.e. every time it's opened or refreshed), then refreshes the Server
 * Components so the rest of the page reflects the new profile. */
export function ProfileRoller() {
  const router = useRouter();
  const rolled = useRef(false);

  useEffect(() => {
    if (rolled.current) return;
    rolled.current = true;
    rerollDemoProfile().then(() => router.refresh());
  }, [router]);

  return null;
}
