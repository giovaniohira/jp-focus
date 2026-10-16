"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setInfo(null);
    const supabase = createClient();
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErr(error.message);
      else {
        setInfo("Conta criada. Se pedir confirmação de e-mail, desative em Authentication → Providers no Supabase (projeto pessoal).");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
      else {
        router.push("/agora");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4 w-full max-w-sm">
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={mode === "signup" ? "text-zinc-100" : "text-zinc-500"}
        >
          Criar conta
        </button>
        <span className="text-zinc-700">/</span>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={mode === "login" ? "text-zinc-100" : "text-zinc-500"}
        >
          Entrar
        </button>
      </div>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
      />
      <input
        type="password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="senha"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-zinc-100 text-zinc-950 py-2.5 font-medium"
      >
        {loading ? "…" : mode === "signup" ? "Criar" : "Entrar"}
      </button>
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      {info ? <p className="text-sm text-zinc-400">{info}</p> : null}
    </form>
  );
}
