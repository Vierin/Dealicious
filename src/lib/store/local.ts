import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { buildCatalog } from "../catalog";
import { pickWeek, presentPlan } from "../planner";
import type { Profile, PlanView } from "../types";
import { hashPassword, readSession, signSession, verifyPassword } from "./crypto";

const dataDir = path.join(process.cwd(), ".data");
const dbPath = path.join(dataDir, "db.json");
const cookieName = "dl_session";

type UserRow = {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
};

type PlanRow = {
  id: string;
  userId: string;
  shopDate: string;
  recipeIds: string[];
  createdAt: string;
};

type Db = {
  users: UserRow[];
  profiles: Profile[];
  plans: PlanRow[];
};

let chain: Promise<unknown> = Promise.resolve();

function withDb<T>(fn: (db: Db) => Promise<T> | T): Promise<T> {
  const run = chain.then(async () => {
    const db = await readDb();
    const result = await fn(db);
    await writeDb(db);
    return result;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readDb(): Promise<Db> {
  await mkdir(dataDir, { recursive: true });
  try {
    return JSON.parse(await readFile(dbPath, "utf8")) as Db;
  } catch {
    return { users: [], profiles: [], plans: [] };
  }
}

async function writeDb(db: Db): Promise<void> {
  await writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  };
}

async function setSession(userId: string) {
  const jar = await cookies();
  jar.set(cookieName, await signSession(userId), cookieOptions());
}

export async function getSessionUser(): Promise<{ id: string; email: string } | null> {
  const jar = await cookies();
  const userId = await readSession(jar.get(cookieName)?.value);
  if (!userId) return null;
  return withDb((db) => {
    const user = db.users.find((item) => item.id === userId);
    return user ? { id: user.id, email: user.email } : null;
  });
}

export async function signUp(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || password.length < 6) {
    throw new Error("Почта и пароль от 6 символов");
  }

  const user = await withDb((db) => {
    if (db.users.some((item) => item.email === normalized)) {
      throw new Error("Такой аккаунт уже есть");
    }
    const { salt, hash } = hashPassword(password);
    const row: UserRow = {
      id: randomUUID(),
      email: normalized,
      passwordHash: hash,
      salt,
    };
    db.users.push(row);
    return row;
  });

  await setSession(user.id);
  return { id: user.id, email: user.email };
}

export async function signIn(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const user = await withDb((db) => {
    const row = db.users.find((item) => item.email === normalized);
    if (!row || !verifyPassword(password, row.salt, row.passwordHash)) {
      throw new Error("Неверная почта или пароль");
    }
    return row;
  });
  await setSession(user.id);
  return { id: user.id, email: user.email };
}

export async function signOut() {
  const jar = await cookies();
  jar.set(cookieName, "", { ...cookieOptions(), maxAge: 0 });
}

export async function getProfile(userId: string): Promise<Profile | null> {
  return withDb((db) => db.profiles.find((item) => item.userId === userId) ?? null);
}

export async function saveProfile(profile: Profile): Promise<void> {
  await withDb((db) => {
    const index = db.profiles.findIndex((item) => item.userId === profile.userId);
    if (index === -1) db.profiles.push(profile);
    else db.profiles[index] = profile;
  });
}

export async function savePlan(userId: string, profile: Profile): Promise<PlanView> {
  const catalog = buildCatalog();
  const picked = pickWeek(profile, catalog);
  const id = randomUUID();

  await withDb((db) => {
    db.plans = db.plans.filter((plan) => plan.userId !== userId);
    db.plans.push({
      id,
      userId,
      shopDate: picked.shopDate,
      recipeIds: picked.recipeIds,
      createdAt: new Date().toISOString(),
    });
  });

  return presentPlan({
    id,
    shopDate: picked.shopDate,
    householdSize: profile.householdSize,
    recipeIds: picked.recipeIds,
    catalog,
  });
}

export async function getLatestPlan(userId: string, householdSize: number): Promise<PlanView | null> {
  const row = await withDb((db) => {
    return db.plans.filter((plan) => plan.userId === userId).at(-1) ?? null;
  });
  if (!row) return null;
  return presentPlan({
    id: row.id,
    shopDate: row.shopDate,
    householdSize,
    recipeIds: row.recipeIds,
    catalog: buildCatalog(),
  });
}
