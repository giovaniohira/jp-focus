import JSZip from "jszip";
import initSqlJs from "sql.js";

export type ImportedNote = {
  front: string;
  reading: string;
  meaning: string;
  extra: string;
};

function stripHtml(s: string) {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function pickField(
  names: string[],
  values: string[],
  candidates: string[],
): string {
  const lower = names.map((n) => n.toLowerCase());
  for (const c of candidates) {
    const i = lower.findIndex((n) => n.includes(c));
    if (i >= 0 && values[i]) return stripHtml(values[i]!);
  }
  return "";
}

export async function parseApkg(buffer: ArrayBuffer): Promise<{
  deckName: string;
  notes: ImportedNote[];
}> {
  const zip = await JSZip.loadAsync(buffer);
  const dbFile =
    zip.file("collection.anki21") ||
    zip.file("collection.anki2") ||
    zip.file("collection.anki21b");
  if (!dbFile) throw new Error("Arquivo .apkg inválido (sem collection).");

  const SQL = await initSqlJs({
    locateFile: (f) => `https://sql.js.org/dist/${f}`,
  });
  const db = new SQL.Database(new Uint8Array(await dbFile.async("uint8array")));

  const col = db.exec("SELECT decks, models FROM col");
  let deckName = "Deck importado";
  const models: Record<
    string,
    { name: string; flds: { name: string }[] }
  > = {};

  if (col[0]?.values[0]) {
    const decksJson = JSON.parse(String(col[0].values[0][0]));
    const modelsJson = JSON.parse(String(col[0].values[0][1]));
    const firstDeck = Object.values(decksJson).find(
      (d) => (d as { id: number }).id !== 1,
    ) as { name?: string } | undefined;
    deckName = firstDeck?.name || deckName;
    for (const [id, m] of Object.entries(modelsJson)) {
      const model = m as { name: string; flds: { name: string }[] };
      models[id] = model;
    }
  }

  const noteRows = db.exec("SELECT mid, flds FROM notes");
  const notes: ImportedNote[] = [];

  if (noteRows[0]) {
    for (const row of noteRows[0].values) {
      const mid = String(row[0]);
      const flds = String(row[1]).split("\x1f");
      const model = models[mid];
      const names = model?.flds.map((f) => f.name) ?? flds.map((_, i) => `f${i}`);

      const front =
        pickField(names, flds, ["word", "expression", "vocab", "kanji", "front", "character"]) ||
        stripHtml(flds[0] ?? "");
      const reading =
        pickField(names, flds, ["reading", "kana", "pronunciation", "hiragana"]) ||
        stripHtml(flds[1] ?? "");
      const meaning =
        pickField(names, flds, ["meaning", "english", "definition", "gloss", "back"]) ||
        stripHtml(flds[2] ?? flds[1] ?? "");
      const extra = flds
        .slice(3)
        .map(stripHtml)
        .filter(Boolean)
        .join(" · ");

      if (!front) continue;
      // skip anki instruction/explanation cards
      if (front.length > 200 && !reading) continue;

      notes.push({ front, reading, meaning, extra });
    }
  }

  db.close();
  return { deckName, notes };
}
