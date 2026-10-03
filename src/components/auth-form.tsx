"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Field } from "@/components/field";
import { createClient } from "@/lib/supabase/client";

function redirectTo(): string {
  return `${window.location.origin}/login`;
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  function authMessage(message: string): string {
    if (/invalid login credentials/i.test(message)) return t("badCredentials");
    if (/user already registered/i.test(message)) return t("alreadyExists");
    if (/email not confirmed/i.test(message)) return t("emailNotConfirmed");
    if (/rate limit|error sending confirmation email/i.test(message)) return t("rateLimit");
    return message;
  }

  async function enter() {
    const response = await fetch("/api/session");
    const data = (await response.json()) as { error?: string; profileComplete?: boolean };
    if (!response.ok) throw new Error(data.error ?? t("session"));
    router.push(data.profileComplete ? "/week" : "/onboarding");
    router.refresh();
  }

  async function resend() {
    setError("");
    setPending(true);
    try {
      const emailValue = email.trim().toLowerCase();
      const { error: resendError } = await createClient().auth.resend({
        type: "signup",
        email: emailValue,
        options: { emailRedirectTo: redirectTo() },
      });
      if (resendError) throw new Error(authMessage(resendError.message));
      setNotice(t("sentAgain", { email: emailValue }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failed"));
    } finally {
      setPending(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    try {
      const supabase = createClient();
      const emailValue = email.trim().toLowerCase();
      const auth =
        mode === "signup"
          ? await supabase.auth.signUp({
              email: emailValue,
              password,
              options: { emailRedirectTo: redirectTo() },
            })
          : await supabase.auth.signInWithPassword({ email: emailValue, password });
      if (auth.error) throw new Error(authMessage(auth.error.message));
      if (mode === "signup" && (auth.data.user?.identities?.length ?? 0) === 0) {
        throw new Error(t("alreadyExists"));
      }
      if (!auth.data.session) {
        setNotice(t("confirmSent", { email: emailValue }));
        return;
      }
      await enter();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-16">
      <h1 className="font-serif text-5xl leading-none">Dealicious</h1>
      <p className="mt-4 max-w-sm text-lg text-muted">{t("tagline")}</p>

      <form onSubmit={submit} className="mt-10 flex flex-col gap-3">
        <label className="flex flex-col gap-2 text-sm text-muted">
          {t("email")}
          <Field
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-muted">
          {t("password")}
          <Field
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {notice ? <p className="text-sm text-olive">{notice}</p> : null}
        {error ? <p className="text-sm text-[#8a3d32]">{error}</p> : null}
        {notice ? (
          <button type="button" onClick={resend} disabled={pending} className="text-left text-sm text-ink underline disabled:opacity-60">
            {t("resend")}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-3 h-12 rounded-full bg-olive text-base text-paper disabled:opacity-60"
        >
          {pending ? t("wait") : mode === "signup" ? t("signUp") : t("signIn")}
        </button>
      </form>

      {mode === "signup" ? (
        <Link href="/login" className="mt-6 text-sm text-muted">
          {t("hasAccount")}
        </Link>
      ) : (
        <Link href="/signup" className="mt-6 text-sm text-muted">
          {t("noAccount")}
        </Link>
      )}
    </main>
  );
}
