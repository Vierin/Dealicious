import type { PlanView, Profile } from "../types";
import * as local from "./local";
import * as remote from "./supabase-repo";

export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

type SessionUser = { id: string; email: string };

export async function getSessionUser(): Promise<SessionUser | null> {
  return supabaseConfigured() ? remote.getSessionUser() : local.getSessionUser();
}

export async function signUp(email: string, password: string): Promise<SessionUser> {
  return supabaseConfigured() ? remote.signUp(email, password) : local.signUp(email, password);
}

export async function signIn(email: string, password: string): Promise<SessionUser> {
  return supabaseConfigured() ? remote.signIn(email, password) : local.signIn(email, password);
}

export async function signOut(): Promise<void> {
  return supabaseConfigured() ? remote.signOut() : local.signOut();
}

export async function getProfile(userId: string): Promise<Profile | null> {
  return supabaseConfigured() ? remote.getProfile(userId) : local.getProfile(userId);
}

export async function saveProfile(profile: Profile): Promise<void> {
  return supabaseConfigured() ? remote.saveProfile(profile) : local.saveProfile(profile);
}

export async function savePlan(userId: string, profile: Profile): Promise<PlanView> {
  return supabaseConfigured() ? remote.savePlan(userId, profile) : local.savePlan(userId, profile);
}

export async function getLatestPlan(userId: string, householdSize: number): Promise<PlanView | null> {
  return supabaseConfigured()
    ? remote.getLatestPlan(userId, householdSize)
    : local.getLatestPlan(userId, householdSize);
}
