"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";

const storageKey = "dealicious-favorites";

export function readFavorites(): string[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) return parsed;
  } catch {
    localStorage.removeItem(storageKey);
  }
  return [];
}

export function FavoriteButton({ recipeId }: { recipeId: string }) {
  const t = useTranslations("recipe");
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(readFavorites().includes(recipeId));
  }, [recipeId]);

  function toggle() {
    const current = readFavorites();
    const next = current.includes(recipeId)
      ? current.filter((id) => id !== recipeId)
      : [...current, recipeId];
    localStorage.setItem(storageKey, JSON.stringify(next));
    setOn(next.includes(recipeId));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={on ? t("favoriteRemove") : t("favoriteAdd")}
      className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 ${on ? "text-[#8a3d32]" : "text-ink"}`}
    >
      <HeartIcon filled={on} />
    </button>
  );
}

export function HeartIcon({ filled }: { filled?: boolean }) {
  return <Heart size={22} strokeWidth={1.75} fill={filled ? "currentColor" : "none"} aria-hidden />;
}
