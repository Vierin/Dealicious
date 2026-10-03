import { Injectable, type NestMiddleware } from "@nestjs/common";
import { createServerClient } from "@supabase/ssr";
import type { NextFunction, Request, Response } from "express";
import { runWithSupabase } from "../../src/lib/supabase/request";
import { parseCookieHeader, serializeCookie } from "./cookies";

@Injectable()
export class SupabaseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase не настроен");
    const client = createServerClient(url, key, {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie);
        },
        setAll(cookies) {
          for (const cookie of cookies) {
            res.append("Set-Cookie", serializeCookie(cookie.name, cookie.value, cookie.options));
          }
        },
      },
    });
    runWithSupabase(client, () => next());
  }
}
