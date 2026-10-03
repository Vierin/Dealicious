import { AsyncLocalStorage } from "node:async_hooks";
import type { SupabaseClient } from "@supabase/supabase-js";

const storage = new AsyncLocalStorage<SupabaseClient>();

export function runWithSupabase<T>(client: SupabaseClient, fn: () => T): T {
  return storage.run(client, fn);
}

export async function createClient(): Promise<SupabaseClient> {
  const client = storage.getStore();
  if (!client) throw new Error("errors.account");
  return client;
}
