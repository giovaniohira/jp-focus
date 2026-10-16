export type Passage = {
  id: string;
  week: 1 | 2 | 3 | 4;
  title: string;
  jp: string;
  hint: string;
};

export const PASSAGES: Passage[] = [
  {
    id: "w1-1",
    week: 1,
    title: "Cumprimentos",
    jp: "おはようございます。\nこんにちは。\nこんばんは。\nありがとう。\nすみません。",
    hint: "Saudacões básicas. Leia em voz alta.",
  },
  {
    id: "w1-2",
    week: 1,
    title: "Eu sou…",
    jp: "わたしは学生です。\nこれは本です。\nあれは猫です。",
    hint: "〜は〜です — estrutura básica Cure Dolly.",
  },
  {
    id: "w2-1",
    week: 2,
    title: "Rotina",
    jp: "毎朝、コーヒーを飲みます。\n今日は日本語を勉強します。\n夜にアニメを見ます。",
    hint: "Verbos em ます. Quem faz a ação?",
  },
  {
    id: "w2-2",
    week: 2,
    title: "Em casa",
    jp: "部屋に机があります。\n窓の外は静かです。\n音楽を聞きながら休みます。",
    hint: "あります / ながら.",
  },
  {
    id: "w3-1",
    week: 3,
    title: "Diálogo curto",
    jp: "A: 今、何をしていますか。\nB: 本を読んでいます。\nA: 面白いですか。\nB: はい、とても面白いです。",
    hint: "〜ています (ação em progresso).",
  },
  {
    id: "w3-2",
    week: 3,
    title: "Tempo",
    jp: "昨日は雨でした。\n明日は友達と会います。\n来週、新しい単語を覚えます。",
    hint: "Passado でした / planos futuros.",
  },
  {
    id: "w4-1",
    week: 4,
    title: "Cena SoL",
    jp: "駅の前で友達を待っています。\n少し遅れているみたいです。\nスマホで音楽を聞きながら待ちます。",
    hint: "みたいです / ながら — sinta o ritmo da frase.",
  },
  {
    id: "w4-2",
    week: 4,
    title: "Reflexão",
    jp: "毎日少しずつ勉強しています。\nまだ難しいけど、前より分かるようになりました。\nこれからも続けます。",
    hint: "ようになりました — mudança gradual.",
  },
];

/** Contador estilo Yotsuba — meta 100 páginas até o dia 30. */
export const MANGA_CHALLENGE = {
  id: "yotsuba-100",
  title: "Challenge mangá (100 páginas)",
  goalPages: 100,
  milestones: [
    { day: 14, pages: 10 },
    { day: 21, pages: 40 },
    { day: 28, pages: 80 },
    { day: 30, pages: 100 },
  ],
};

export function weekFromDay(day: number): 1 | 2 | 3 | 4 {
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
}
