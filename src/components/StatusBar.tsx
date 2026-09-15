export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-white">
      <span className="text-[15px] font-semibold tabular-nums">10:36</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[3px]" aria-hidden>
          <span className="h-[6px] w-[3px] rounded-sm bg-white" />
          <span className="h-[9px] w-[3px] rounded-sm bg-white" />
          <span className="h-[12px] w-[3px] rounded-sm bg-white" />
        </div>
        <span className="text-[13px] font-semibold">96</span>
      </div>
    </div>
  );
}
