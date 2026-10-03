import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { leafletsOn, shopDeals } from "../../src/lib/catalog";
import { acceptWeek, cookBrief, recipeIdsFromModel } from "../../src/lib/cook-smarter";
import { askJson } from "../../src/lib/openai";
import { isProfileComplete, parseProfile } from "../../src/lib/profile";
import {
  getCatalog,
  getCookedDays,
  getLatestPlan,
  getProfile,
  getRatings,
  getSessionUser,
  replaceMeal,
  savePlan,
  saveProfile,
  setCooked,
  setRating,
  setWeekMenu,
} from "../../src/lib/store/supabase-repo";
import { getTrial } from "../../src/lib/store/trial";

@Controller()
export class DealiciousController {
  @Get("health")
  health() {
    return { ok: true };
  }

  @Get("session")
  async session() {
    return { user: await getSessionUser() };
  }

  @Get("profile")
  async profile() {
    const user = await requiredUser();
    return { profile: await getProfile(user.id) };
  }

  @Put("profile")
  async save(@Body() body: unknown) {
    const user = await requiredUser();
    const profile = parseProfile(user.id, body);
    await saveProfile(profile);
    return { profile };
  }

  @Get("catalog")
  async catalog() {
    await requiredUser();
    return getCatalog();
  }

  @Get("plan")
  async plan() {
    const user = await requiredUser();
    const profile = await requiredProfile(user.id);
    return { plan: await getLatestPlan(user.id, profile.householdSize) };
  }

  @Post("plan")
  async rebuild(@Body() body: unknown) {
    const user = await requiredUser();
    const profile = await requiredProfile(user.id);
    return { plan: await savePlan(user.id, profile, keepFrom(body)) };
  }

  @Post("plan/swap")
  async swap(@Body() body: unknown) {
    const user = await requiredUser();
    const profile = await requiredProfile(user.id);
    const record = recordOf(body);
    const recipeId = record.recipeId;
    if (typeof recipeId !== "string" || recipeId.length < 1) throw new Error("errors.noMeal");
    const dayIndex = record.dayIndex == null ? undefined : Number(record.dayIndex);
    if (dayIndex != null && !Number.isInteger(dayIndex)) throw new Error("errors.noSuchDay");
    return { plan: await replaceMeal(user.id, profile, recipeId, dayIndex) };
  }

  @Post("plan/cook")
  async cook() {
    const user = await requiredUser();
    const profile = await requiredProfile(user.id);
    const current = await getLatestPlan(user.id, profile.householdSize);
    if (!current) throw new Error("errors.noWeek");
    const catalog = await getCatalog();
    const cooked = await getCookedDays(user.id, current.id);
    const recipeIds = Array.from({ length: 7 }, () => "");
    for (const meal of current.meals) recipeIds[meal.dayIndex] = meal.recipeId;
    const brief = cookBrief({
      profile,
      catalog,
      shopDate: current.shopDate,
      recipeIds,
      lockedDays: cooked,
    });
    const proposed = recipeIdsFromModel(await askJson(brief.system, brief.user));
    const next = acceptWeek({
      profile,
      catalog,
      shopDate: current.shopDate,
      currentIds: recipeIds,
      proposedIds: proposed,
      lockedDays: cooked,
    });
    return { plan: await setWeekMenu(user.id, profile, next) };
  }

  @Get("trial")
  async trial() {
    const user = await requiredUser();
    const profile = await requiredProfile(user.id);
    return getTrial(user.id, profile.householdSize);
  }

  @Get("ratings")
  async ratings() {
    const user = await requiredUser();
    return getRatings(user.id);
  }

  @Post("ratings")
  async rate(@Body() body: unknown) {
    const user = await requiredUser();
    const record = recordOf(body);
    const recipeId = record.recipeId;
    const score = Number(record.score);
    if (typeof recipeId !== "string" || recipeId.length < 1) throw new Error("errors.noMeal");
    if (!Number.isInteger(score) || score < 1 || score > 5) throw new Error("errors.score");
    await setRating(user.id, recipeId, score);
    return { ok: true };
  }

  @Get("cooked")
  async cooked(@Query("planId") planId: string) {
    const user = await requiredUser();
    if (!planId) throw new Error("errors.noWeek");
    return { days: await getCookedDays(user.id, planId) };
  }

  @Post("cooked")
  async markCooked(@Body() body: unknown) {
    const user = await requiredUser();
    const record = recordOf(body);
    const planId = record.planId;
    const dayIndex = Number(record.dayIndex);
    if (typeof planId !== "string" || planId.length < 1) throw new Error("errors.noWeek");
    if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) throw new Error("errors.noSuchDay");
    if (typeof record.cooked !== "boolean") throw new Error("errors.noMark");
    await setCooked(user.id, planId, dayIndex, record.cooked);
    return { ok: true };
  }

  @Get("offers")
  async offers(@Query("date") date: string) {
    await requiredUser();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) throw new Error("errors.badDays");
    return { deals: shopDeals(date), leaflets: leafletsOn(date) };
  }
}

async function requiredUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("errors.account");
  return user;
}

async function requiredProfile(userId: string) {
  const profile = await getProfile(userId);
  if (!isProfileComplete(profile)) throw new Error("errors.needProfile");
  return profile;
}

function recordOf(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("errors.emptyBody");
  return body as Record<string, unknown>;
}

function keepFrom(body: unknown): number[] | undefined {
  if (!body || typeof body !== "object" || Array.isArray(body)) return undefined;
  const keep = (body as { keep?: unknown }).keep;
  if (keep == null) return undefined;
  if (!Array.isArray(keep) || keep.some((day) => !Number.isInteger(day) || day < 0 || day > 6)) {
    throw new Error("errors.badDays");
  }
  return keep as number[];
}
