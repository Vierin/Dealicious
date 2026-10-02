import { redirect } from "next/navigation";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  return <ProfileForm profile={profile} email={user.email} />;
}
