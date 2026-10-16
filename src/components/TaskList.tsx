"use client";

import { useTransition } from "react";
import { completeTask, uncompleteTask, advanceDayIfComplete } from "@/app/actions";
import type { DayTask } from "@/lib/roadmap";

export function TaskList({
  day,
  tasks,
  doneIds,
}: {
  day: number;
  tasks: DayTask[];
  doneIds: string[];
}) {
  const done = new Set(doneIds);
  const [pending, start] = useTransition();

  return (
    <ul className="space-y-2">
      {tasks.map((t) => {
        const checked = done.has(t.id);
        return (
          <li
            key={t.id}
            className={`border border-zinc-800 rounded-lg p-4 ${checked ? "opacity-55" : "bg-zinc-900/40"}`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                disabled={pending}
                aria-label={checked ? "Desmarcar" : "Concluir"}
                onClick={() =>
                  start(async () => {
                    if (checked) await uncompleteTask(day, t.id);
                    else {
                      await completeTask(day, t.id);
                      await advanceDayIfComplete(day, tasks.length);
                    }
                  })
                }
                className={`mt-0.5 h-5 w-5 shrink-0 rounded border ${
                  checked
                    ? "bg-emerald-600 border-emerald-500"
                    : "border-zinc-600 hover:border-zinc-400"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-zinc-100">{t.title}</span>
                  {t.minutes ? (
                    <span className="text-xs text-zinc-500">~{t.minutes} min</span>
                  ) : null}
                </div>
                {t.detail ? (
                  <p className="mt-1 text-sm text-zinc-400">{t.detail}</p>
                ) : null}
                {t.href ? (
                  <a
                    href={t.href}
                    target={t.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-sky-400 hover:text-sky-300"
                  >
                    Abrir →
                  </a>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
