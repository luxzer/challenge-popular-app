// Seeds the demo user "Luis" and all app data into Supabase.
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

const CATEGORIES = [
  {
    id: "delivery",
    name: "Delivery y restaurantes",
    color_var: "var(--brand-navy-deep)",
    insight: "41% más que en julio",
    insight_tone: "danger",
    sort_order: 1,
  },
  {
    id: "supermercado",
    name: "Supermercado",
    color_var: "var(--brand-blue)",
    insight: "6% menos que en julio",
    insight_tone: "success",
    sort_order: 2,
  },
  {
    id: "transporte",
    name: "Transporte",
    color_var: "var(--brand-blue-light)",
    insight: "Igual que en julio",
    insight_tone: "neutral",
    sort_order: 3,
  },
  {
    id: "servicios",
    name: "Servicios y suscripciones",
    color_var: "var(--brand-orange)",
    insight: "2 suscripciones sin uso reciente",
    insight_tone: "warning",
    sort_order: 4,
  },
  { id: "otros", name: "Otros", color_var: "var(--divider)", insight: null, insight_tone: null, sort_order: 5 },
];

const CATEGORY_TOTALS = { delivery: 9190, supermercado: 5320, transporte: 3870, servicios: 3385 };
const TOTAL_GASTOS = 24180;

