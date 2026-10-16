"use client";

import { useState, useTransition } from "react";
import { logImmersion } from "@/app/actions";

export function ImmersionForm() {
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);

  return (
    <form
      className="space-y-4 max-w-md"
      action={(fd) => {
        setOk(false);
        start(async () => {
          await logImmersion(fd);
          setOk(true);
        });
      }}
    >
      <label className="block text-sm text-zinc-400">
        Minutos
        <input
          name="minutes"
          type="number"
          min={1}
          required
          defaultValue={30}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
        />
      </label>
      <label className="block text-sm text-zinc-400">
        Tipo
        <select
          name="kind"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          defaultValue="anime"
        >
          <option value="anime">Anime</option>
          <option value="musica">Música</option>
          <option value="outro">Outro</option>
        </select>
      </label>
      <label className="block text-sm text-zinc-400">
        Modo
        <select
          name="mode"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          defaultValue="ativo"
        >
          <option value="ativo">Ativo (atenção total)</option>
          <option value="passivo">Passivo (fundo)</option>
        </select>
      </label>
      <label className="block text-sm text-zinc-400">
        Nota (opcional)
        <input
          name="note"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          placeholder="ex: ep 3 Non Non Biyori"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-100 text-zinc-950 px-4 py-2 font-medium disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Registrar"}
      </button>
      {ok ? <p className="text-sm text-emerald-400">Salvo.</p> : null}
    </form>
  );
}
