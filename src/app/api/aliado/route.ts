import { NextRequest, NextResponse } from "next/server";
import { buildSystemInstruction } from "@/lib/aliado-context";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Falta configurar ANTHROPIC_API_KEY en el servidor. Agrega tu API key de console.anthropic.com en .env.local.",
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

  try {
    const systemInstruction = await buildSystemInstruction();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 512,
        temperature: 0.4,
        system: systemInstruction,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
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
    const reply: string | undefined = data?.content?.[0]?.text;

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
