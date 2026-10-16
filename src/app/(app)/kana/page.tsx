import { KanaTrainer } from "@/components/KanaTrainer";

export default function KanaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kana</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Digite o romaji do caractere. Sessão padrão: 10 minutos (UsagiSpoon).
        </p>
      </div>
      <KanaTrainer />
    </div>
  );
}
