"use client";

import { FormEvent, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getSupabaseMessage } from "@/lib/utils";

export function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"login" | "signup" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      return;
    }

    setBusy("login");
    setError("");
    setSuccess("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(getSupabaseMessage(authError, "Não foi possível entrar. Confira email e senha."));
    }

    setBusy(null);
  }

  async function signUp() {
    if (!supabase) {
      return;
    }

    setBusy("signup");
    setError("");
    setSuccess("");

    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(getSupabaseMessage(authError, "Não foi possível criar sua conta."));
    } else {
      setSuccess("Conta criada. Se a confirmação de email estiver ativa, confirme o email antes de entrar.");
    }

    setBusy(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">
            Mercado Rápido
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Sua lista de compras sincronizada e fácil de reutilizar.
          </h1>
        </div>

        <form onSubmit={signIn} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            autoComplete="email"
            required
          />

          <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-base outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            autoComplete="current-password"
            minLength={6}
            required
          />

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {success ? (
            <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              disabled={busy !== null}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <LogIn size={18} aria-hidden="true" />
              {busy === "login" ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              onClick={signUp}
              disabled={busy !== null || !email || password.length < 6}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <UserPlus size={18} aria-hidden="true" />
              {busy === "signup" ? "Criando..." : "Criar conta"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
