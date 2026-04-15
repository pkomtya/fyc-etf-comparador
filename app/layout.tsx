import "./globals.css";
import type { Metadata } from "next";
import Topbar from "./components/Topbar";

export const metadata: Metadata = {
  title: "Comparador ETF — Finanzas y Café",
  description: "Comparador de ETFs con 23 criterios educativos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Topbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-black/10 py-4 text-center text-sm text-black/60">
          Datos vía FMP · Solo fines educativos · Finanzas y Café
        </footer>
      </body>
    </html>
  );
}
