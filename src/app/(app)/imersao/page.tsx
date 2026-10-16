import { createClient } from "@/lib/supabase/server";
import { ImmersionForm } from "@/components/ImmersionForm";

export default async function ImersaoPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: logs } = await supabase
    .from("immersion_logs")
    .select("*")
    .eq("logged_on", today)
    .order("created_at", { ascending: false });

  const todayMin = (logs ?? []).reduce((a, l) => a + l.minutes, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Imersão</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Hoje: <span className="text-zinc-200">{todayMin} min</span> · Meta sugerida ~45–60
          min (rotina de 2h).
        </p>
      </div>
      <ImmersionForm />
      <div>
        <h2 className="text-sm uppercase tracking-wider text-zinc-500 mb-3">Hoje</h2>
        <ul className="space-y-2 text-sm">
          {(logs ?? []).map((l) => (
            <li
              key={l.id}
              className="flex justify-between border border-zinc-800 rounded-lg px-3 py-2"
            >
              <span>
                {l.minutes} min · {l.kind} · {l.mode}
                {l.note ? ` · ${l.note}` : ""}
              </span>
            </li>
          ))}
          {!logs?.length ? (
            <li className="text-zinc-500">Nada registrado ainda.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
