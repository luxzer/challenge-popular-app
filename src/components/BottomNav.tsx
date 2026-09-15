"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/salud-financiera", label: "Resumen", icon: ResumenIcon },
  { href: "/salud-financiera/score", label: "Score", icon: ScoreIcon },
  { href: "/salud-financiera/recomendaciones", label: "Recomendaciones", icon: RecomendacionesIcon },
  { href: "/salud-financiera/aliado", label: "Aliado", icon: AliadoIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 flex justify-around border-t border-divider bg-surface pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-1 flex-col items-center gap-1 py-1 text-[11px]"
          >
            <span
              className={`h-[3px] w-8 rounded-full ${active ? "bg-brand-orange" : "bg-transparent"}`}
              aria-hidden
            />
            <Icon active={active} />
            <span className={active ? "font-semibold text-ink" : "text-muted-soft"}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function iconColor(active: boolean) {
  return active ? "var(--brand-navy-deep)" : "var(--muted-soft)";
}

function ResumenIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={iconColor(active)} strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

function ScoreIcon({ active }: { active: boolean }) {
  const color = iconColor(active);
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill={color} />
    </svg>
  );
}

function RecomendacionesIcon({ active }: { active: boolean }) {
  const color = iconColor(active);
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill={color} stroke="none" />
    </svg>
  );
}

function AliadoIcon({ active }: { active: boolean }) {
  const color = iconColor(active);
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M12 12V3a9 9 0 0 1 9 9Z" fill={color} />
    </svg>
  );
}
