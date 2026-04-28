"use client";

import { useUserStore } from "@/store/useUserStore";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import SignOutButton from "../auth/SignOutButton";

const ProfileInfo = () => {
  const user = useUserStore((state) => state.user);
  const isLoadingUser = useUserStore((state) => state.isLoadingUser);
  const router = useRouter();
  if (isLoadingUser || !user) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border-2 border-[#a089df]/30 shadow-lg">
          <AvatarImage src={user.image ?? undefined} />
        </Avatar>
        <div>
          <h1 className="font-semibold text-xl text-[#c5b5f0]">{user.firstName} {user.lastName}</h1>
          <span className="text-white/60 text-sm">{user.email}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-white/60">First name</span>
          <span className="text-[#c5b5f0]">{user.firstName}</span>
          <span className="font-semibold text-white/60">Last name</span>
          <span className="text-[#c5b5f0]">{user.lastName}</span>
                    <span className="font-semibold text-white/60">Username</span>
          <span className="text-[#c5b5f0]">{user.username}</span>
        </div>
      </div>
      <SignOutButton />
      <Button 
        onClick={() => router.push("/profile/settings")}
        className="bg-[#a089df] hover:bg-[#a089df]/90 text-white"
      >
        Update Profile
      </Button>
    </div>
  );
};
export default ProfileInfo;