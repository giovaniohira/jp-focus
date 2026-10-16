"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { schedule, type Grade } from "@/lib/srs";
import { parseApkg } from "@/lib/apkg";

async function uid() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Não autenticado");
  return { supabase, userId: data.user.id };
}

export async function completeTask(dayNumber: number, taskId: string) {
  const { supabase, userId } = await uid();
  await supabase.from("task_completions").upsert(
    { user_id: userId, day_number: dayNumber, task_id: taskId },
    { onConflict: "user_id,day_number,task_id" },
  );
  revalidatePath("/agora");
  revalidatePath(`/dia/${dayNumber}`);
}

export async function uncompleteTask(dayNumber: number, taskId: string) {
  const { supabase, userId } = await uid();
  await supabase
    .from("task_completions")
    .delete()
    .eq("user_id", userId)
    .eq("day_number", dayNumber)
    .eq("task_id", taskId);
  revalidatePath("/agora");
  revalidatePath(`/dia/${dayNumber}`);
}

export async function setCurrentDay(day: number) {
  const { supabase, userId } = await uid();
  await supabase.from("profiles").update({ current_day: day }).eq("id", userId);
  revalidatePath("/agora");
  revalidatePath("/stats");
}

export async function advanceDayIfComplete(day: number, totalTasks: number) {
  const { supabase, userId } = await uid();
  const { count } = await supabase
    .from("task_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("day_number", day);
  if ((count ?? 0) >= totalTasks && day < 30) {
    await supabase
      .from("profiles")
      .update({ current_day: day + 1 })
      .eq("id", userId);
  }
  revalidatePath("/agora");
}

export async function logKanaSession(correct: number, total: number, durationSec: number) {
  const { supabase, userId } = await uid();
  await supabase.from("kana_sessions").insert({
    user_id: userId,
    correct,
    total,
    duration_sec: durationSec,
  });
  revalidatePath("/stats");
}

export async function logImmersion(formData: FormData) {
  const { supabase, userId } = await uid();
  const minutes = Number(formData.get("minutes"));
  const kind = String(formData.get("kind"));
  const mode = String(formData.get("mode"));
  const note = String(formData.get("note") || "");
  if (!minutes || minutes < 1) throw new Error("Minutos inválidos");
  await supabase.from("immersion_logs").insert({
    user_id: userId,
    minutes,
    kind,
    mode,
    note,
  });
  revalidatePath("/imersao");
  revalidatePath("/stats");
  revalidatePath("/agora");
}

export async function upsertReadingPages(challengeId: string, pages: number) {
  const { supabase, userId } = await uid();
  await supabase.from("reading_progress").upsert(
    {
      user_id: userId,
      challenge_id: challengeId,
      pages_done: pages,
      completed: pages >= 100,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,challenge_id" },
  );
  revalidatePath("/leitura");
  revalidatePath("/stats");
}

export async function markPassageDone(passageId: string) {
  const { supabase, userId } = await uid();
  await supabase.from("reading_progress").upsert(
    {
      user_id: userId,
      challenge_id: passageId,
      pages_done: 1,
      completed: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,challenge_id" },
  );
  revalidatePath("/leitura");
}

export async function importApkg(formData: FormData) {
  const { supabase, userId } = await uid();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Selecione um .apkg");
  const buf = await file.arrayBuffer();
  const { deckName, notes } = await parseApkg(buf);
  if (!notes.length) throw new Error("Nenhum card encontrado no arquivo");

  const { data: deck, error: deckErr } = await supabase
    .from("decks")
    .insert({
      user_id: userId,
      name: deckName,
      source_filename: file.name,
    })
    .select("id")
    .single();
  if (deckErr || !deck) throw new Error(deckErr?.message || "Falha ao criar deck");

  const rows = notes.map((n) => ({
    deck_id: deck.id,
    user_id: userId,
    front: n.front,
    reading: n.reading,
    meaning: n.meaning,
    extra: n.extra,
    state: "new",
  }));

  // batch insert
  const chunk = 200;
  for (let i = 0; i < rows.length; i += chunk) {
    const { error } = await supabase.from("cards").insert(rows.slice(i, i + chunk));
    if (error) throw new Error(error.message);
  }

  revalidatePath("/srs");
  return { deckName, count: notes.length };
}

export async function reviewCard(cardId: string, grade: Grade) {
  const { supabase, userId } = await uid();
  const { data: card, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", cardId)
    .eq("user_id", userId)
    .single();
  if (error || !card) throw new Error("Card não encontrado");

  const updated = schedule(
    {
      id: card.id,
      due_at: card.due_at,
      interval_days: card.interval_days,
      ease: card.ease,
      reps: card.reps,
      lapses: card.lapses,
      learning_step: card.learning_step,
      state: card.state,
    },
    grade,
  );

  await supabase
    .from("cards")
    .update({
      due_at: updated.due_at,
      interval_days: updated.interval_days,
      ease: updated.ease,
      reps: updated.reps,
      lapses: updated.lapses,
      learning_step: updated.learning_step,
      state: updated.state,
    })
    .eq("id", cardId);

  await supabase.from("review_logs").insert({
    user_id: userId,
    card_id: cardId,
    grade,
  });

  revalidatePath("/srs");
  revalidatePath("/stats");
}
