import { cookies } from "next/headers";
import type { RecipeRatings } from "../score";
import type { Catalog, PlanView, Profile } from "../types";
import type { TrialView } from "./trial";

type Offers = {
  deals: {
    id: string;
    namePl: string;
    pack: string;
    regularPricePln: number | null;
    promoPricePln: number;
    approx: boolean;
  }[];
  leaflets: { id: string; name: string; validFrom: string; validTo: string }[];
};

export type { TrialView };

type SessionUser = { id: string; email: string };

function apiBase(): string {
  return process.env.API_URL ?? "http://127.0.0.1:4000";
}

async function api<T>(path: string): Promise<T> {
  const jar = await cookies();
  const cookie = jar
    .getAll()
    .map((item) => `${item.name}=${encodeURIComponent(item.value)}`)
    .join("; ");
  const response = await fetch(`${apiBase()}${path}`, {
    headers: cookie ? { cookie } : {},
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Błąd");
  return data;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const data = await api<{ user: SessionUser | null }>("/api/session");
  return data.user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  void userId;
  const data = await api<{ profile: Profile | null }>("/api/profile");
  return data.profile;
}

export async function getCatalog(): Promise<Catalog> {
  return api<Catalog>("/api/catalog");
}

export async function getLatestPlan(userId: string, householdSize: number): Promise<PlanView | null> {
  void userId;
  void householdSize;
  const data = await api<{ plan: PlanView | null }>("/api/plan");
  return data.plan;
}

export async function getTrial(userId: string, householdSize: number): Promise<TrialView> {
  void userId;
  void householdSize;
  return api<TrialView>("/api/trial");
}

export async function getRatings(userId: string): Promise<RecipeRatings> {
  void userId;
  return api<RecipeRatings>("/api/ratings");
}

export async function getCookedDays(userId: string, planId: string): Promise<number[]> {
  void userId;
  const data = await api<{ days: number[] }>(`/api/cooked?planId=${encodeURIComponent(planId)}`);
  return data.days;
}

export async function getOffers(shopDate: string): Promise<Offers> {
  return api<Offers>(`/api/offers?date=${encodeURIComponent(shopDate)}`);
}
