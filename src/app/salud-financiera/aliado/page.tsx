"use client";

import { FormEvent, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";

type ChatMessage = { role: "user" | "assistant"; content: string };

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hola Luis. Tu score va en 682 y subió 18 puntos este mes. ¿Qué quieres revisar?",
};

const QUICK_REPLIES = ["¿En qué se me va el dinero?", "¿Cómo subo 50 puntos?", "¿Me conviene consolidar mi deuda?"];

export default function AliadoPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/aliado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Ocurrió un error inesperado.");
        return;
      }

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setError("No se pudo conectar con Aliado. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Aliado" subtitle="Asistente de salud financiera" />

      <div className="flex items-center gap-3 border-b border-divider bg-surface px-5 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy-deep/10 text-brand-navy-deep">
          <PieIcon />
        </span>
        <div>
          <p className="text-[15px] font-bold text-ink">Aliado</p>
          <p className="text-xs text-muted">Solo consulta tu diagnóstico · sin estimados</p>
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-page px-5 py-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15px] ${
                m.role === "user"
                  ? "rounded-br-md bg-brand-navy-deep text-white"
                  : "rounded-bl-md bg-surface text-ink shadow-[0_1px_2px_rgba(11,37,69,0.06)]"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading ? (
          <div className="flex justify-start">
            <div className="rounded-3xl rounded-bl-md bg-surface px-4 py-3 text-[15px] text-muted shadow-[0_1px_2px_rgba(11,37,69,0.06)]">
              Escribiendo…
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl bg-danger-bg px-4 py-3 text-sm text-danger">{error}</div>
        ) : null}
      </div>

      <div className="border-t border-divider bg-surface px-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3">
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="shrink-0 rounded-full border border-divider px-4 py-2 text-[13px] font-medium text-ink-soft"
            >
              {q}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta"
            className="flex-1 rounded-full border border-divider bg-page px-4 py-3 text-[15px] text-ink outline-none focus:border-brand-blue"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Enviar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white disabled:opacity-50"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}

function PieIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 12V3a9 9 0 0 1 9 9Z" fill="currentColor" />
    </svg>
  );
}
