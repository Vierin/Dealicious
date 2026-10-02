import { redirect } from "next/navigation";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    const profile = await getProfile(user.id);
    redirect(isProfileComplete(profile) ? "/week" : "/onboarding");
  }
  return <LoginForm />;
}
