"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function authMessage(message: string): string {
  if (/invalid login credentials/i.test(message)) return "Неверная почта или пароль";
  if (/user already registered/i.test(message)) return "Такой аккаунт уже есть";
  if (/email not confirmed/i.test(message)) return "Подтверди почту";
  return message;
}

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const supabase = createClient();
      const emailValue = email.trim().toLowerCase();
      const auth =
        mode === "signup"
          ? await supabase.auth.signUp({ email: emailValue, password })
          : await supabase.auth.signInWithPassword({ email: emailValue, password });
      if (auth.error) throw new Error(authMessage(auth.error.message));
      if (!auth.data.session) throw new Error("Подтверди почту. Для локальной разработки выключи Confirm email в Supabase.");

      const response = await fetch("/api/session");
      const data = (await response.json()) as { error?: string; profileComplete?: boolean };
      if (!response.ok) throw new Error(data.error ?? "Сессия не сохранилась");
      router.push(data.profileComplete ? "/week" : "/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вышло");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-16">
      <p className="text-sm tracking-wide text-olive uppercase">Варшава · Biedronka</p>
      <h1 className="mt-3 font-serif text-5xl leading-none">Dealicious</h1>
      <p className="mt-4 max-w-sm text-lg text-muted">Неделя обедов из того, что сейчас по акции.</p>

      <form onSubmit={submit} className="mt-10 flex flex-col gap-3">
        <label className="flex flex-col gap-2 text-sm text-muted">
          Почта
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 rounded-2xl border border-line bg-paper px-4 text-base text-ink outline-none focus:border-olive"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-muted">
          Пароль
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-2xl border border-line bg-paper px-4 text-base text-ink outline-none focus:border-olive"
          />
        </label>
        {error ? <p className="text-sm text-[#8a3d32]">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-3 h-12 rounded-full bg-olive text-base text-paper disabled:opacity-60"
        >
          {pending ? "Секунду…" : mode === "signup" ? "Создать аккаунт" : "Войти"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signup" ? "login" : "signup");
          setError("");
        }}
        className="mt-6 text-left text-sm text-muted"
      >
        {mode === "signup" ? "Уже есть аккаунт" : "Нет аккаунта — создать"}
      </button>
    </main>
  );
}
