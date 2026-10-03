import { existsSync } from "fs";
import path from "path";

export function recipePhoto(id: string): string | null {
  const file = path.join(process.cwd(), "public", "meals", `${id}.webp`);
  return existsSync(file) ? `/meals/${id}.webp` : null;
}
