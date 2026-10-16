"use client";

import { useState, useTransition } from "react";
import { upsertReadingPages, markPassageDone } from "@/app/actions";

export function MangaCounter({
  challengeId,
  initial,
  goal,
}: {
  challengeId: string;
  initial: number;
  goal: number;
}) {
  const [pages, setPages] = useState(initial);
  const [pending, start] = useTransition();

  return (
    <div className="flex items-end gap-3">
      <label className="text-sm text-zinc-400">
        Páginas lidas
        <input
          type="number"
          min={0}
          max={999}
          value={pages}
          onChange={(e) => setPages(Number(e.target.value))}
          className="mt-1 block w-28 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
      </label>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => upsertReadingPages(challengeId, pages))}
        className="rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-900"
      >
        Salvar
      </button>
      <span className="text-sm text-zinc-500 pb-2">
        {pages}/{goal}
      </span>
    </div>
  );
}

export function PassageDoneButton({
  passageId,
  done,
}: {
  passageId: string;
  done: boolean;
}) {
  const [pending, start] = useTransition();
  if (done) return <span className="text-sm text-emerald-500">Concluído</span>;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => markPassageDone(passageId))}
      className="text-sm text-sky-400 hover:text-sky-300"
    >
      Marcar como lido
    </button>
  );
}
