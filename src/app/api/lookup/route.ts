import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q");
  if (!q?.trim()) {
    return NextResponse.json({ error: "q obrigatório" }, { status: 400 });
  }
  const res = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(q.trim())}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) {
    return NextResponse.json({ error: "Jisho indisponível" }, { status: 502 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
