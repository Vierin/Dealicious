import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) {
    const profile = await getProfile(user.id);
    redirect(isProfileComplete(profile) ? "/week" : "/onboarding");
  }
  return <AuthForm mode="signup" />;
}
