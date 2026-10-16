"use client";

import { useState } from "react";

type Sense = {
  english_definitions: string[];
  parts_of_speech: string[];
};

type Word = {
  slug: string;
  japanese: { word?: string; reading?: string }[];
  senses: Sense[];
};

export function LookupBox() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Word[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      setResults(data.data ?? []);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Falha");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={search} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="palavra, kana ou inglês"
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 outline-none focus:border-zinc-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-100 text-zinc-950 px-4 py-2 font-medium"
        >
          {loading ? "…" : "Buscar"}
        </button>
      </form>
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      <ul className="space-y-3">
        {results.map((w) => (
          <li key={w.slug} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/40">
            <div className="text-xl text-zinc-50">
              {w.japanese[0]?.word || w.japanese[0]?.reading}
              {w.japanese[0]?.reading && w.japanese[0]?.word ? (
                <span className="ml-2 text-base text-sky-300 font-mono">
                  {w.japanese[0].reading}
                </span>
              ) : null}
            </div>
            <ul className="mt-2 space-y-1 text-sm text-zinc-400">
              {w.senses.slice(0, 3).map((s, i) => (
                <li key={i}>
                  <span className="text-zinc-600">{s.parts_of_speech.join(", ")} · </span>
                  {s.english_definitions.join("; ")}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
