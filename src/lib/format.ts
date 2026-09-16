const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-08-27" -> "27 de agosto, 2026" */
export function formatAsOfDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} de ${MESES[month - 1]}, ${year}`;
}

/** "2026-08-27" -> "Agosto" */
export function getMonthLabel(isoDate: string): string {
  const month = Number(isoDate.split("-")[1]);
  const name = MESES[month - 1];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** "2026-08-27" -> "julio" */
export function getPreviousMonthLabel(isoDate: string): string {
  const month = Number(isoDate.split("-")[1]);
  const prevIndex = (month - 2 + 12) % 12;
  return MESES[prevIndex];
}
