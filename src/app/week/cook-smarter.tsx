"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { postJson } from "@/lib/http";

export function SavedRow({ amount, cook }: { amount: string; cook: boolean }) {
  const router = useRouter();
  const t = useTranslations("week");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setPending(true);
    try {
      await postJson("/api/plan/cook", { body: {}, fallback: t("cookError") });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cookError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-stretch gap-3">
        <Link
          href="/subscribe"
          className="flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-ink px-4 py-3"
        >
          <span className="text-sm">{t("saved")}</span>
          <span className="font-serif text-2xl">{amount}</span>
        </Link>
        {cook ? (
          <button
            type="button"
            onClick={run}
            disabled={pending}
            className="inline-flex shrink-0 items-center rounded-2xl border border-ink bg-ink px-4 text-sm text-cream disabled:opacity-60"
          >
            {pending ? t("cooking") : t("cookSmarter")}
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-right text-sm text-[#8a3d32]">{error}</p> : null}
    </div>
  );
}
