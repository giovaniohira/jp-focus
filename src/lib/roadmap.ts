export type TaskKind =
  | "read"
  | "video"
  | "kana"
  | "grammar"
  | "srs"
  | "immersion"
  | "setup"
  | "reading"
  | "check";

export type DayTask = {
  id: string;
  title: string;
  detail?: string;
  href?: string;
  kind: TaskKind;
  minutes?: number;
};

export type DayPlan = {
  day: number;
  stage: string;
  focus: string;
  tasks: DayTask[];
};

const CURE =
  "https://www.youtube.com/playlist?list=PLg9uYxuZf8x_A-vcqqyOFZu06WlhnypWj";
const KANA_INTRO =
  "https://learnjapanese.moe/guide/#hiragana-and-katakana";
const KANA_VIDEO = "https://www.youtube.com/watch?v=_wZHqOghvSs";
const ANKI_GUIDE = "https://www.youtube.com/watch?v=UDUITtA1jJI";
const KAISHI =
  "https://github.com/donkuri/Kaishi/releases";
const RRTK =
  "https://ankiweb.net/shared/info/779833857";

function grammar(n: number): DayTask {
  return {
    id: `grammar-${n}`,
    title: "Gramática — 3 vídeos Cure Dolly",
    detail: "Assista 3 vídeos e marque como feito. Anote o que parecer importante.",
    href: CURE,
    kind: "grammar",
    minutes: 45,
  };
}

function kana(n: number): DayTask {
  return {
    id: `kana-${n}`,
    title: "Treino de kana — 10 minutos",
    detail: "Hiragana + katakana + combinações. Foque em acertar o romaji.",
    href: "/kana",
    kind: "kana",
    minutes: 10,
  };
}

function srs(n: number, detail = "Novos + reviews do dia. Meta: ~20 novos se aguentar."): DayTask {
  return {
    id: `srs-${n}`,
    title: "SRS — cards do dia",
    detail,
    href: "/srs",
    kind: "srs",
    minutes: 30,
  };
}

function immersion(n: number, detail?: string): DayTask {
  return {
    id: `immersion-${n}`,
    title: "Imersão — registrar minutos",
    detail:
      detail ??
      "Anime e/ou música. Prefira ativo (atenção) + um pouco de passivo.",
    href: "/imersao",
    kind: "immersion",
    minutes: 45,
  };
}

