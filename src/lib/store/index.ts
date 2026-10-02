import { trialDaysLeft, trialEndsAt, trialLedger, trialOpen, type TrialWeek } from "../billing";
import type { PlanView, Profile } from "../types";
import * as local from "./local";
import * as remote from "./supabase-repo";
import { readTrial, startTrial } from "./trial";

export type TrialView = {
  startedAt: string;
  endsAt: string;
  open: boolean;
  daysLeft: number;
  weeks: TrialWeek[];
  saved: number;
};

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

export async function savePlan(userId: string, profile: Profile, keep?: number[]): Promise<PlanView> {
  return supabaseConfigured() ? remote.savePlan(userId, profile, keep) : local.savePlan(userId, profile, keep);
}

export async function replaceMeal(
  userId: string,
  profile: Profile,
  recipeId: string,
  dayIndex?: number,
): Promise<PlanView> {
  return supabaseConfigured()
    ? remote.replaceMeal(userId, profile, recipeId, dayIndex)
    : local.replaceMeal(userId, profile, recipeId, dayIndex);
}

export async function getLatestPlan(userId: string, householdSize: number): Promise<PlanView | null> {
  return supabaseConfigured()
    ? remote.getLatestPlan(userId, householdSize)
    : local.getLatestPlan(userId, householdSize);
}

export async function getTrial(userId: string, householdSize: number): Promise<TrialView> {
  const weeks = supabaseConfigured()
    ? await remote.listPlans(userId, householdSize)
    : await local.listPlans(userId, householdSize);
  const oldest = [...weeks].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0]?.createdAt;
  const startedAt = (await readTrial(userId)) ?? (await startTrial(userId, oldest ?? new Date().toISOString()));
  const ledger = trialLedger(weeks, startedAt);
  const saved = Math.round(ledger.reduce((sum, week) => sum + week.saved, 0) * 100) / 100;
  return {
    startedAt,
    endsAt: trialEndsAt(startedAt).toISOString(),
    open: trialOpen(startedAt),
    daysLeft: trialDaysLeft(startedAt),
    weeks: ledger,
    saved,
  };
}
