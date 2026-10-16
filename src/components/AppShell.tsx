import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

const NAV = [
  { href: "/agora", label: "Agora" },
  { href: "/kana", label: "Kana" },
  { href: "/srs", label: "SRS" },
  { href: "/imersao", label: "Imersão" },
  { href: "/leitura", label: "Leitura" },
  { href: "/lookup", label: "Lookup" },
  { href: "/stats", label: "Stats" },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_day")
    .maybeSingle();

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/agora" className="font-semibold tracking-tight text-zinc-100">
            JP Focus
            <span className="ml-2 text-xs font-normal text-zinc-500">
              dia {profile?.current_day ?? 1}/30
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1 overflow-x-auto text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
