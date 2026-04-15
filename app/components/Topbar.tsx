"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const links = [
  { href: "/", label: "Comparador" },
  { href: "/glosario", label: "Glosario" },
  { href: "/metodologia", label: "Metodología" },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="bg-brand-yellow text-brand-black border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          ☕ Comparador ETF · Finanzas y Café
        </Link>
        <nav className="flex items-center gap-2 ml-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md border border-black text-sm font-medium transition ${
                  active
                    ? "bg-brand-black text-brand-yellow"
                    : "bg-brand-yellow text-brand-black hover:bg-black/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {email ? (
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-md border border-black text-sm font-medium"
            >
              Salir
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md border border-black text-sm font-medium"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
