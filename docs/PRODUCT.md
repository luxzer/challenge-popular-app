# Salud Financiera — Brief de producto

> Resumen del brief original del equipo (Challenge Popular — Banco Popular,
> track Inteligencia Artificial y Tecnología). Este documento es la fuente de
> verdad de negocio; el código implementa lo descrito aquí.

## Equipo

Los Búhos — Luis Calderón, Daniel Jiménez, Luis Terrero, Jade Elizabeth.

## Resumen ejecutivo

Una nueva funcionalidad dentro de la app existente de Banco Popular que le da
a cada usuario visibilidad clara de su salud financiera, un score bancario
propio, recomendaciones personalizadas y accionables, y un asistente
conversacional (agente de IA) para resolver dudas en el momento — todo
basado en los datos transaccionales que el banco ya posee.

Por qué es una buena idea:
- Se integra a una app que el usuario ya usa.
- Convierte datos que el banco ya tiene en valor tangible para el cliente.
- Fortalece la relación banco-cliente al posicionar al banco como aliado
  financiero, no solo como custodio del dinero.
- Es medible: se puede rastrear si mejora el comportamiento financiero real
  (ahorro, reducción de deuda, adopción de recomendaciones).

## Clientes objetivo

- Clientes antiguos con productos financieros pero sin los conocimientos para
  gestionarlos adecuadamente.
- Clientes antiguos buscando tasas más competitivas o financiamiento.
- Clientes jóvenes interesados en el crecimiento de su salud financiera.

## El problema

Falta de visibilidad y orientación respecto a la salud financiera del
cliente, lo que dificulta decisiones informadas y seguimiento de su
situación económica — agravado por barreras económicas (ej. costo de
consultar el score crediticio con un buró).

## Nuestra ventaja

- Experiencia en sector financiero, inversiones y análisis de datos.
- Experiencia en agentes de IA, chatbots y automatizaciones.
- Capacidad de simplificar conceptos complejos.

## Competencia

- **Directa:** burós de crédito (concentran el acceso a la información
  crediticia).
- **Sustitutos:** apps de finanzas externas, banca tradicional.
- **No hacer nada:** muchos clientes no actúan por falta de orientación
  clara, no por falta de interés.

## La solución

Un módulo que ofrece un resumen consolidado de salud financiera, genera un
score bancario propio a partir de la distribución de gastos, recomienda
tarjetas y productos que se ajustan a los patrones de consumo reales, e
incluye un chatbot/agente de IA para consultar en tiempo real cómo mejorar
el score.

### Cómo funciona (proceso)

1. **Datos existentes** — transacciones, depósitos, retiros, pagos de
   tarjeta, transferencias y balances que el banco ya tiene. No se pide nada
   nuevo al usuario.
2. **Diagnóstico y score** — se genera un score propio y recomendaciones
   personalizadas a partir de esos datos.
3. **Agente de IA conversacional** — traduce preguntas del usuario en
   consultas sobre su propio diagnóstico ya calculado. No genera respuestas
   libres ni "adivina": consulta el diagnóstico y las recomendaciones ya
   calculadas, evitando alucinaciones con datos financieros sensibles.
4. **Ciclo de mejora** — el feedback del usuario (aceptar/ignorar
   recomendaciones) retroalimenta el sistema.

### Flujo de pantallas (10 capas del módulo)

1. Entrada al módulo "Salud Financiera"
2. Dashboard principal
3. Desglose del score
4. Resumen financiero del usuario
5. Análisis de gastos
6. Recomendaciones personalizadas
7. Agente de IA
8. Metas financieras *(pendiente — ver `ARCHITECTURE.md`)*
9. Simulación de escenarios con el agente *(pendiente)*
10. Acciones sugeridas

## Diferenciadores (votación del equipo)

| Escala | Resultado | Enfoque |
|---|---|---|
| Genérico → **Personalizado** | 40% — más fuerte | Adaptarse a cada usuario, no soluciones estándar |
| Costoso → **Accesible** | 33% | Alcanzable sin comprometer calidad |
| Dependencia → **Autonomía financiera** | 30% | Control total del cliente sobre sus recursos |
| Difícil → **Fácil** | 25% | Eliminar complejidad |
| Caro → **Gratuito** | 20% | Sin barreras de entrada |
| Manual → **Automático** | 20% | Automatizar procesos repetitivos |

## Principios de diseño

1. Educar e informar al usuario sobre su situación financiera para
   decisiones más responsables.
2. Elegir soluciones simples y comprensibles.
3. Diseñar para el peor día del usuario, no solo el mejor.

## Hipótesis fundacional

- **Creemos que** los usuarios de Banco Popular sin visibilidad ni control
  claro sobre su situación financiera necesitan una forma simple de entender
  en qué se les va el dinero y qué hacer al respecto.
- **Cada cliente tiene un punto de partida distinto**: desde quienes
  necesitan estabilizar su situación hasta quienes ya están listos para
  ahorrar más, invertir o diversificar.
- **Podemos resolverlo** con una funcionalidad que calcula un diagnóstico a
  partir de transacciones que el banco ya tiene, genera recomendaciones
  accionables, y resuelve dudas vía un agente de IA basado en ese
  diagnóstico.
- **Es mejor porque** no pide nada nuevo al usuario, traduce información
  compleja a lenguaje simple, y combina diagnóstico + recomendación +
  conversación en un solo flujo.
- **Sabremos que funciona cuando** veamos mejoras medibles en el
  comportamiento financiero real (tasa de ahorro, reducción de
  sobreendeudamiento, adopción de recomendaciones).

## Plan de crecimiento

1. Piloto con usuarios de baja visibilidad financiera para validar
   diagnóstico y recomendaciones.
2. Ampliación gradual, afinando el agente con preguntas reales de usuarios.
3. Medir éxito por mejora real en salud financiera, no solo adopción/uso.
4. Integrar ofertas bancarias personalizadas dentro del flujo conversacional.
5. Largo plazo: herramienta de referencia en educación financiera, con
   alianzas institucionales.
