"use client";

import { useState, useTransition } from "react";
import { reviewCard } from "@/app/actions";
import type { Grade } from "@/lib/srs";

type Card = {
  id: string;
  front: string;
  reading: string;
  meaning: string;
  extra: string;
  state: string;
};

export function SrsReview({ cards }: { cards: Card[] }) {
  const [queue, setQueue] = useState(cards);
  const [show, setShow] = useState(false);
  const [pending, start] = useTransition();
  const card = queue[0];

  if (!card) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center text-zinc-400">
        Nada devido agora. Bom trabalho.
      </div>
    );
  }

  function grade(g: Grade) {
    const id = card!.id;
    setShow(false);
    setQueue((q) => q.slice(1));
    start(() => reviewCard(id, g));
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <p className="text-sm text-zinc-500">
        Restantes nesta fila: {queue.length}
        {card.state !== "new" ? ` · ${card.state}` : " · novo"}
      </p>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-10 text-center min-h-48 flex flex-col items-center justify-center gap-3">
        <div className="text-4xl text-zinc-50">{card.front}</div>
        {show ? (
          <>
            {card.reading ? (
              <div className="text-xl text-sky-300 font-mono">{card.reading}</div>
            ) : null}
            <div className="text-zinc-300">{card.meaning}</div>
            {card.extra ? (
              <div className="text-xs text-zinc-500 max-w-md">{card.extra}</div>
            ) : null}
          </>
        ) : null}
      </div>

      {!show ? (
        <button
          type="button"
          onClick={() => setShow(true)}
          className="w-full rounded-lg border border-zinc-600 py-3 text-zinc-100 hover:bg-zinc-900"
        >
          Mostrar resposta
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {(
            [
              ["again", "Again", "bg-red-950/80 border-red-800"],
              ["hard", "Hard", "bg-orange-950/60 border-orange-900"],
              ["good", "Good", "bg-emerald-950/60 border-emerald-900"],
              ["easy", "Easy", "bg-sky-950/60 border-sky-900"],
            ] as const
          ).map(([g, label, cls]) => (
            <button
              key={g}
              type="button"
              disabled={pending}
              onClick={() => grade(g)}
              className={`rounded-lg border py-3 text-sm ${cls}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
