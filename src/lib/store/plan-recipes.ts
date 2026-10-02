import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { dataDir } from "./data-dir";

const filePath = path.join(dataDir(), "plan-recipes.json");

async function readAll(): Promise<Record<string, string[]>> {
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8")) as Record<string, string[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeAll(all: Record<string, string[]>): Promise<void> {
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(all, null, 2)}\n`, "utf8");
  } catch {
    // Read-only deploy. The plan still renders from the database rows.
  }
}

export async function readPlanRecipes(planId: string): Promise<string[] | null> {
  const ids = (await readAll())[planId];
  return Array.isArray(ids) && ids.length > 0 ? ids : null;
}

export async function writePlanRecipes(planId: string, recipeIds: string[]): Promise<void> {
  const all = await readAll();
  all[planId] = recipeIds;
  await writeAll(all);
}
