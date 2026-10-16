import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">JP Focus</h1>
        <p className="text-zinc-400 text-sm max-w-sm">
          30 dias de japonês com imersão — checklist, kana, SRS, lookup e stats.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
