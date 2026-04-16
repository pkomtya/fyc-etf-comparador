"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Comparador" },
  { href: "/glosario", label: "Glosario" },
  { href: "/metodologia", label: "Metodología" },
];

export default function Topbar() {
  const pathname = usePathname();

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
        </nav>
      </div>
    </header>
  );
}