/** UsagiSpoon adaptado a ~2h/dia. Fonte: learnjapanese.moe/routine */
export const DAYS: DayPlan[] = [
  {
    day: 1,
    stage: "Kana",
    focus: "Aprender o que são hiragana e katakana e começar a praticar.",
    tasks: [
      {
        id: "d1-read",
        title: "Ler a intro de kana",
        detail: "Até o fim da seção Hiragana/Katakana (antes de Kanji).",
        href: KANA_INTRO,
        kind: "read",
        minutes: 30,
      },
      {
        id: "d1-copy",
        title: "Copiar o chart de kana",
        detail: "No papel ou na tela — escreva cada caractere uma vez.",
        kind: "check",
        minutes: 20,
      },
      {
        id: "d1-video",
        title: "Assistir o vídeo de kana",
        href: KANA_VIDEO,
        kind: "video",
        minutes: 15,
      },
      kana(1),
    ],
  },
  {
    day: 2,
    stage: "Imersão",
    focus: "Criar o Japão em casa: primeiro contato com anime/música.",
    tasks: [
      kana(2),
      {
        id: "d2-pick",
        title: "Escolher 1 anime + playlists de música",
        detail:
          "Slice of life ajuda no começo. Imersão = conteúdo que você gosta.",
        kind: "setup",
        minutes: 15,
      },
      {
        id: "d2-tutor",
        title: "Subtitle tutor (1 episódio)",
        detail:
          "1) Com legenda EN → 2) Sem legenda → 3) Passivo no fundo se sobrar tempo.",
        kind: "immersion",
        minutes: 50,
        href: "/imersao",
      },
    ],
  },
  {
    day: 3,
    stage: "Gramática",
    focus: "Começar Cure Dolly + manter kana e imersão.",
    tasks: [kana(3), grammar(3), immersion(3)],
  },
  {
    day: 4,
    stage: "SRS",
    focus: "Importar Kaishi 1.5k e estudar os primeiros cards.",
    tasks: [
      kana(4),
      grammar(4),
      {
        id: "d4-anki-vid",
        title: "Entender o fluxo do Anki/SRS",
        href: ANKI_GUIDE,
        kind: "video",
        minutes: 10,
      },
      {
        id: "d4-download",
        title: "Baixar Kaishi 1.5k (.apkg)",
        detail: "Pegue o .apkg mais recente no GitHub e importe em /srs.",
        href: KAISHI,
        kind: "setup",
        minutes: 10,
      },
      {
        id: "d4-import",
        title: "Importar o deck no app",
        href: "/srs/import",
        kind: "setup",
        minutes: 5,
      },
      srs(4, "Primeiros ~20 cards. Memorize só palavra + leitura + significado."),
      immersion(4),
    ],
  },
  {
    day: 5,
    stage: "Rotina",
    focus: "Anki + gramática + imersão. Kana ainda no radar.",
    tasks: [kana(5), srs(5), grammar(5), immersion(5)],
  },
  {
    day: 6,
    stage: "Leitura",
    focus: "Começar a olhar legendas JP (setup externo opcional).",
    tasks: [
      kana(6),
      srs(6),
      grammar(6),
      {
        id: "d6-read-note",
        title: "Nota: legendas JP",
        detail:
          "Quando quiser, use player + dicionário no navegador. No app, use Lookup + Leitura.",
        href: "/leitura",
        kind: "reading",
        minutes: 15,
      },
      immersion(6, "Anime com atenção + registrar minutos."),
    ],
  },
  {
    day: 7,
    stage: "Equilíbrio",
    focus: "Fechar a semana 1 com rotina estável.",
    tasks: [
      srs(7),
      grammar(7),
      {
        id: "d7-read",
        title: "Challenge leitura S1 — frases curtas",
        href: "/leitura",
        kind: "reading",
        minutes: 15,
      },
      immersion(7),
    ],
  },
  {
    day: 8,
    stage: "Kanji shapes",
    focus: "RRTK Recognition — ver kanji como composição de formas.",
    tasks: [
      {
        id: "d8-rrtk",
        title: "Baixar e importar RRTK 450",
        detail: "Deck de reconhecimento de formas (não de leitura).",
        href: RRTK,
        kind: "setup",
        minutes: 15,
      },
      srs(8, "Kaishi + RRTK. Não estoure o tempo — priorize reviews."),
      grammar(8),
      immersion(8),
    ],
  },
  ...[9, 10, 11, 12, 13].map(
    (d): DayPlan => ({
      day: d,
      stage: "Repetição",
      focus: "SRS + Cure Dolly + imersão. Leitura leve se sobrar tempo.",
      tasks: [
        srs(d),
        grammar(d),
        ...(d === 10 || d === 12
          ? [
              {
                id: `d${d}-read`,
                title: "Challenge leitura — texto da semana",
                href: "/leitura",
                kind: "reading" as const,
                minutes: 20,
              },
            ]
          : []),
        immersion(d),
      ],
    }),
  ),
  {
    day: 14,
    stage: "Meio do caminho",
    focus: "Abrir o challenge de mangá (contador) + manter a rotina.",
    tasks: [
      srs(14),
      grammar(14),
      {
        id: "d14-yotsuba",
        title: "Abrir challenge Yotsuba (contador)",
        detail: "Meta gradual até 100 páginas até o dia 30. Leia fora; registre aqui.",
        href: "/leitura",
        kind: "reading",
        minutes: 25,
      },
      immersion(14),
    ],
  },
  ...Array.from({ length: 16 }, (_, i) => i + 15).map((d): DayPlan => {
    const weekText = d === 17 || d === 21 || d === 24 || d === 28;
    return {
      day: d,
      stage: "悪戦苦闘",
      focus: "Rotina diária: SRS, gramática, imersão, leitura espaçada.",
      tasks: [
        srs(d),
        grammar(d),
        ...(weekText
          ? [
              {
                id: `d${d}-read`,
                title: "Challenge leitura — texto + páginas",
                href: "/leitura",
                kind: "reading" as const,
                minutes: 25,
              },
            ]
          : d % 3 === 0
            ? [
                {
                  id: `d${d}-pages`,
                  title: "Registrar páginas de mangá",
                  href: "/leitura",
                  kind: "reading" as const,
                  minutes: 20,
                },
              ]
            : []),
        immersion(d),
      ],
    };
  }),
];

export function getDay(n: number): DayPlan {
  return DAYS.find((d) => d.day === n) ?? DAYS[0];
}

export function nextIncompleteTask(
  day: DayPlan,
  done: Set<string>,
): DayTask | null {
  return day.tasks.find((t) => !done.has(t.id)) ?? null;
}
