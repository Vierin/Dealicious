import { NextResponse } from "next/server";
import { errorResponse, readJson } from "@/lib/http";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, signIn } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const user = await signIn(email, password);
    const profile = await getProfile(user.id);
    return NextResponse.json({ user, profileComplete: isProfileComplete(profile) });
  } catch (error) {
    return errorResponse(error);
  }
}
