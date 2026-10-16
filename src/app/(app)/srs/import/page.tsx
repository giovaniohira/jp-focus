import { ApkgImport } from "@/components/ApkgImport";

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Importar deck</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Envie o arquivo .apkg baixado do Kaishi ou RRTK. Os cards ficam na sua conta
          Supabase.
        </p>
      </div>
      <ApkgImport />
    </div>
  );
}
