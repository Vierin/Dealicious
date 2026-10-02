import { NextResponse } from "next/server";

export function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Ошибка";
  const status = message.includes("Неверная почта") ? 401 : message.includes("уже есть") ? 409 : 400;
  return NextResponse.json({ error: message }, { status });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") throw new Error("Пустой запрос");
  return body as Record<string, unknown>;
}
