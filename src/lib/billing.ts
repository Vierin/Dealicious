import { money } from "./money";

export const TRIAL_DAYS = 14;
export const SUBSCRIPTION_PLN = 15;

export type TrialLine = {
  namePl: string;
  saved: number;
};

export type TrialWeek = {
  shopDate: string;
  createdAt: string;
  saved: number;
  lines: TrialLine[];
};

export function trialEndsAt(startedAt: string): Date {
  return new Date(new Date(startedAt).getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}

export function trialOpen(startedAt: string, now = new Date()): boolean {
  return now.getTime() < trialEndsAt(startedAt).getTime();
}

export function trialDaysLeft(startedAt: string, now = new Date()): number {
  const ms = trialEndsAt(startedAt).getTime() - now.getTime();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

export function savingLines(
  lines: { namePl: string; onPromo: boolean; regularLineTotal: number; lineTotal: number }[],
): TrialLine[] {
  return lines
    .filter((line) => line.onPromo && line.regularLineTotal > line.lineTotal)
    .map((line) => ({ namePl: line.namePl, saved: money(line.regularLineTotal - line.lineTotal) }))
    .sort((a, b) => b.saved - a.saved);
}

export function trialLedger(weeks: TrialWeek[], startedAt: string): TrialWeek[] {
  const start = new Date(startedAt).getTime();
  const end = trialEndsAt(startedAt).getTime();
  const byShop = new Map<string, TrialWeek>();
  const inWindow = weeks
    .filter((week) => {
      const at = new Date(week.createdAt).getTime();
      return at >= start && at < end;
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  for (const week of inWindow) byShop.set(week.shopDate, week);
  return [...byShop.values()].sort((a, b) => a.shopDate.localeCompare(b.shopDate));
}
