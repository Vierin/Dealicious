"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WeekActions() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function rebuild() {
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/plan", { method: "POST" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Не пересчитал");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не пересчитал");
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <button type="button" onClick={rebuild} disabled={pending} className="text-olive disabled:opacity-60">
        {pending ? "Считаю…" : "Пересчитать"}
      </button>
      <a href="/onboarding" className="text-muted">
        Анкета
      </a>
      <button type="button" onClick={logout} className="text-muted">
        Выйти
      </button>
      {error ? <span className="text-[#8a3d32]">{error}</span> : null}
    </div>
  );
}
