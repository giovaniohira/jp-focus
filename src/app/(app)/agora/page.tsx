import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDay, nextIncompleteTask } from "@/lib/roadmap";
import { TaskList } from "@/components/TaskList";
import { setCurrentDay } from "@/app/actions";

export default async function AgoraPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_day")
    .maybeSingle();
  const dayNum = profile?.current_day ?? 1;
  const day = getDay(dayNum);

  const { data: completions } = await supabase
    .from("task_completions")
    .select("task_id")
    .eq("day_number", dayNum);

  const doneIds = (completions ?? []).map((c) => c.task_id);
  const next = nextIncompleteTask(day, new Set(doneIds));
  const doneCount = doneIds.length;
  const total = day.tasks.length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Agora · Dia {day.day} · {day.stage}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{day.focus}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Progresso do dia: {doneCount}/{total}
          {next ? (
            <>
              {" "}
              · Próximo: <span className="text-zinc-200">{next.title}</span>
            </>
          ) : (
            " · Dia completo."
          )}
        </p>
      </div>

      {next ? (
        <div className="rounded-xl border border-sky-900/60 bg-sky-950/20 p-5">
          <p className="text-xs text-sky-400/80 uppercase tracking-wider">Fazer agora</p>
          <p className="mt-1 text-lg font-medium">{next.title}</p>
          {next.detail ? (
            <p className="mt-1 text-sm text-zinc-400">{next.detail}</p>
          ) : null}
          {next.href ? (
            <a
              href={next.href}
              target={next.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-sky-300 hover:text-sky-200"
            >
              Abrir tarefa →
            </a>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-5">
          <p className="font-medium text-emerald-300">Dia {day.day} concluído</p>
          {day.day < 30 ? (
            <form
              action={async () => {
                "use server";
                await setCurrentDay(day.day + 1);
              }}
            >
              <button type="submit" className="mt-3 text-sm text-sky-300 hover:text-sky-200">
                Avançar para o dia {day.day + 1} →
              </button>
            </form>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">
              Dia 30. Decidimos o pós-rotina juntos.
            </p>
          )}
        </div>
      )}

      <TaskList day={day.day} tasks={day.tasks} doneIds={doneIds} />

      <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
        {day.day > 1 ? (
          <Link href={`/dia/${day.day - 1}`} className="hover:text-zinc-300">
            ← Dia {day.day - 1}
          </Link>
        ) : null}
        <Link href={`/dia/${day.day}`} className="hover:text-zinc-300">
          Ver dia {day.day}
        </Link>
        {day.day < 30 ? (
          <Link href={`/dia/${day.day + 1}`} className="hover:text-zinc-300">
            Dia {day.day + 1} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
