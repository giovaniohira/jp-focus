/**
 * Runnable check for SRS scheduler.
 * Run: npx tsx src/lib/srs.selfcheck.ts
 */
import { schedule, type SrsCard } from "./srs";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

const base: SrsCard = {
  id: "1",
  due_at: new Date().toISOString(),
  interval_days: 0,
  ease: 2.5,
  reps: 0,
  lapses: 0,
  learning_step: 0,
  state: "new",
};

const now = new Date("2026-01-01T12:00:00Z");
let c = schedule(base, "again", now);
assert(c.state === "learning", "again from new -> learning");
assert(c.learning_step === 0, "reset step");

c = schedule(c, "good", now);
assert(c.state === "learning", "first good stays learning");
assert(c.learning_step === 1, "step advances");

c = schedule(c, "good", now);
assert(c.learning_step === 2, "step 2");

c = schedule(c, "good", now);
assert(c.state === "review", "graduated");
assert(c.interval_days === 1, "first interval 1d");

const before = c.interval_days;
c = schedule(c, "good", now);
assert(c.interval_days > before, "good grows interval");

c = schedule(c, "again", now);
assert(c.state === "relearning", "lapse -> relearning");
assert(c.lapses === 1, "lapse counted");

console.log("srs.selfcheck: ok");
