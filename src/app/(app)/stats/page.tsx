import { createClient } from "@/lib/supabase/server";

export default async function StatsPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_day, started_at")
    .maybeSingle();

  const { data: immersion } = await supabase
    .from("immersion_logs")
    .select("minutes, logged_on");

  const { count: reviews } = await supabase
    .from("review_logs")
    .select("*", { count: "exact", head: true });

  const { data: kana } = await supabase
    .from("kana_sessions")
    .select("correct, total, duration_sec");

  const { data: tasks } = await supabase
    .from("task_completions")
    .select("day_number, completed_at");

  const totalImmersion = (immersion ?? []).reduce((a, x) => a + x.minutes, 0);
  const daysWithImmersion = new Set((immersion ?? []).map((x) => x.logged_on)).size;
  const kanaCorrect = (kana ?? []).reduce((a, x) => a + x.correct, 0);
  const kanaTotal = (kana ?? []).reduce((a, x) => a + x.total, 0);
  const daysDone = new Set((tasks ?? []).map((t) => t.day_number)).size;

  // crude streak: consecutive calendar days with any task or immersion ending today
  const activityDays = new Set<string>([
    ...(immersion ?? []).map((x) => x.logged_on),
    ...(tasks ?? []).map((t) => t.completed_at.slice(0, 10)),
  ]);
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!activityDays.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const cards = [
    { label: "Dia atual", value: `${profile?.current_day ?? 1}/30` },
    { label: "Streak", value: `${streak}d` },
    { label: "Imersão total", value: `${totalImmersion} min` },
    { label: "Dias com imersão", value: String(daysWithImmersion) },
    { label: "Reviews SRS", value: String(reviews ?? 0) },
    {
      label: "Kana acerto",
      value: kanaTotal ? `${Math.round((kanaCorrect / kanaTotal) * 100)}%` : "—",
    },
    { label: "Dias com task", value: String(daysDone) },
    { label: "Início", value: profile?.started_at ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stats</h1>
        <p className="mt-1 text-sm text-zinc-400">Visão seca do progresso — sem gamificação.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-5"
          >
            <div className="text-xs uppercase tracking-wider text-zinc-500">{c.label}</div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
