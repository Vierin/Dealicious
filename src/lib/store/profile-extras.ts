import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Profile } from "../types";

export type ProfileExtras = Partial<Pick<Profile, "diet" | "appliances" | "weeklyBudgetPln" | "dailyKcal" | "cookDays">>;

const filePath = path.join(process.cwd(), ".data", "profile-extras.json");

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

export async function writeProfileExtras(userId: string, extras: ProfileExtras): Promise<void> {
  const all = await readAll();
  all[userId] = extras;
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(all, null, 2)}\n`, "utf8");
}

export async function clearProfileExtras(userId: string): Promise<void> {
  const all = await readAll();
  if (!all[userId]) return;
  delete all[userId];
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(all, null, 2)}\n`, "utf8");
}
