import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/server-http";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Нужен аккаунт" }, { status: 401 });
    const profile = await getProfile(user.id);
    return NextResponse.json({
      user,
      profile,
      profileComplete: isProfileComplete(profile),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
