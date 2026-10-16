import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SrsReview } from "@/components/SrsReview";

export default async function SrsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: decks } = await supabase
    .from("decks")
    .select("id, name")
    .order("created_at", { ascending: true });

  const { count: dueCount } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .lte("due_at", now);

  const { count: newCount } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .eq("state", "new");

  // reviews due first, then new (cap 40 for session)
  const { data: due } = await supabase
    .from("cards")
    .select("id, front, reading, meaning, extra, state")
    .lte("due_at", now)
    .neq("state", "new")
    .order("due_at", { ascending: true })
    .limit(30);

  const remaining = Math.max(0, 40 - (due?.length ?? 0));
  const { data: news } = await supabase
    .from("cards")
    .select("id, front, reading, meaning, extra, state")
    .eq("state", "new")
    .order("created_at", { ascending: true })
    .limit(Math.min(20, remaining));

  const cards = [...(due ?? []), ...(news ?? [])];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">SRS</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Devidos agora: {dueCount ?? 0} · Novos restantes: {newCount ?? 0}
          </p>
        </div>
        <Link
          href="/srs/import"
          className="text-sm border border-zinc-700 rounded px-3 py-1.5 text-zinc-300 hover:bg-zinc-900"
        >
          Importar .apkg
        </Link>
      </div>

      {!decks?.length ? (
        <div className="rounded-xl border border-zinc-800 p-6 text-zinc-400 text-sm">
          Nenhum deck ainda.{" "}
          <Link href="/srs/import" className="text-sky-400">
            Importe o Kaishi 1.5k
          </Link>{" "}
          (dia 4 do roadmap).
        </div>
      ) : (
        <>
          <ul className="text-sm text-zinc-500 flex flex-wrap gap-3">
            {decks.map((d) => (
              <li key={d.id}>{d.name}</li>
            ))}
          </ul>
          <SrsReview cards={cards} />
        </>
      )}
    </div>
  );
}
