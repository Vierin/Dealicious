import { NextResponse } from "next/server";
import { errorResponse, readJson } from "@/lib/http";
import { getSessionUser, setRating } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Нужен аккаунт" }, { status: 401 });
    const body = await readJson(request);
    const recipeId = body.recipeId;
    const score = Number(body.score);
    if (typeof recipeId !== "string" || recipeId.length < 1) throw new Error("Нет блюда");
    if (!Number.isInteger(score) || score < 1 || score > 5) throw new Error("Оценка от 1 до 5");
    await setRating(user.id, recipeId, score);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
