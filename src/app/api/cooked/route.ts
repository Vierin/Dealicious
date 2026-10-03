import { NextResponse } from "next/server";
import { errorResponse, readJson } from "@/lib/server-http";
import { getSessionUser, setCooked } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Нужен аккаунт" }, { status: 401 });
    const body = await readJson(request);
    const planId = body.planId;
    const dayIndex = Number(body.dayIndex);
    if (typeof planId !== "string" || planId.length < 1) throw new Error("Нет недели");
    if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) throw new Error("Нет такого дня");
    if (typeof body.cooked !== "boolean") throw new Error("Нет отметки");
    await setCooked(user.id, planId, dayIndex, body.cooked);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
