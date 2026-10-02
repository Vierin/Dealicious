import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/http";
import { isProfileComplete } from "@/lib/profile";
import { getLatestPlan, getProfile, getSessionUser, savePlan } from "@/lib/store";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Нужен аккаунт" }, { status: 401 });
    const profile = await getProfile(user.id);
    if (!isProfileComplete(profile)) {
      return NextResponse.json({ error: "Сначала анкета" }, { status: 400 });
    }
    const plan = await getLatestPlan(user.id, profile.householdSize);
    return NextResponse.json({ plan });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Нужен аккаунт" }, { status: 401 });
    const profile = await getProfile(user.id);
    if (!isProfileComplete(profile)) {
      return NextResponse.json({ error: "Сначала анкета" }, { status: 400 });
    }
    const plan = await savePlan(user.id, profile);
    return NextResponse.json({ plan });
  } catch (error) {
    return errorResponse(error);
  }
}
