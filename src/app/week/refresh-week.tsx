"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { postJson } from "@/lib/http";

export function RefreshWeek() {
  const router = useRouter();
  const t = useTranslations("week");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    setPending(true);
    try {
      await postJson("/api/plan", { body: { keep: [] }, fallback: t("refreshError") });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("refreshError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={refresh}
        disabled={pending}
        className="shrink-0 rounded-full border border-line bg-paper px-3 py-1.5 text-sm disabled:opacity-60"
      >
        {pending ? t("refreshing") : t("refreshAll")}
      </button>
      {error ? <p className="max-w-48 text-right text-sm text-[#8a3d32]">{error}</p> : null}
    </div>
  );
}
