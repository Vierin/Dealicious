import { NextResponse } from "next/server";
import { errorResponse, readJson } from "@/lib/server-http";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser, replaceMeal } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Нужен аккаунт" }, { status: 401 });
    const profile = await getProfile(user.id);
    if (!isProfileComplete(profile)) {
      return NextResponse.json({ error: "Сначала анкета" }, { status: 400 });
    }
    const body = await readJson(request);
    const recipeId = body.recipeId;
    if (typeof recipeId !== "string" || recipeId.length < 1) throw new Error("Нет блюда");
    const dayIndex = body.dayIndex == null ? undefined : Number(body.dayIndex);
    if (dayIndex != null && !Number.isInteger(dayIndex)) throw new Error("Нет такого дня");
    const plan = await replaceMeal(user.id, profile, recipeId, dayIndex);
    return NextResponse.json({ plan });
  } catch (error) {
    return errorResponse(error);
  }
}
