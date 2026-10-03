import { readFileSync } from "fs";
import path from "path";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import type { Response } from "express";

const STATUS: Record<string, number> = {
  account: 401,
  trial: 402,
  email: 401,
  exists: 409,
};

let messages: Record<string, string> | null = null;

function errorText(key: string): string | null {
  if (!messages) {
    const file = path.join(process.cwd(), "messages", "pl.json");
    const parsed = JSON.parse(readFileSync(file, "utf8")) as { errors?: Record<string, string> };
    messages = parsed.errors ?? {};
  }
  return messages[key] ?? null;
}

@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    if (error instanceof HttpException) {
      const body = error.getResponse();
      const message =
        typeof body === "string"
          ? body
          : Array.isArray((body as { message?: unknown }).message)
            ? ((body as { message: string[] }).message).join(", ")
            : String((body as { message?: unknown }).message ?? error.message);
      res.status(error.getStatus()).json({ error: message });
      return;
    }
    const raw = error instanceof Error ? error.message : "errors.generic";
    const key = raw.startsWith("errors.") ? raw.slice("errors.".length) : "";
    const known = key ? errorText(key) : null;
    if (!known) console.error(error);
    res.status((key && STATUS[key]) || 400).json({ error: known ?? raw });
  }
}
