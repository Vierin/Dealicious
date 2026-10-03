import type { Profile } from "./types";

export type ProfileInput = Omit<Profile, "userId" | "store">;

export async function postJson<T = Record<string, unknown>>(
  path: string,
  init: { method?: string; body?: unknown; fallback: string },
): Promise<T> {
  const response = await fetch(path, {
    method: init.method ?? "POST",
    headers: init.body === undefined ? undefined : { "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? init.fallback);
  return data;
}

export async function saveProfileAndPlan(
  body: ProfileInput,
  errors: { profile: string; plan: string },
): Promise<void> {
  await postJson("/api/profile", { method: "PUT", body, fallback: errors.profile });
  await postJson("/api/plan", { fallback: errors.plan });
}