const TRANSACTIONS = [
  { id: "t1", merchant: "PEDIDOSYA", occurred_on: "2026-08-26", amount: 588.38, category_id: "delivery" },
  { id: "t2", merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-24", amount: 354.25, category_id: "delivery" },
  { id: "t3", merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-24", amount: 317.5, category_id: "delivery" },
  { id: "t4", merchant: "PEDIDOSYA", occurred_on: "2026-08-19", amount: 421.9, category_id: "delivery" },
  { id: "t5", merchant: "UBER EATS-W*UBER EATS", occurred_on: "2026-08-15", amount: 298.6, category_id: "delivery" },
  { id: "t6", merchant: "PEDIDOSYA", occurred_on: "2026-08-11", amount: 512.75, category_id: "delivery" },
  { id: "t7", merchant: "SUPERMERCADO NACIONAL", occurred_on: "2026-08-23", amount: 2140.0, category_id: "supermercado" },
  { id: "t8", merchant: "LA SIRENA", occurred_on: "2026-08-09", amount: 1680.5, category_id: "supermercado" },
  { id: "t9", merchant: "JUMBO", occurred_on: "2026-08-02", amount: 1499.5, category_id: "supermercado" },
  { id: "t10", merchant: "UBER", occurred_on: "2026-08-27", amount: 340.0, category_id: "transporte" },
  { id: "t11", merchant: "GASOLINA SHELL", occurred_on: "2026-08-20", amount: 2200.0, category_id: "transporte" },
  { id: "t12", merchant: "METRO SANTO DOMINGO", occurred_on: "2026-08-05", amount: 1330.0, category_id: "transporte" },
  { id: "t13", merchant: "NETFLIX.COM", occurred_on: "2026-08-14", amount: 590.0, category_id: "servicios" },
  { id: "t14", merchant: "SPOTIFY", occurred_on: "2026-08-13", amount: 259.0, category_id: "servicios" },
  { id: "t15", merchant: "CLARO DOMINICANA", occurred_on: "2026-08-10", amount: 1850.0, category_id: "servicios" },
  { id: "t16", merchant: "GYM FITNESS CLUB", occurred_on: "2026-08-06", amount: 686.0, category_id: "servicios" },
];

const ACTIONS = [
  {
    id: "auto-ahorro",
    title: "Automatiza RD$1,500 al mes a tu cuenta de ahorro",
    detail:
      "El día 30 te queda saldo sin usar en la cuenta 830842753. Programarlo antes de gastarlo es lo que más mueve tu score hoy.",
    score_impact_pts: 15,
    money_impact_label: "RD$18,000 al año",
    primary_cta: "Activar transferencia",
    secondary_cta: "No me aplica",
    direction: "up",
    category: "ahorro",
    sort_order: 1,
  },
  {
    id: "abono-tarjeta",
    title: "Abona RD$4,200 antes del 09 sept",
    detail:
      "Tu tarjeta ****1122 cierra el 09 de septiembre. Abonar antes del corte reduce tu uso de crédito reportado y te ahorra intereses.",
    score_impact_pts: 9,
    money_impact_label: "RD$480 ahorrados",
    primary_cta: "Programar abono",
    secondary_cta: "No me aplica",
    direction: "down",
    category: "deuda",
    sort_order: 2,
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
    id: "clasica-visa",
    name: "Clásica Visa",
    issuer: "Popular",
    network: "Visa",
    badge: "estandar",
    badge_label: "Estándar — Comparador de tarjetas EfiCredit",
    estimated_annual_savings: -233.58,
    annual_cost: "DOP$1,450.00",
    min_income: "DOP$25,000.00",
    redemption: "Ver en el website",
    perks: ["Asistencia global", "Skybox gratis durante 12 meses", "Protección de precio", "Protección de compra"],
    image_path: null,
    match_category_ids: [],
    sort_order: 3,
    cashback: [{ label: "Programa de recompensa", limit_label: "Sin límite", estimated_savings_label: "DOP$1,216.42" }],
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
    image_path: null,
    match_category_ids: [],
    sort_order: 4,
    cashback: [{ label: "Programa de recompensa", limit_label: "Sin límite", estimated_savings_label: "DOP$1,216.42" }],
  },
  {
    id: "clasica-intl-visa",
    name: "Clásica Internacional Visa",
    issuer: "Popular",
    network: "Visa",
    badge: "estandar",
    badge_label: "Estándar — Comparador de tarjetas EfiCredit",
    estimated_annual_savings: -263.33,
    annual_cost: "USD$25.00",
    min_income: "DOP$20,000.00",
    redemption: "Ver en el website",
    perks: [
      "Centro de atención al cliente Visa digital y teléfono",
      "Portal de beneficios Visa",
      "Protección de precios",
      "SkyBox durante 12 meses",
    ],
    image_path: null,
    match_category_ids: [],
    sort_order: 5,
    cashback: [{ label: "Programa de recompensa", limit_label: "Sin límite", estimated_savings_label: "DOP$1,216.42" }],
  },
  {
    id: "clasica-intl-mastercard",
    name: "Clásica Internacional Mastercard",
    issuer: "Popular",
    network: "Mastercard",
    badge: "estandar",
    badge_label: "Estándar — Comparador de tarjetas EfiCredit",
    estimated_annual_savings: -263.33,
    annual_cost: "USD$25.00",
    min_income: "DOP$20,000.00",
    redemption: "Ver en el website",
    perks: ["Mastercard Global Service", "Protección de compras", "Garantía extendida"],
    image_path: null,
    match_category_ids: [],
    sort_order: 6,
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
    sort_order: 7,
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
    sort_order: 8,
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
    sort_order: 9,
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
    image_path: null,
    match_category_ids: [],
    sort_order: 10,
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
  let { data: existingUser } = await supabase.from("app_users").select("id").eq("first_name", "Luis").maybeSingle();
  let userId = existingUser?.id;
  if (!userId) {
    const { data, error } = await supabase.from("app_users").insert({ first_name: "Luis" }).select("id").single();
    if (error) throw error;
    userId = data.id;
  }
  console.log("User id:", userId);

  console.log("Seeding account signals...");
  await upsert("account_signals", [
    {
      user_id: userId,
      as_of_date: "2026-08-27",
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
  ]);

  console.log("Seeding category totals...");
  const known = Object.values(CATEGORY_TOTALS).reduce((a, b) => a + b, 0);
  const otros = TOTAL_GASTOS - known;
  await upsert(
    "category_totals",
    [...Object.entries(CATEGORY_TOTALS).map(([category_id, amount]) => ({ user_id: userId, category_id, month: MONTH, amount })), {
      user_id: userId,
      category_id: "otros",
      month: MONTH,
      amount: otros,
    }]
  );

  console.log("Seeding category remainders...");
  await upsert("category_remainders", [{ user_id: userId, category_id: "delivery", month: MONTH, extra_count: 7 }]);

  console.log("Seeding transactions...");
  await upsert(
    "transactions",
    TRANSACTIONS.map((t) => ({ ...t, user_id: userId }))
  );

  console.log("Seeding suggested actions...");
  await upsert(
    "suggested_actions",
    ACTIONS.map((a) => ({ ...a, user_id: userId }))
  );

  console.log("Done.");
}

async function upsert(table, rows) {
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
