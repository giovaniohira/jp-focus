import { createClient } from "@/lib/supabase/server";
import {
  MANGA_CHALLENGE,
  PASSAGES,
  weekFromDay,
} from "@/lib/reading";
import { MangaCounter, PassageDoneButton } from "@/components/ReadingControls";

export default async function LeituraPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_day")
    .maybeSingle();
  const day = profile?.current_day ?? 1;
  const week = weekFromDay(day);

  const { data: progress } = await supabase
    .from("reading_progress")
    .select("challenge_id, pages_done, completed");

  const map = new Map(
    (progress ?? []).map((p) => [p.challenge_id, p] as const),
  );
  const manga = map.get(MANGA_CHALLENGE.id);
  const passages = PASSAGES.filter((p) => p.week <= week);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Leitura</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Textos curtos por semana + contador de mangá (meta 100 págs. até o dia 30).
          Semana atual: {week}.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-zinc-500">
          {MANGA_CHALLENGE.title}
        </h2>
        <p className="text-sm text-zinc-400">
          Leia fora do app (ex.: よつばと！). Marcos: dia 14 → 10p · 21 → 40p · 28 → 80p ·
          30 → 100p.
        </p>
        <MangaCounter
          challengeId={MANGA_CHALLENGE.id}
          initial={manga?.pages_done ?? 0}
          goal={MANGA_CHALLENGE.goalPages}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm uppercase tracking-wider text-zinc-500">
          Textos no app
        </h2>
        {passages.map((p) => {
          const done = map.get(p.id)?.completed;
          return (
            <article
              key={p.id}
              className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/30 space-y-3"
            >
              <div className="flex justify-between gap-3 items-start">
                <div>
                  <h3 className="font-medium">
                    S{p.week} · {p.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{p.hint}</p>
                </div>
                <PassageDoneButton passageId={p.id} done={!!done} />
              </div>
              <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-zinc-100">
                {p.jp}
              </pre>
              <p className="text-xs text-zinc-500">
                Use <a href="/lookup" className="text-sky-400">Lookup</a> para palavras
                desconhecidas.
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
