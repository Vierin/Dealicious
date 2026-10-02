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

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Нужен аккаунт" }, { status: 401 });
    const profile = await getProfile(user.id);
    if (!isProfileComplete(profile)) {
      return NextResponse.json({ error: "Сначала анкета" }, { status: 400 });
    }
    const plan = await savePlan(user.id, profile, await readKeep(request));
    return NextResponse.json({ plan });
  } catch (error) {
    return errorResponse(error);
  }
}

async function readKeep(request: Request): Promise<number[] | undefined> {
  const text = await request.text();
  if (!text.trim()) return undefined;
  const body = JSON.parse(text) as { keep?: unknown };
  if (body.keep == null) return undefined;
  if (!Array.isArray(body.keep) || body.keep.some((day) => !Number.isInteger(day) || day < 0 || day > 6)) {
    throw new Error("Не те дни");
  }
  return body.keep;
}
