/**
 * Catálogo de la Academia Popular (finanzasconproposito.edu.do), para que
 * Aliado pueda referenciar un curso puntual cuando la pregunta del usuario
 * calza con un tema — nunca de forma forzada, y nunca inventando un link.
 *
 * Solo "Finanzas Básicas Popular" tiene el slug real confirmado. El resto
 * apunta al catálogo general (real, verificado) hasta que se confirmen los
 * slugs exactos de cada curso — ver docs/DATA.md.
 */

const CATALOG_URL = "https://www.finanzasconproposito.edu.do/slides/all";

export type AcademiaCourse = {
  title: string;
  description: string;
  level?: "Básico" | "Intermedio" | "Avanzado";
  temas: string[];
  url: string;
};

export const ACADEMIA_COURSES: AcademiaCourse[] = [
  {
    title: "Finanzas en pareja",
    description: "Fomentar una cultura financiera sostenible en el hogar, junto a los coaches Pamela Pichardo y Giancarlo Jiménez.",
    temas: ["pareja", "hogar", "finanzas familiares", "cultura financiera en el hogar"],
    url: CATALOG_URL,
  },
  {
    title: "La tarjeta de crédito, su propósito de uso y beneficios",
    description: "Qué es una tarjeta de crédito, para qué sirve y cómo usarla a tu favor.",
    level: "Básico",
    temas: ["tarjeta de crédito", "uso de tarjetas", "beneficios de tarjetas", "cashback"],
    url: CATALOG_URL,
  },
  {
    title: "Aprendiendo a ahorrar con propósito",
    description: "El ahorro como uno de los pilares de las finanzas personales.",
    level: "Básico",
    temas: ["ahorro", "cómo ahorrar", "capacidad de ahorro", "hábitos de ahorro"],
    url: CATALOG_URL,
  },
  {
    title: "Salud y bienestar integral para una vida con propósito",
    description: "Comportamientos de bienestar para alcanzar el próximo nivel en tu estado de salud.",
    temas: ["bienestar", "salud", "estilo de vida"],
    url: CATALOG_URL,
  },
  {
    title: "Gestiona tu negocio: ¿cómo separar las finanzas personales de las del negocio?",
    description: "Separar tus finanzas personales de las de tu negocio para tener mayor control, organización y claridad.",
    level: "Avanzado",
    temas: ["negocio propio", "separar finanzas", "finanzas del negocio", "emprendimiento"],
    url: CATALOG_URL,
  },
  {
    title: "Desarrolla una mentalidad y actitud emprendedora",
    description: "Qué es el emprendimiento y cómo se diferencia de los negocios y empresas tradicionales.",
    level: "Básico",
    temas: ["emprendimiento", "mentalidad emprendedora"],
    url: CATALOG_URL,
  },
  {
    title: "Aprendiendo a construir mis sueños, mi primer vehículo",
    description: "Cómo planificar y financiar la compra de tu primer vehículo.",
    level: "Intermedio",
    temas: ["comprar carro", "primer vehículo", "financiamiento de vehículo", "préstamo de auto"],
    url: CATALOG_URL,
  },
  {
    title: "Construyendo un retiro con Propósito",
    description: "Cómo planificar el retiro: llegar al momento de no depender de un ingreso por trabajo.",
    level: "Básico",
    temas: ["retiro", "jubilación", "pensión", "planificación a largo plazo"],
    url: CATALOG_URL,
  },
  {
    title: "Presupuesto, la clave para tu transformación financiera",
    description: "El presupuesto como herramienta fundamental de organización financiera.",
    level: "Básico",
    temas: ["presupuesto", "organizar gastos", "control de gastos", "en qué se me va el dinero"],
    url: CATALOG_URL,
  },
  {
    title: "Finanzas Básicas Popular",
    description: "Fundamentos de educación financiera para el desarrollo y bienestar integral.",
    level: "Intermedio",
    temas: ["fundamentos financieros", "educación financiera", "empezar de cero"],
    url: "https://www.finanzasconproposito.edu.do/slides/finanzas-basicas-popular-12",
  },
  {
    title: "Aprendiendo sobre deudas",
    description: "Deudas, préstamos o financiamientos: cómo funcionan y cómo manejarlos.",
    level: "Avanzado",
    temas: ["deudas", "préstamos", "financiamientos", "consolidar deuda", "uso de crédito", "sobreendeudamiento"],
    url: CATALOG_URL,
  },
  {
    title: "Analizando estados para mejorar las finanzas de tu negocio",
    description: "La rentabilidad como primer nivel necesario para la generación de efectivo de un negocio.",
    level: "Básico",
    temas: ["estados financieros", "rentabilidad del negocio", "finanzas del negocio"],
    url: CATALOG_URL,
  },
  {
    title: "Aventura Financiera",
    description: "Principios básicos del manejo del dinero para elevar tu conciencia financiera.",
    level: "Avanzado",
    temas: ["principios básicos del dinero", "conciencia financiera"],
    url: CATALOG_URL,
  },
  {
    title: "Pasos para tu emprendimiento",
    description: "Primeros pasos para iniciar tu emprendimiento.",
    level: "Avanzado",
    temas: ["emprendimiento", "iniciar un negocio"],
    url: CATALOG_URL,
  },
  {
    title: "Eleva tus Inversiones",
    description: "Enfoque práctico sobre la importancia de invertir para construir riqueza y estabilidad financiera.",
    level: "Avanzado",
    temas: ["inversión", "construir riqueza"],
    url: CATALOG_URL,
  },
  {
    title: "Crea y gestiona tu patrimonio",
    description: "Herramientas esenciales para la planificación financiera personal y de patrimonio.",
    level: "Básico",
    temas: ["patrimonio", "planificación financiera personal"],
    url: CATALOG_URL,
  },
  {
    title: "Mi Primera inversión Popular",
    description: "Ventajas, herramientas y opciones de inversión del mercado de valores de RD.",
    level: "Intermedio",
    temas: ["primera inversión", "mercado de valores", "cómo invertir"],
    url: CATALOG_URL,
  },
  {
    title: "Mi primera vivienda",
    description: "Cómo planificar la adquisición de un techo propio: activos, patrimonio o seguridad.",
    level: "Básico",
    temas: ["comprar casa", "primera vivienda", "hipoteca"],
    url: CATALOG_URL,
  },
];
