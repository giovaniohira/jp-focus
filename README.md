# JP Focus

App pessoal de rotina 30 dias (UsagiSpoon / learnjapanese.moe) — checklist, kana, SRS (.apkg), imersão, leitura, lookup, stats.

## Setup local

1. Copie `.env.example` → `.env.local` e preencha URL + keys do Supabase.
2. No dashboard Supabase → Authentication → Providers → Email: desative **Confirm email** (uso pessoal).
3. `npm install && npm run dev`

## Deploy

Vercel + projeto Supabase `jp-helper`. Adicione as mesmas env vars no projeto Vercel e configure Site URL / Redirect URLs no Auth.
