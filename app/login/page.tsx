"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/");
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="border border-black/10 rounded-xl p-6 bg-brand-cream">
        <h1 className="text-2xl font-bold mb-1">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="text-sm text-black/60 mb-4">
          Accede al comparador de ETF.
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="correo@ejemplo.com"
            className="w-full px-3 py-2 rounded-md border border-black/30 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Contraseña"
            className="w-full px-3 py-2 rounded-md border border-black/30 bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            disabled={loading}
            className="w-full py-2 rounded-md bg-brand-black text-brand-yellow font-semibold disabled:opacity-60"
          >
            {loading ? "..." : mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-3 text-sm underline"
        >
          {mode === "login"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </div>
  );
}
