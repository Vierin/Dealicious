import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Refrigerator } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { buildCatalog, INGREDIENTS, PANTRY } from "@/lib/catalog";
import { pantryNeeds } from "@/lib/pantry";
import { packQuote } from "@/lib/planner";
import { isProfileComplete } from "@/lib/profile";
import { getLatestPlan, getProfile, getSessionUser } from "@/lib/store";
import type { BasketLine } from "@/lib/types";
import { PantryStock } from "./pantry-stock";
import { Page } from "@/components/page";
import { ShoppingList } from "./shopping-list";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const plan = await getLatestPlan(user.id, profile.householdSize);
  if (!plan) redirect("/week");

  const groups: { category: string; lines: BasketLine[] }[] = [];
  for (const line of plan.lines) {
    const group = groups.find((item) => item.category === line.category);
    if (group) group.lines.push(line);
    else groups.push({ category: line.category, lines: [line] });
  }

  const t = await getTranslations("shop");

  return (
    <Page>
      <div className="flex items-center justify-between gap-4">
        <BackLink href="/week" />
        <Link href="/pantry" className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-sm">
          <Refrigerator size={16} strokeWidth={1.75} />
          {t("pantry")}
        </Link>
      </div>
      <h1 className="mt-3 font-serif text-4xl">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("forPeople", { count: profile.householdSize })}</p>
      <ShoppingList planId={plan.id} groups={groups} />
      <PantryStock planId={plan.id} needs={needsFor(plan.meals.map((meal) => meal.recipeId), profile.householdSize, plan.shopDate)} />
    </Page>
  );
}

function needsFor(recipeIds: string[], householdSize: number, shopDate: string) {
  const catalog = buildCatalog();
  return pantryNeeds(recipeIds, householdSize, INGREDIENTS, PANTRY, {
    oliwa: packQuote("oliwa", catalog, shopDate),
    maslo: packQuote("maslo", catalog, shopDate),
  });
}
