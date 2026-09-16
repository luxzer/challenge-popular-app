// Seeds the demo user ("John Doe") and 4 demo profiles into Supabase.
// Run with: npm run db:seed
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (¿corriste con --env-file=.env.local?)");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const MONTH = "2026-08-01";

// Categorías: solo metadata de exhibición. El monto y el insight ("41% más
// que el mes pasado") viven por perfil en category_totals — ver PROFILES.
const CATEGORIES = [
  { id: "delivery", name: "Delivery y restaurantes", color_var: "var(--brand-navy-deep)", sort_order: 1 },
  { id: "supermercado", name: "Supermercado", color_var: "var(--brand-blue)", sort_order: 2 },
  { id: "transporte", name: "Transporte", color_var: "var(--brand-blue-light)", sort_order: 3 },
  { id: "servicios", name: "Servicios y suscripciones", color_var: "var(--brand-orange)", sort_order: 4 },
  { id: "otros", name: "Otros", color_var: "var(--divider)", sort_order: 5 },
];

// Acciones sugeridas: pendientes para una próxima fase (por ahora sin
// contenido real que mostrar, ver docs/PRODUCT.md "ciclo de mejora").
const ACTIONS = [];

/**
 * 4 casos de demo (mismo usuario, distinto perfil financiero) para que los
 * jurados vean escenarios variados solo refrescando el dashboard — ver
 * src/middleware.ts y src/lib/profile.ts. Cada uno es independiente:
 * señales de cuenta, gastos por categoría (con su propio insight vs. mes
 * anterior) y transacciones recientes.
 */
