import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";
import { Page } from "@/components/page";
import { PantryEditor } from "./pantry-editor";

export const dynamic = "force-dynamic";

export default async function PantryPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  const t = await getTranslations("pantry");

  return (
    <Page>
      <BackLink href="/week" />
      <h1 className="mt-3 font-serif text-4xl">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("hint")}</p>
      <PantryEditor />
    </Page>
  );
}
