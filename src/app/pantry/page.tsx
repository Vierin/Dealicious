import { redirect } from "next/navigation";
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

  return (
    <Page>
      <BackLink href="/week" label="Неделя" />
      <h1 className="mt-3 font-serif text-4xl">Кладовая</h1>
      <p className="mt-2 text-muted">Сколько уже есть дома. Список покупок это учитывает.</p>
      <PantryEditor />
    </Page>
  );
}