const PROFILES = [
  {
    id: 1,
    label: "Excelente",
    as_of_date: "2026-08-27",
    signals: {
      on_time_payments: 24,
      total_payments: 24,
      credit_utilization_pct: 8,
      income_stability_score: 95,
      monthly_income: 45000,
      products_held: 5,
      products_in_universe: 5,
      score_delta_month: 9,
      score_trend: "En mejora",
    },
    categoryTotals: {
      delivery: { amount: 3000, insight: "12% menos que el mes pasado", insight_tone: "success" },
      supermercado: { amount: 14000, insight: "Estable respecto al mes pasado", insight_tone: "neutral" },
      transporte: { amount: 7000, insight: "Estable respecto al mes pasado", insight_tone: "neutral" },
      servicios: { amount: 4750, insight: "Todas tus suscripciones en uso", insight_tone: "success" },
    },
    totalGastos: 33750,
    remainders: { delivery: 3, supermercado: 2, transporte: 3, servicios: 2 },
    transactions: [
      { merchant: "PEDIDOSYA", occurred_on: "2026-08-20", amount: 800.0, category_id: "delivery" },
      { merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-12", amount: 700.0, category_id: "delivery" },
      { merchant: "SUPERMERCADO NACIONAL", occurred_on: "2026-08-22", amount: 6000.0, category_id: "supermercado" },
      { merchant: "LA SIRENA", occurred_on: "2026-08-08", amount: 5000.0, category_id: "supermercado" },
      { merchant: "GASOLINA SHELL", occurred_on: "2026-08-18", amount: 4000.0, category_id: "transporte" },
      { merchant: "UBER", occurred_on: "2026-08-25", amount: 1500.0, category_id: "transporte" },
      { merchant: "NETFLIX.COM", occurred_on: "2026-08-14", amount: 590.0, category_id: "servicios" },
      { merchant: "SPOTIFY", occurred_on: "2026-08-13", amount: 259.0, category_id: "servicios" },
    ],
  },
  {
    id: 2,
    label: "Bueno / en mejora",
    as_of_date: "2026-08-27",
    signals: {
      on_time_payments: 18,
      total_payments: 18,
      credit_utilization_pct: 19,
      income_stability_score: 70,
      monthly_income: 26280,
      products_held: 2,
      products_in_universe: 5,
      score_delta_month: 18,
      score_trend: "En mejora",
    },
    categoryTotals: {
      delivery: { amount: 9190, insight: "41% más que el mes pasado", insight_tone: "danger" },
      supermercado: { amount: 5320, insight: "6% menos que el mes pasado", insight_tone: "success" },
      transporte: { amount: 3870, insight: "Estable respecto al mes pasado", insight_tone: "neutral" },
      servicios: { amount: 3385, insight: "2 suscripciones sin uso reciente", insight_tone: "warning" },
    },
    totalGastos: 24180,
    remainders: { delivery: 7 },
    transactions: [
      { merchant: "PEDIDOSYA", occurred_on: "2026-08-26", amount: 588.38, category_id: "delivery" },
      { merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-24", amount: 354.25, category_id: "delivery" },
      { merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-24", amount: 317.5, category_id: "delivery" },
      { merchant: "PEDIDOSYA", occurred_on: "2026-08-19", amount: 421.9, category_id: "delivery" },
      { merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-15", amount: 298.6, category_id: "delivery" },
      { merchant: "PEDIDOSYA", occurred_on: "2026-08-11", amount: 512.75, category_id: "delivery" },
      { merchant: "SUPERMERCADO NACIONAL", occurred_on: "2026-08-23", amount: 2140.0, category_id: "supermercado" },
      { merchant: "LA SIRENA", occurred_on: "2026-08-09", amount: 1680.5, category_id: "supermercado" },
      { merchant: "JUMBO", occurred_on: "2026-08-02", amount: 1499.5, category_id: "supermercado" },
      { merchant: "UBER", occurred_on: "2026-08-27", amount: 340.0, category_id: "transporte" },
      { merchant: "GASOLINA SHELL", occurred_on: "2026-08-20", amount: 2200.0, category_id: "transporte" },
      { merchant: "METRO SANTO DOMINGO", occurred_on: "2026-08-05", amount: 1330.0, category_id: "transporte" },
      { merchant: "NETFLIX.COM", occurred_on: "2026-08-14", amount: 590.0, category_id: "servicios" },
      { merchant: "SPOTIFY", occurred_on: "2026-08-13", amount: 259.0, category_id: "servicios" },
      { merchant: "CLARO DOMINICANA", occurred_on: "2026-08-10", amount: 1850.0, category_id: "servicios" },
      { merchant: "GYM FITNESS CLUB", occurred_on: "2026-08-06", amount: 686.0, category_id: "servicios" },
    ],
  },
  {
    id: 3,
    label: "Mejorable",
    as_of_date: "2026-08-27",
    signals: {
      on_time_payments: 17,
      total_payments: 20,
      credit_utilization_pct: 45,
      income_stability_score: 55,
      monthly_income: 32000,
      products_held: 2,
      products_in_universe: 5,
      score_delta_month: 3,
      score_trend: "Estable",
    },
    categoryTotals: {
      delivery: { amount: 6500, insight: "18% más que el mes pasado", insight_tone: "warning" },
      supermercado: { amount: 8000, insight: "3% más que el mes pasado", insight_tone: "neutral" },
      transporte: { amount: 5500, insight: "Estable respecto al mes pasado", insight_tone: "neutral" },
      servicios: { amount: 4300, insight: "1 suscripción sin uso reciente", insight_tone: "warning" },
    },
    totalGastos: 28800,
    remainders: { delivery: 5, supermercado: 1, transporte: 2, servicios: 1 },
    transactions: [
      { merchant: "PEDIDOSYA", occurred_on: "2026-08-21", amount: 900.0, category_id: "delivery" },
      { merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-15", amount: 750.0, category_id: "delivery" },
      { merchant: "SUPERMERCADO NACIONAL", occurred_on: "2026-08-19", amount: 4000.0, category_id: "supermercado" },
      { merchant: "LA SIRENA", occurred_on: "2026-08-07", amount: 3200.0, category_id: "supermercado" },
      { merchant: "GASOLINA SHELL", occurred_on: "2026-08-17", amount: 3000.0, category_id: "transporte" },
      { merchant: "UBER", occurred_on: "2026-08-24", amount: 1200.0, category_id: "transporte" },
      { merchant: "NETFLIX.COM", occurred_on: "2026-08-14", amount: 590.0, category_id: "servicios" },
      { merchant: "CLARO DOMINICANA", occurred_on: "2026-08-09", amount: 1850.0, category_id: "servicios" },
    ],
  },
  {
    id: 4,
    label: "Bajo / en riesgo",
    as_of_date: "2026-08-27",
    signals: {
      on_time_payments: 4,
      total_payments: 20,
      credit_utilization_pct: 90,
      income_stability_score: 25,
      monthly_income: 18000,
      products_held: 1,
      products_in_universe: 5,
      score_delta_month: -14,
      score_trend: "Necesita atención",
    },
    categoryTotals: {
      delivery: { amount: 6500, insight: "62% más que el mes pasado", insight_tone: "danger" },
      supermercado: { amount: 4200, insight: "Estable respecto al mes pasado", insight_tone: "neutral" },
      transporte: { amount: 3800, insight: "Estable respecto al mes pasado", insight_tone: "neutral" },
      servicios: { amount: 3300, insight: "3 suscripciones sin uso reciente", insight_tone: "warning" },
    },
    totalGastos: 19800,
    remainders: { delivery: 6, supermercado: 1, transporte: 1, servicios: 1 },
    transactions: [
      { merchant: "PEDIDOSYA", occurred_on: "2026-08-25", amount: 1200.0, category_id: "delivery" },
      { merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-20", amount: 950.0, category_id: "delivery" },
      { merchant: "PEDIDOSYA", occurred_on: "2026-08-14", amount: 800.0, category_id: "delivery" },
      { merchant: "SUPERMERCADO NACIONAL", occurred_on: "2026-08-21", amount: 2500.0, category_id: "supermercado" },
      { merchant: "LA SIRENA", occurred_on: "2026-08-06", amount: 1200.0, category_id: "supermercado" },
      { merchant: "GASOLINA SHELL", occurred_on: "2026-08-19", amount: 2500.0, category_id: "transporte" },
      { merchant: "UBER", occurred_on: "2026-08-26", amount: 900.0, category_id: "transporte" },
      { merchant: "CLARO DOMINICANA", occurred_on: "2026-08-11", amount: 1850.0, category_id: "servicios" },
      { merchant: "GYM FITNESS CLUB", occurred_on: "2026-08-05", amount: 686.0, category_id: "servicios" },
    ],
  },
];

const CARDS = [
  {
    id: "visa-isi",
    name: "Visa ISI",
    issuer: "Popular",
    network: "Visa",
    badge: "top",
    badge_label: "Top Recomendada — Mejor cashback en EfiCredit",
    estimated_annual_savings: 1050.0,
    annual_cost: "DOP$1,350.00",
    min_income: "DOP$8,000.00",
    redemption: "No aplica",
    perks: [],
    image_path: "/cards/isi.png",
    match_category_ids: ["supermercado", "transporte"],
    preaprobada: true,
    sort_order: 1,
    cashback: [
      { label: "Resto de categorías", limit_label: "DOP$10,000.00 (anual)", estimated_savings_label: "DOP$2,400.00" },
      { label: "Supermercado (5%)", limit_label: "DOP$2,000.00 (mensual)", estimated_savings_label: "A calcular" },
      { label: "Combustible (5%)", limit_label: "DOP$2,000.00 (mensual)", estimated_savings_label: "A calcular" },
      { label: "Compras en línea (2%)", limit_label: "DOP$2,000.00 (mensual)", estimated_savings_label: "A calcular" },
    ],
  },
  {
    id: "mastercard-gnial",
    name: "Mastercard gnial",
    issuer: "Popular",
    network: "Mastercard",
    badge: "top",
    badge_label: "Top Recomendada — Mejor cashback en EfiCredit",
    estimated_annual_savings: 766.42,
    annual_cost: "DOP$450.00",
    min_income: "DOP$20,000.00",
    redemption: "No aplica",
    perks: ["Servicio de asistencia de viajes", "Protección de compras", "Garantía extendida"],
    image_path: "/cards/gnial.png",
    match_category_ids: ["delivery"],
    preaprobada: false,
    sort_order: 2,
    cashback: [
      { label: "Resto de categorías", limit_label: "Sin límite", estimated_savings_label: "DOP$1,216.42" },
      {
        label: "Comida rápida / Juegos digitales / Streaming / Cines / Veterinaria / Airbnb (5% cada una)",
        limit_label: "DOP$1,000.00 (mensual)",
        estimated_savings_label: "A calcular",
      },
      { label: "Universidades", limit_label: "Sin límite", estimated_savings_label: "A calcular" },
      { label: "Librerías", limit_label: "Sin límite", estimated_savings_label: "A calcular" },
      { label: "Amazon", limit_label: "Sin límite", estimated_savings_label: "A calcular" },
      { label: "Apple", limit_label: "Sin límite", estimated_savings_label: "A calcular" },
      { label: "Deportes", limit_label: "Sin límite", estimated_savings_label: "A calcular" },
      { label: "Entretenimiento", limit_label: "Sin límite", estimated_savings_label: "A calcular" },
      { label: "Bonus Gnial", limit_label: "Sin límite", estimated_savings_label: "A calcular" },
    ],
  },
  {
    id: "clasica-mastercard",
    name: "Clásica Mastercard",
    issuer: "Popular",
    network: "Mastercard",
    badge: "estandar",
    badge_label: "Estándar — Comparador de tarjetas EfiCredit",
    estimated_annual_savings: -233.58,
    annual_cost: "DOP$1,450.00",
    min_income: "DOP$25,000.00",
    redemption: "Ver en el website",
    perks: ["Asistencia global", "Protección de compra"],
    image_path: "/cards/clasica-visa-mastercard.png",
    match_category_ids: [],
    preaprobada: false,
    sort_order: 3,
    cashback: [{ label: "Programa de recompensa", limit_label: "Sin límite", estimated_savings_label: "DOP$1,216.42" }],
  },
  {
    id: "gold-visa",
    name: "Gold Visa",
    issuer: "Popular",
    network: "Visa",
    badge: "estandar",
    badge_label: "Estándar — Comparador de tarjetas EfiCredit",
    estimated_annual_savings: -983.58,
    annual_cost: "DOP$2,200.00",
    min_income: "No identificado",
    redemption: "Ver en el website",
    perks: [
      "Garantía extendida",
      "Protección de compra",
      "Skybox gratis durante 12 meses",
      "Bloomberg durante 2 meses",
      "Protección de precios",
      "Portal de beneficios Visa",
      "Centro de atención al cliente Visa digital y teléfono",
    ],
    image_path: "/cards/gold-visa-mastercard.png",
    match_category_ids: [],
    preaprobada: false,
    sort_order: 4,
    cashback: [{ label: "Programa de recompensa", limit_label: "Sin límite", estimated_savings_label: "DOP$1,216.42" }],
  },
  {
    id: "gold-mastercard",
    name: "Gold Mastercard",
    issuer: "Popular",
    network: "Mastercard",
    badge: "estandar",
    badge_label: "Estándar — Comparador de tarjetas EfiCredit",
    estimated_annual_savings: -983.58,
    annual_cost: "DOP$2,200.00",
    min_income: "No identificado",
    redemption: "Ver en el website",
    perks: ["Mastercard Global Service", "Protección de compras", "Garantía extendida"],
    image_path: "/cards/gold-visa-mastercard.png",
    match_category_ids: [],
    preaprobada: false,
    sort_order: 5,
    cashback: [{ label: "Programa de recompensa", limit_label: "Sin límite", estimated_savings_label: "DOP$1,216.42" }],
  },
  {
    id: "visa-ikea-family",
    name: "Visa Ikea Family",
    issuer: "Popular",
    network: "Visa",
    badge: "estandar",
    badge_label: "Estándar — Comparador de tarjetas EfiCredit",
    estimated_annual_savings: -1500.0,
    annual_cost: "DOP$1,500.00",
    min_income: "DOP$20,000.00",
    redemption: "No aplica",
    perks: [
      "Protección de precios",
      "Centro de atención al cliente Visa",
      "Reposición de tarjeta emergencia",
      "Desembolso de efectivo de emergencia",
      "Portal de beneficios Visa",
      "Servicio de información para el viajero Visa",
    ],
    image_path: "/cards/ikea-family.png",
    match_category_ids: [],
    preaprobada: false,
    sort_order: 6,
    cashback: [{ label: "Ikea (5%)", limit_label: "Sin límite", estimated_savings_label: "A calcular" }],
  },
  {
    id: "mastercard-almacenes-iberia",
    name: "Mastercard Almacenes Iberia",
    issuer: "Popular",
    network: "Mastercard",
    badge: "estandar",
    badge_label: "Estándar — Comparador de tarjetas EfiCredit",
    estimated_annual_savings: -1500.0,
    annual_cost: "DOP$1,500.00",
    min_income: "No identificado",
    redemption: "No aplica",
    perks: ["Protección de compras", "MasterGlobal Service", "Priceless Specials Surprises"],
    image_path: "/cards/iberia.png",
    match_category_ids: [],
    preaprobada: false,
    sort_order: 7,
    cashback: [{ label: "Almacenes Iberia (5%)", limit_label: "Sin límite", estimated_savings_label: "A calcular" }],
  },
];

async function main() {
  console.log("Seeding categories...");
  await upsert("categories", CATEGORIES);

  console.log("Seeding cards + cashback items...");
  await upsert(
    "cards",
    CARDS.map(({ cashback, ...card }) => card)
  );
  await supabase.from("card_cashback_items").delete().neq("card_id", "__none__");
  const cashbackRows = CARDS.flatMap((c) =>
    c.cashback.map((item, i) => ({ card_id: c.id, sort_order: i + 1, ...item }))
  );
  await insert("card_cashback_items", cashbackRows);

  console.log("Seeding demo user...");
  let { data: existingUser } = await supabase
    .from("app_users")
    .select("id")
    .eq("first_name", "John Doe")
    .maybeSingle();
  let userId = existingUser?.id;
  if (!userId) {
    const { data, error } = await supabase.from("app_users").insert({ first_name: "John Doe" }).select("id").single();
    if (error) throw error;
    userId = data.id;
  }
  console.log("User id:", userId);

  console.log("Clearing previous profile data...");
  await supabase.from("transactions").delete().eq("user_id", userId);
  await supabase.from("category_remainders").delete().eq("user_id", userId);
  await supabase.from("category_totals").delete().eq("user_id", userId);
  await supabase.from("account_signals").delete().eq("user_id", userId);

  for (const profile of PROFILES) {
    console.log(`Seeding profile ${profile.id} (${profile.label})...`);

    await upsert("account_signals", [
      {
        user_id: userId,
        profile_id: profile.id,
        as_of_date: profile.as_of_date,
        ...profile.signals,
      },
    ]);

    const known = Object.values(profile.categoryTotals).reduce((sum, c) => sum + c.amount, 0);
    const otros = profile.totalGastos - known;
    await upsert("category_totals", [
      ...Object.entries(profile.categoryTotals).map(([category_id, c]) => ({
        user_id: userId,
        profile_id: profile.id,
        category_id,
        month: MONTH,
        amount: c.amount,
        insight: c.insight,
        insight_tone: c.insight_tone,
      })),
      {
        user_id: userId,
        profile_id: profile.id,
        category_id: "otros",
        month: MONTH,
        amount: otros,
        insight: null,
        insight_tone: null,
      },
    ]);

    await upsert(
      "category_remainders",
      Object.entries(profile.remainders).map(([category_id, extra_count]) => ({
        user_id: userId,
        profile_id: profile.id,
        category_id,
        month: MONTH,
        extra_count,
      }))
    );

    await upsert(
      "transactions",
      profile.transactions.map((t, i) => ({
        ...t,
        id: `p${profile.id}-t${i + 1}`,
        user_id: userId,
        profile_id: profile.id,
      }))
    );
  }

  console.log("Seeding suggested actions...");
  await upsert(
    "suggested_actions",
    ACTIONS.map((a) => ({ ...a, user_id: userId }))
  );

  console.log("Done.");
}

async function upsert(table, rows) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows);
  if (error) throw new Error(`upsert ${table}: ${error.message}`);
}

async function insert(table, rows) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`insert ${table}: ${error.message}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
