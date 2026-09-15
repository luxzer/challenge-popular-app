import Link from "next/link";
import { StatusBar } from "./StatusBar";

export function AppHeader({
  title,
  subtitle,
  backHref = "/salud-financiera",
  children,
}: {
  title: string;
  subtitle?: string;
  backHref?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="sticky top-0 z-20 rounded-b-[28px] px-6 pb-6"
      style={{
        background: "linear-gradient(160deg, var(--brand-navy-deep) 0%, var(--brand-blue) 100%)",
      }}
    >
      <StatusBar />
      <div className="relative mt-2 flex items-center justify-center">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Volver"
            className="absolute left-0 flex h-9 w-9 items-center justify-center text-2xl text-brand-orange"
          >
            ‹
          </Link>
        ) : null}
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle ? <p className="mt-0.5 text-sm text-white/80">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </div>
  );
}
