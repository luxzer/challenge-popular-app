import { NextRequest, NextResponse } from "next/server";
import { buildSystemInstruction } from "@/lib/aliado-context";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Falta configurar GEMINI_API_KEY en el servidor. Agrega tu API key de Google AI Studio en .env.local.",
      },
      { status: 500 }
    );
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Se requiere al menos un mensaje." }, { status: 400 });
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const systemInstruction = await buildSystemInstruction();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Error del proveedor de IA (${res.status}): ${errText.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json(
        { error: "El modelo no devolvió una respuesta. Intenta reformular tu pregunta." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: `No se pudo contactar al proveedor de IA: ${(err as Error).message}` },
      { status: 502 }
    );
  }
}
