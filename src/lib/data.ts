import { ExpenseCategory, RecommendedCard, SuggestedAction, Transaction } from "./types";

export const CATEGORIES: ExpenseCategory[] = [
  {
    id: "delivery",
    name: "Delivery y restaurantes",
    colorVar: "var(--brand-navy-deep)",
    insight: "41% más que en julio",
    insightTone: "danger",
  },
  {
    id: "supermercado",
    name: "Supermercado",
    colorVar: "var(--brand-blue)",
    insight: "6% menos que en julio",
    insightTone: "success",
  },
  {
    id: "transporte",
    name: "Transporte",
    colorVar: "var(--brand-blue-light)",
    insight: "Igual que en julio",
    insightTone: "neutral",
  },
  {
    id: "servicios",
    name: "Servicios y suscripciones",
    colorVar: "var(--brand-orange)",
    insight: "2 suscripciones sin uso reciente",
    insightTone: "warning",
  },
  {
    id: "otros",
    name: "Otros",
    colorVar: "var(--divider)",
  },
];

export const TRANSACTIONS: Transaction[] = [
  { id: "t1", merchant: "PEDIDOSYA", date: "2026-08-26", amount: 588.38, categoryId: "delivery" },
  { id: "t2", merchant: "UBER EATS-W*UBER EATS", date: "2026-08-24", amount: 354.25, categoryId: "delivery" },
  { id: "t3", merchant: "UBER EATS-W*UBER EATS", date: "2026-08-24", amount: 317.5, categoryId: "delivery" },
  { id: "t4", merchant: "PEDIDOSYA", date: "2026-08-19", amount: 421.9, categoryId: "delivery" },
  { id: "t5", merchant: "UBER EATS-W*UBER EATS", date: "2026-08-15", amount: 298.6, categoryId: "delivery" },
  { id: "t6", merchant: "PEDIDOSYA", date: "2026-08-11", amount: 512.75, categoryId: "delivery" },
  { id: "t7", merchant: "SUPERMERCADO NACIONAL", date: "2026-08-23", amount: 2140.0, categoryId: "supermercado" },
  { id: "t8", merchant: "LA SIRENA", date: "2026-08-09", amount: 1680.5, categoryId: "supermercado" },
  { id: "t9", merchant: "JUMBO", date: "2026-08-02", amount: 1499.3, categoryId: "supermercado" },
  { id: "t10", merchant: "UBER", date: "2026-08-27", amount: 340.0, categoryId: "transporte" },
  { id: "t11", merchant: "GASOLINA SHELL", date: "2026-08-20", amount: 2200.0, categoryId: "transporte" },
  { id: "t12", merchant: "METRO SANTO DOMINGO", date: "2026-08-05", amount: 1330.0, categoryId: "transporte" },
  { id: "t13", merchant: "NETFLIX.COM", date: "2026-08-14", amount: 590.0, categoryId: "servicios" },
  { id: "t14", merchant: "SPOTIFY", date: "2026-08-13", amount: 259.0, categoryId: "servicios" },
  { id: "t15", merchant: "CLARO DOMINICANA", date: "2026-08-10", amount: 1850.0, categoryId: "servicios" },
  { id: "t16", merchant: "GYM FITNESS CLUB", date: "2026-08-06", amount: 686.0, categoryId: "servicios" },
];

export const CARDS: RecommendedCard[] = [
  {
    id: "gnial",
    name: "Mastercard gnial",
    network: "Mastercard",
    productType: "crédito",
    matchNote: "Cubre tu 38% en delivery y comida rápida",
    cashback: [
      { label: "5% en Comida rápida", limit: "RD$1,000 / mes" },
      { label: "5% en Streaming y cines", limit: "RD$1,000 / mes" },
      { label: "5% en Juegos digitales", limit: "RD$1,000 / mes" },
      { label: "Amazon, Apple y Deportes", limit: "Sin límite" },
      { label: "bonus gnial", limit: "Sin límite" },
    ],
    perksNote: "Incluye asistencia de viajes, protección de compras y garantía extendida.",
    estimatedAnnualSavings: 5400,
  },
  {
    id: "rewards-popular",
    name: "Visa Rewards Popular",
    network: "Visa",
    productType: "crédito",
    matchNote: "Cubre tu 22% en supermercado y transporte",
    cashback: [
      { label: "5% en Supermercado", limit: "RD$2,000 / mes" },
      { label: "5% en Combustible", limit: "RD$2,000 / mes" },
      { label: "2% en Compras en línea", limit: "RD$2,000 / mes" },
      { label: "1% en Resto de categorías", limit: "RD$10,000 / año" },
    ],
    perksNote: "Cashback tope mensual por categoría; el resto acumula hasta el tope anual.",
    estimatedAnnualSavings: 3600,
  },
];

export const ACTIONS: SuggestedAction[] = [
  {
    id: "auto-ahorro",
    title: "Automatiza RD$1,500 al mes a tu cuenta de ahorro",
    detail:
      "El día 30 te queda saldo sin usar en la cuenta 830842753. Programarlo antes de gastarlo es lo que más mueve tu score hoy.",
    scoreImpactPts: 15,
    moneyImpactLabel: "RD$18,000 al año",
    primaryCta: "Activar transferencia",
    secondaryCta: "No me aplica",
    direction: "up",
    category: "ahorro",
  },
  {
    id: "abono-tarjeta",
    title: "Abona RD$4,200 antes del 09 sept",
    detail:
      "Tu tarjeta ****1122 cierra el 09 de septiembre. Abonar antes del corte reduce tu uso de crédito reportado y te ahorra intereses.",
    scoreImpactPts: 9,
    moneyImpactLabel: "RD$480 ahorrados",
    primaryCta: "Programar abono",
    secondaryCta: "No me aplica",
    direction: "down",
    category: "deuda",
  },
];

export const USER_FIRST_NAME = "Luis";
export const AS_OF_DATE_DISPLAY = "27 de agosto, 2026";
export const AS_OF_MONTH_LABEL = "Agosto";
export const PREVIOUS_MONTH_LABEL = "julio";
