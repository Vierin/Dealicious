import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Profile } from "../types";
import { dataDir } from "./data-dir";

export type ProfileExtras = Partial<Pick<Profile, "diet" | "appliances" | "weeklyBudgetPln" | "dailyKcal" | "cookDays">>;

const filePath = path.join(dataDir(), "profile-extras.json");

async function readAll(): Promise<Record<string, ProfileExtras>> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Record<string, ProfileExtras>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function readProfileExtras(userId: string): Promise<ProfileExtras | null> {
  const all = await readAll();
  return all[userId] ?? null;
}

async function writeAll(all: Record<string, ProfileExtras>): Promise<void> {
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(all, null, 2)}\n`, "utf8");
  } catch {
    // Read-only deploy. Extras stay in the request only.
  }
}

export async function writeProfileExtras(userId: string, extras: ProfileExtras): Promise<void> {
  const all = await readAll();
  all[userId] = extras;
  await writeAll(all);
}

export async function clearProfileExtras(userId: string): Promise<void> {
  const all = await readAll();
  if (!all[userId]) return;
  delete all[userId];
  await writeAll(all);
}
