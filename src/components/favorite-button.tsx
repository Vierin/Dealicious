"use client";

import { useEffect, useState } from "react";

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
      aria-label={on ? "Убрать из избранного" : "В избранное"}
      className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 ${on ? "text-[#8a3d32]" : "text-ink"}`}
    >
      <HeartIcon filled={on} />
    </button>
  );
}

export function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
