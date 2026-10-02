import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), ".data");
const secretPath = path.join(dataDir, "secret");

export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

async function secret(): Promise<string> {
  await mkdir(dataDir, { recursive: true });
  try {
    return (await readFile(secretPath, "utf8")).trim();
  } catch {
    const value = randomBytes(32).toString("hex");
    await writeFile(secretPath, value, "utf8");
    return value;
  }
}

export async function signSession(userId: string): Promise<string> {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const payload = `${userId}.${exp}`;
  const sig = createHmac("sha256", await secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export async function readSession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  if (!userId || !exp || !sig) return null;
  if (Number(exp) < Date.now()) return null;
  const payload = `${userId}.${exp}`;
  const expected = createHmac("sha256", await secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return userId;
}
