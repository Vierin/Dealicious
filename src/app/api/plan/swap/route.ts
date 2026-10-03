import { NextResponse } from "next/server";
import { errorResponse, readJson } from "@/lib/server-http";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser, replaceMeal } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("errors.account");
    const profile = await getProfile(user.id);
    if (!isProfileComplete(profile)) throw new Error("errors.needProfile");
    const body = await readJson(request);
    const recipeId = body.recipeId;
    if (typeof recipeId !== "string" || recipeId.length < 1) throw new Error("errors.noMeal");
    const dayIndex = body.dayIndex == null ? undefined : Number(body.dayIndex);
    if (dayIndex != null && !Number.isInteger(dayIndex)) throw new Error("errors.noSuchDay");
    const plan = await replaceMeal(user.id, profile, recipeId, dayIndex);
    return NextResponse.json({ plan });
  } catch (error) {
    return errorResponse(error);
  }
}
