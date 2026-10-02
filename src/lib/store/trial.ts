import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type TrialRow = { startedAt: string };

const filePath = path.join(process.cwd(), ".data", "trial.json");

async function readAll(): Promise<Record<string, TrialRow>> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Record<string, TrialRow>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function readTrial(userId: string): Promise<string | null> {
  const all = await readAll();
  return all[userId]?.startedAt ?? null;
}

export async function startTrial(userId: string, startedAt: string): Promise<string> {
  const all = await readAll();
  if (all[userId]?.startedAt) return all[userId].startedAt;
  all[userId] = { startedAt };
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(all, null, 2)}\n`, "utf8");
  } catch {
    return startedAt;
  }
  return startedAt;
}
