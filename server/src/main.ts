import { existsSync, readFileSync } from "fs";
import path from "path";
import WebSocket from "ws";

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket;
}

function repoRoot(): string {
  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "data", "promos.json"))) return cwd;
  return path.resolve(cwd, "..");
}

function loadEnv(dir: string) {
  const file = path.join(dir, ".env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function bootstrap() {
  const root = repoRoot();
  process.chdir(root);
  loadEnv(root);
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase не настроен");
  }

  const { NestFactory } = await import("@nestjs/core");
  const { AppModule } = await import("./app.module");
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, process.env.HOST ?? "127.0.0.1");
}

bootstrap();
