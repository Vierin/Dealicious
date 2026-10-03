import { NextResponse } from "next/server";
import { errorResponse, readJson } from "@/lib/server-http";
import { getSessionUser, setCooked } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("errors.account");
    const body = await readJson(request);
    const planId = body.planId;
    const dayIndex = Number(body.dayIndex);
    if (typeof planId !== "string" || planId.length < 1) throw new Error("errors.noWeek");
    if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) throw new Error("errors.noSuchDay");
    if (typeof body.cooked !== "boolean") throw new Error("errors.noMark");
    await setCooked(user.id, planId, dayIndex, body.cooked);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
