"use client";

import { useState, useTransition } from "react";
import { importApkg } from "@/app/actions";

export function ApkgImport() {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="space-y-4 max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setMsg(null);
        setErr(null);
        start(async () => {
          try {
            const res = await importApkg(fd);
            setMsg(`Importado: ${res.deckName} (${res.count} cards)`);
          } catch (ex) {
            setErr(ex instanceof Error ? ex.message : "Falha no import");
          }
        });
      }}
    >
      <input
        type="file"
        name="file"
        accept=".apkg"
        required
        className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-100"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-100 text-zinc-950 px-4 py-2 font-medium disabled:opacity-50"
      >
        {pending ? "Importando…" : "Importar .apkg"}
      </button>
      {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      <p className="text-xs text-zinc-500">
        Kaishi: github.com/donkuri/Kaishi/releases · RRTK no AnkiWeb. Uso pessoal —
        o arquivo fica só na sua conta.
      </p>
    </form>
  );
}
