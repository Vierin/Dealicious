import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/store";
import { OnboardingForm } from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return <OnboardingForm />;
}
