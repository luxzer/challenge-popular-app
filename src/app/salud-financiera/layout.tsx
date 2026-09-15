import { BottomNav } from "@/components/BottomNav";

export default function SaludFinancieraLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-[#d7dee6] sm:py-8">
      <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-page sm:h-[860px] sm:rounded-[40px] sm:border sm:border-black/10 sm:shadow-2xl">
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
