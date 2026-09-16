"use client";

import { useEffect, useState } from "react";

export function LiveUpdatedLabel() {
  const [label, setLabel] = useState("Actualizado hoy");

  useEffect(() => {
    function update() {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const suffix = now.getHours() < 12 ? "a.m." : "p.m.";
      setLabel(`Actualizado hoy, ${hours}:${minutes} ${suffix}`);
    }
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return <>{label}</>;
}
