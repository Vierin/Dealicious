"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeftRight } from "lucide-react";
import { postJson } from "@/lib/http";

export function ReplaceMeal({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const t = useTranslations("week");
  const recipe = useTranslations("recipe");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function replace() {
    setError("");
    setPending(true);
    try {
      await postJson("/api/plan/swap", { body: { recipeId }, fallback: recipe("swapError") });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : recipe("swapError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={replace}
        disabled={pending}
        aria-label={t("replace")}
        className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper/95 text-ink shadow-sm disabled:opacity-60"
      >
        <ArrowLeftRight size={16} strokeWidth={1.75} />
      </button>
      {error ? (
        <p className="absolute top-14 right-3 z-10 max-w-48 rounded-2xl bg-paper px-3 py-2 text-right text-sm text-[#8a3d32] shadow-sm">
          {error}
        </p>
      ) : null}
    </>
  );
}
