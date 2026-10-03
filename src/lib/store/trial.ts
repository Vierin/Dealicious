import { trialDaysLeft, trialEndsAt, trialLedger, trialOpen, type TrialWeek } from "../billing";
import { listPlans } from "./supabase-repo";

export type TrialView = {
  startedAt: string;
  endsAt: string;
  open: boolean;
  daysLeft: number;
  weeks: TrialWeek[];
  saved: number;
};

export async function getTrial(userId: string, householdSize: number): Promise<TrialView> {
  const weeks = await listPlans(userId, householdSize);
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
