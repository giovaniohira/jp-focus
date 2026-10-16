export type Grade = "again" | "hard" | "good" | "easy";
export type CardState = "new" | "learning" | "review" | "relearning";

export type SrsCard = {
  id: string;
  due_at: string;
  interval_days: number;
  ease: number;
  reps: number;
  lapses: number;
  learning_step: number;
  state: CardState;
};

const LEARNING_STEPS_MIN = [1, 5, 10];
const RELEARN_MIN = 10;

function addMinutes(d: Date, m: number) {
  return new Date(d.getTime() + m * 60_000);
}

function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * 86_400_000);
}

/** Simplified Anki-like scheduler (learning steps + SM-2-ish reviews). */
export function schedule(card: SrsCard, grade: Grade, now = new Date()): SrsCard {
  const next = { ...card };

  if (next.state === "new" || next.state === "learning") {
    if (grade === "again") {
      next.learning_step = 0;
      next.state = "learning";
      next.due_at = addMinutes(now, LEARNING_STEPS_MIN[0]!).toISOString();
      return next;
    }
    const step =
      grade === "hard"
        ? next.learning_step
        : grade === "easy"
          ? LEARNING_STEPS_MIN.length
          : next.learning_step + 1;

    if (step >= LEARNING_STEPS_MIN.length) {
      next.state = "review";
      next.reps = next.reps + 1;
      next.learning_step = 0;
      const days = grade === "easy" ? 4 : 1;
      next.interval_days = days;
      next.due_at = addDays(now, days).toISOString();
      if (grade === "easy") next.ease = Math.min(3.0, next.ease + 0.15);
      return next;
    }
    next.state = "learning";
    next.learning_step = step;
    next.due_at = addMinutes(now, LEARNING_STEPS_MIN[step]!).toISOString();
    return next;
  }

  if (next.state === "relearning") {
    if (grade === "again") {
      next.due_at = addMinutes(now, RELEARN_MIN).toISOString();
      return next;
    }
    next.state = "review";
    next.interval_days = Math.max(1, Math.round(next.interval_days * 0.5) || 1);
    next.due_at = addDays(now, next.interval_days).toISOString();
    next.reps += 1;
    return next;
  }

  // review
  if (grade === "again") {
    next.lapses += 1;
    next.ease = Math.max(1.3, next.ease - 0.2);
    next.state = "relearning";
    next.due_at = addMinutes(now, RELEARN_MIN).toISOString();
    return next;
  }

  let interval = next.interval_days || 1;
  if (grade === "hard") {
    interval = Math.max(1, interval * 1.2);
    next.ease = Math.max(1.3, next.ease - 0.15);
  } else if (grade === "good") {
    interval = interval * next.ease;
  } else {
    interval = interval * next.ease * 1.3;
    next.ease = Math.min(3.0, next.ease + 0.15);
  }

  next.interval_days = Math.max(1, Math.round(interval * 10) / 10);
  next.reps += 1;
  next.state = "review";
  next.due_at = addDays(now, next.interval_days).toISOString();
  return next;
}
