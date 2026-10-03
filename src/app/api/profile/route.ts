import { NextResponse } from "next/server";
import { errorResponse, readJson } from "@/lib/server-http";
import { parseProfile } from "@/lib/profile";
import { getSessionUser, saveProfile } from "@/lib/store";

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("errors.account");
    const profile = parseProfile(user.id, await readJson(request));
    await saveProfile(profile);
    return NextResponse.json({ profile });
  } catch (error) {
    return errorResponse(error);
  }
}
