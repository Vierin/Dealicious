import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { dataDir } from "./data-dir";

const secretPath = path.join(dataDir(), "secret");
let memorySecret: string | null = null;

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
  const fromEnv = process.env.SESSION_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (memorySecret) return memorySecret;
  try {
    await mkdir(path.dirname(secretPath), { recursive: true });
    try {
      const stored = (await readFile(secretPath, "utf8")).trim();
      if (stored) return stored;
    } catch {
      // missing file, write a new one below
    }
    const value = randomBytes(32).toString("hex");
    await writeFile(secretPath, value, "utf8");
    return value;
  } catch {
    memorySecret = randomBytes(32).toString("hex");
    return memorySecret;
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
