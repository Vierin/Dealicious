import { trialDaysLeft, trialEndsAt, trialLedger, trialOpen, type TrialWeek } from "../billing";
import type { RecipeRatings } from "../score";
import type { PlanView, Profile } from "../types";
import * as remote from "./supabase-repo";

export type TrialView = {
  startedAt: string;
  endsAt: string;
  open: boolean;
  daysLeft: number;
  weeks: TrialWeek[];
  saved: number;
};

type SessionUser = { id: string; email: string };

export async function getSessionUser(): Promise<SessionUser | null> {
  return remote.getSessionUser();
}

export async function getProfile(userId: string): Promise<Profile | null> {
  return remote.getProfile(userId);
}

export async function saveProfile(profile: Profile): Promise<void> {
  return remote.saveProfile(profile);
}

export async function savePlan(userId: string, profile: Profile, keep?: number[]): Promise<PlanView> {
  return remote.savePlan(userId, profile, keep);
}

export async function replaceMeal(
  userId: string,
  profile: Profile,
  recipeId: string,
  dayIndex?: number,
): Promise<PlanView> {
  return remote.replaceMeal(userId, profile, recipeId, dayIndex);
}

export async function getRatings(userId: string): Promise<RecipeRatings> {
  return remote.getRatings(userId);
}

export async function setRating(userId: string, recipeId: string, score: number): Promise<void> {
  return remote.setRating(userId, recipeId, score);
}

export async function getCookedDays(userId: string, planId: string): Promise<number[]> {
  return remote.getCookedDays(userId, planId);
}

export async function setCooked(userId: string, planId: string, dayIndex: number, cooked: boolean): Promise<void> {
  return remote.setCooked(userId, planId, dayIndex, cooked);
}

export async function getLatestPlan(userId: string, householdSize: number): Promise<PlanView | null> {
  return remote.getLatestPlan(userId, householdSize);
}

export async function getTrial(userId: string, householdSize: number): Promise<TrialView> {
  const weeks = await remote.listPlans(userId, householdSize);
  const startedAt = [...weeks].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0]?.createdAt ?? new Date().toISOString();
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
