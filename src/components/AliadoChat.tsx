"use client";

import { FormEvent, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";

type ChatMessage = { role: "user" | "assistant"; content: string };

const QUICK_REPLIES = ["¿En qué se me va el dinero?", "¿Cómo subo 50 puntos?", "¿Que tarjeta me recomiendas?"];

// Matches the exact closing line the system prompt asks the model to use
// when recommending an Academia Popular course, so it can be rendered as
// its own card instead of inline text with a raw (often very long) URL.
const COURSE_LINE = /\n*Si quieres saber más,?\s*ve al curso\s+(.+?)\s+de la Academia Popular:\s*(\S+)\s*$/i;

function splitCourseRecommendation(content: string): { body: string; course: { title: string; url: string } | null } {
  const match = content.match(COURSE_LINE);
  if (!match) return { body: content, course: null };
  return { body: content.slice(0, match.index).trim(), course: { title: match[1].trim(), url: match[2].trim() } };
}

export function AliadoChat({ userFirstName, score, scoreDeltaMonth }: { userFirstName: string; score: number; scoreDeltaMonth: number }) {
  const deltaClause =
    scoreDeltaMonth > 0
      ? ` y subió ${scoreDeltaMonth} puntos este mes`
      : scoreDeltaMonth < 0
        ? ` y bajó ${Math.abs(scoreDeltaMonth)} puntos este mes`
        : ", sin cambios este mes";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hola ${userFirstName}. Tu score va en ${score}${deltaClause}. ¿Qué quieres revisar?`,
    },
  ]);
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
        {messages.map((m, i) => {
          if (m.role === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl rounded-br-md bg-brand-navy-deep px-4 py-3 text-[15px] text-white">
                  {m.content}
                </div>
              </div>
            );
          }

          const { body, course } = splitCourseRecommendation(m.content);
          return (
            <div key={i} className="flex justify-start">
              <div className="max-w-[85%] space-y-2">
                <div className="whitespace-pre-wrap break-words rounded-3xl rounded-bl-md bg-surface px-4 py-3 text-[15px] text-ink shadow-[0_1px_2px_rgba(11,37,69,0.06)]">
                  {body}
                </div>
                {course ? (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-warning-bg px-4 py-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-lg">
                      🎓
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-warning">
                        Academia Popular
                      </span>
                      <span className="block truncate text-[14px] font-semibold text-ink">{course.title}</span>
                    </span>
                    <span className="shrink-0 text-brand-orange">›</span>
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}

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
