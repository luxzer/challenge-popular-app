export type CashbackItem = {
  label: string;
  limit: string;
  estimatedAnnualSavings: string;
};

export type PopularCard = {
  id: string;
  name: string;
  issuer: string;
  network: "Visa" | "Mastercard";
  badge: "top" | "estandar";
  badgeLabel: string;
  estimatedAnnualSavings: number;
  annualCost: string;
  minIncome: string;
  redemption: string;
  cashback: CashbackItem[];
  perks?: string[];
  imagePath: string | null;
  /** Ids from lib/data.ts CATEGORIES this card's cashback meaningfully covers,
   * used to compute a live "Cubre tu X% en..." match note from real spend. */
  matchCategoryIds?: string[];
};

/**
 * Source of truth: /cards/cards.md — comparativa real de tarjetas Popular
 * (datos de EfiCredit, actualizados 04 jun 2025). No inventar cifras aquí;
 * si un dato no está en la fuente, se deja como "A calcular" / "No identificado"
 * tal cual aparece en el documento.
 */
export const POPULAR_CARDS: PopularCard[] = [
  {
    id: "visa-isi",
    name: "Visa ISI",
    issuer: "Popular",
    network: "Visa",
    badge: "top",
    badgeLabel: "Top Recomendada — Mejor cashback en EfiCredit",
    estimatedAnnualSavings: 1050.0,
    annualCost: "DOP$1,350.00",
    minIncome: "DOP$8,000.00",
    redemption: "No aplica",
    imagePath: "/cards/isi.png",
    matchCategoryIds: ["supermercado", "transporte"],
    cashback: [
      { label: "Resto de categorías", limit: "DOP$10,000.00 (anual)", estimatedAnnualSavings: "DOP$2,400.00" },
      { label: "Supermercado (5%)", limit: "DOP$2,000.00 (mensual)", estimatedAnnualSavings: "A calcular" },
      { label: "Combustible (5%)", limit: "DOP$2,000.00 (mensual)", estimatedAnnualSavings: "A calcular" },
      { label: "Compras en línea (2%)", limit: "DOP$2,000.00 (mensual)", estimatedAnnualSavings: "A calcular" },
    ],
  },
  {
    id: "mastercard-gnial",
    name: "Mastercard gnial",
    issuer: "Popular",
    network: "Mastercard",
    badge: "top",
    badgeLabel: "Top Recomendada — Mejor cashback en EfiCredit",
    estimatedAnnualSavings: 766.42,
    annualCost: "DOP$450.00",
    minIncome: "DOP$20,000.00",
    redemption: "No aplica",
    imagePath: "/cards/gnial.png",
    matchCategoryIds: ["delivery"],
    perks: ["Servicio de asistencia de viajes", "Protección de compras", "Garantía extendida"],
    cashback: [
      { label: "Resto de categorías", limit: "Sin límite", estimatedAnnualSavings: "DOP$1,216.42" },
      {
        label: "Comida rápida / Juegos digitales / Streaming / Cines / Veterinaria / Airbnb (5% cada una)",
        limit: "DOP$1,000.00 (mensual)",
        estimatedAnnualSavings: "A calcular",
      },
      { label: "Universidades", limit: "Sin límite", estimatedAnnualSavings: "A calcular" },
      { label: "Librerías", limit: "Sin límite", estimatedAnnualSavings: "A calcular" },
      { label: "Amazon", limit: "Sin límite", estimatedAnnualSavings: "A calcular" },
      { label: "Apple", limit: "Sin límite", estimatedAnnualSavings: "A calcular" },
      { label: "Deportes", limit: "Sin límite", estimatedAnnualSavings: "A calcular" },
      { label: "Entretenimiento", limit: "Sin límite", estimatedAnnualSavings: "A calcular" },
      { label: "Bonus Gnial", limit: "Sin límite", estimatedAnnualSavings: "A calcular" },
    ],
  },
  {
    id: "clasica-visa",
    name: "Clásica Visa",
    issuer: "Popular",
    network: "Visa",
    badge: "estandar",
    badgeLabel: "Estándar — Comparador de tarjetas EfiCredit",
    estimatedAnnualSavings: -233.58,
    annualCost: "DOP$1,450.00",
    minIncome: "DOP$25,000.00",
    redemption: "Ver en el website",
    imagePath: null,
    perks: ["Asistencia global", "Skybox gratis durante 12 meses", "Protección de precio", "Protección de compra"],
    cashback: [{ label: "Programa de recompensa", limit: "Sin límite", estimatedAnnualSavings: "DOP$1,216.42" }],
  },
  {
    id: "clasica-mastercard",
    name: "Clásica Mastercard",
    issuer: "Popular",
    network: "Mastercard",
    badge: "estandar",
    badgeLabel: "Estándar — Comparador de tarjetas EfiCredit",
    estimatedAnnualSavings: -233.58,
    annualCost: "DOP$1,450.00",
    minIncome: "DOP$25,000.00",
    redemption: "Ver en el website",
    imagePath: null,
    perks: ["Asistencia global", "Protección de compra"],
    cashback: [{ label: "Programa de recompensa", limit: "Sin límite", estimatedAnnualSavings: "DOP$1,216.42" }],
  },
  {
    id: "clasica-intl-visa",
    name: "Clásica Internacional Visa",
    issuer: "Popular",
    network: "Visa",
    badge: "estandar",
    badgeLabel: "Estándar — Comparador de tarjetas EfiCredit",
    estimatedAnnualSavings: -263.33,
    annualCost: "USD$25.00",
    minIncome: "DOP$20,000.00",
    redemption: "Ver en el website",
    imagePath: null,
    perks: [
      "Centro de atención al cliente Visa digital y teléfono",
      "Portal de beneficios Visa",
      "Protección de precios",
      "SkyBox durante 12 meses",
    ],
    cashback: [{ label: "Programa de recompensa", limit: "Sin límite", estimatedAnnualSavings: "DOP$1,216.42" }],
  },
  {
    id: "clasica-intl-mastercard",
    name: "Clásica Internacional Mastercard",
    issuer: "Popular",
    network: "Mastercard",
    badge: "estandar",
    badgeLabel: "Estándar — Comparador de tarjetas EfiCredit",
    estimatedAnnualSavings: -263.33,
    annualCost: "USD$25.00",
    minIncome: "DOP$20,000.00",
    redemption: "Ver en el website",
    imagePath: null,
    perks: ["Mastercard Global Service", "Protección de compras", "Garantía extendida"],
    cashback: [{ label: "Programa de recompensa", limit: "Sin límite", estimatedAnnualSavings: "DOP$1,216.42" }],
  },
  {
    id: "gold-visa",
    name: "Gold Visa",
    issuer: "Popular",
    network: "Visa",
    badge: "estandar",
    badgeLabel: "Estándar — Comparador de tarjetas EfiCredit",
    estimatedAnnualSavings: -983.58,
    annualCost: "DOP$2,200.00",
    minIncome: "No identificado",
    redemption: "Ver en el website",
    imagePath: "/cards/gold-visa-mastercard.png",
    perks: [
      "Garantía extendida",
      "Protección de compra",
      "Skybox gratis durante 12 meses",
      "Bloomberg durante 2 meses",
      "Protección de precios",
      "Portal de beneficios Visa",
      "Centro de atención al cliente Visa digital y teléfono",
    ],
    cashback: [{ label: "Programa de recompensa", limit: "Sin límite", estimatedAnnualSavings: "DOP$1,216.42" }],
  },
  {
    id: "gold-mastercard",
    name: "Gold Mastercard",
    issuer: "Popular",
    network: "Mastercard",
    badge: "estandar",
    badgeLabel: "Estándar — Comparador de tarjetas EfiCredit",
    estimatedAnnualSavings: -983.58,
    annualCost: "DOP$2,200.00",
    minIncome: "No identificado",
    redemption: "Ver en el website",
    imagePath: "/cards/gold-visa-mastercard.png",
    perks: ["Mastercard Global Service", "Protección de compras", "Garantía extendida"],
    cashback: [{ label: "Programa de recompensa", limit: "Sin límite", estimatedAnnualSavings: "DOP$1,216.42" }],
  },
  {
    id: "visa-ikea-family",
    name: "Visa Ikea Family",
    issuer: "Popular",
    network: "Visa",
    badge: "estandar",
    badgeLabel: "Estándar — Comparador de tarjetas EfiCredit",
    estimatedAnnualSavings: -1500.0,
    annualCost: "DOP$1,500.00",
    minIncome: "DOP$20,000.00",
    redemption: "No aplica",
    imagePath: "/cards/ikea-family.png",
    perks: [
      "Protección de precios",
      "Centro de atención al cliente Visa",
      "Reposición de tarjeta emergencia",
      "Desembolso de efectivo de emergencia",
      "Portal de beneficios Visa",
      "Servicio de información para el viajero Visa",
    ],
    cashback: [{ label: "Ikea (5%)", limit: "Sin límite", estimatedAnnualSavings: "A calcular" }],
  },
  {
    id: "mastercard-almacenes-iberia",
    name: "Mastercard Almacenes Iberia",
    issuer: "Popular",
    network: "Mastercard",
    badge: "estandar",
    badgeLabel: "Estándar — Comparador de tarjetas EfiCredit",
    estimatedAnnualSavings: -1500.0,
    annualCost: "DOP$1,500.00",
    minIncome: "No identificado",
    redemption: "No aplica",
    imagePath: null,
    perks: ["Protección de compras", "MasterGlobal Service", "Priceless Specials Surprises"],
    cashback: [{ label: "Almacenes Iberia (5%)", limit: "Sin límite", estimatedAnnualSavings: "A calcular" }],
  },
];
