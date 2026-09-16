"use client";

import { useEffect, useState } from "react";

export function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    }
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-white">
      <span className="text-[15px] font-semibold tabular-nums">{time || " "}</span>
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
