import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

const ERROR_KEYS = [
  "generic",
  "emptyBody",
  "account",
  "needProfile",
  "trial",
  "email",
  "exists",
  "notEnoughMeals",
  "overBudget",
  "pickCookDay",
  "cookDays",
  "nothingToSwap",
  "noSuchDay",
  "alreadyInWeek",
  "noMeal",
  "badDays",
  "noWeek",
  "noMark",
  "emptyProfile",
  "name",
  "warsaw",
  "diet",
  "meat",
  "style",
  "people",
  "shopDay",
  "budget",
  "kcal",
  "allergy",
  "appliance",
  "unknownAppliance",
  "score",
  "planSave",
  "ratingsMigration",
  "cookedMigration",
  "missingProduct",
] as const;

type ErrorKey = (typeof ERROR_KEYS)[number];

const STATUS: Partial<Record<ErrorKey, number>> = {
  account: 401,
  trial: 402,
  email: 401,
  exists: 409,
};

function isErrorKey(value: string): value is ErrorKey {
  return (ERROR_KEYS as readonly string[]).includes(value);
}

export async function errorResponse(error: unknown) {
  const raw = error instanceof Error ? error.message : "errors.generic";
  const key = raw.startsWith("errors.") ? raw.slice("errors.".length) : "";
  const t = await getTranslations("errors");
  const known = isErrorKey(key);
  const message = known ? t(key) : raw;
  return NextResponse.json({ error: message }, { status: (known && STATUS[key]) || 400 });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") throw new Error("errors.emptyBody");
  return body as Record<string, unknown>;
}
