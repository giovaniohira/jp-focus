"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { pickKana, romajiMatch, type KanaItem } from "@/lib/kana-data";
import { logKanaSession } from "@/app/actions";

const SESSION_SEC = 10 * 60;

export function KanaTrainer() {
  const [includeKata, setIncludeKata] = useState(true);
  const [item, setItem] = useState<KanaItem | null>(null);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [left, setLeft] = useState(SESSION_SEC);
  const [running, setRunning] = useState(false);
  const [feedback, setFeedback] = useState<"ok" | "bad" | null>(null);
  const [, start] = useTransition();

  const accuracy = useMemo(
    () => (total ? Math.round((correct / total) * 100) : 0),
    [correct, total],
  );

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      start(() => logKanaSession(correct, total, SESSION_SEC));
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left, correct, total, start]);

  function next() {
    setItem(pickKana(1, includeKata)[0]!);
    setInput("");
    setFeedback(null);
  }

  function begin() {
    setCorrect(0);
    setTotal(0);
    setLeft(SESSION_SEC);
    setRunning(true);
    next();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!item || !running) return;
    const ok = romajiMatch(input, item.romaji);
    setTotal((n) => n + 1);
    if (ok) setCorrect((n) => n + 1);
    setFeedback(ok ? "ok" : "bad");
    setTimeout(next, ok ? 250 : 900);
  }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeKata}
            disabled={running}
            onChange={(e) => setIncludeKata(e.target.checked)}
          />
          Incluir katakana
        </label>
        <span>
          {mm}:{ss} · {correct}/{total} ({accuracy}%)
        </span>
      </div>

      {!running ? (
        <button
          type="button"
          onClick={begin}
          className="w-full rounded-lg bg-zinc-100 text-zinc-950 font-medium py-3 hover:bg-white"
        >
          {left === 0 ? "Nova sessão (10 min)" : "Iniciar 10 minutos"}
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div
            className={`rounded-xl border border-zinc-800 bg-zinc-900/50 py-16 text-center text-7xl tracking-wide ${
              feedback === "ok"
                ? "text-emerald-400"
                : feedback === "bad"
                  ? "text-red-400"
                  : "text-zinc-50"
            }`}
          >
            {item?.char}
          </div>
          {feedback === "bad" && item ? (
            <p className="text-center text-sm text-red-300/90">
              Resposta: <span className="font-mono">{item.romaji}</span>
            </p>
          ) : null}
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-center text-lg font-mono outline-none focus:border-zinc-400"
            placeholder="romaji"
            autoComplete="off"
            autoCapitalize="off"
          />
        </form>
      )}
    </div>
  );
}
