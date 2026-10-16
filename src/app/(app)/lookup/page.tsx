import { LookupBox } from "@/components/LookupBox";

export default function LookupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Lookup</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Busca via Jisho API. Bom para minerar palavras da imersão e dos textos.
        </p>
      </div>
      <LookupBox />
    </div>
  );
}
