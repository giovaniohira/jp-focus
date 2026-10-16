import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDay } from "@/lib/roadmap";
import { TaskList } from "@/components/TaskList";
import { setCurrentDay } from "@/app/actions";

export default async function DiaPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const dayNum = Number(n);
  if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > 30) notFound();

  const day = getDay(dayNum);
  const supabase = await createClient();
  const { data: completions } = await supabase
    .from("task_completions")
    .select("task_id")
    .eq("day_number", dayNum);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Dia {day.day} · {day.stage}
          </p>
          <h1 className="mt-2 text-2xl font-semibold">{day.focus}</h1>
        </div>
        <form
          action={async () => {
            "use server";
            await setCurrentDay(dayNum);
          }}
        >
          <button
            type="submit"
            className="text-xs border border-zinc-700 rounded px-3 py-1.5 text-zinc-400 hover:text-zinc-100"
          >
            Definir como dia atual
          </button>
        </form>
      </div>
      <TaskList
        day={day.day}
        tasks={day.tasks}
        doneIds={(completions ?? []).map((c) => c.task_id)}
      />
      <Link href="/agora" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Voltar ao Agora
      </Link>
    </div>
  );
}
