"use client";

import { useEffect } from "react";

const storageKey = "dealicious-recent";
const limit = 8;

export function readRecent(): string[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) return parsed.slice(0, limit);
  } catch {
    localStorage.removeItem(storageKey);
  }
  return [];
}

export function RememberView({ recipeId }: { recipeId: string }) {
  useEffect(() => {
    const next = [recipeId, ...readRecent().filter((id) => id !== recipeId)].slice(0, limit);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }, [recipeId]);
  return null;
}
