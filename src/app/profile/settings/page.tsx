import UpdateProfilePanel from "@/components/profile/UpdateProfilePanel";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ProfileSettingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return <UpdateProfilePanel />;
};
export default ProfileSettingPage;