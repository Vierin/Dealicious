import os from "os";
import path from "path";

export function dataDir(): string {
  if (process.env.VERCEL) return path.join(os.tmpdir(), "dealicious");
  return path.join(process.cwd(), ".data");
}
