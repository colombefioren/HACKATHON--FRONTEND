"use client";

import { useUserStore } from "@/store/useUserStore";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import SignOutButton from "../auth/SignOutButton";
import { Topbar } from "@/components/Topbar";

const ProfileInfo = () => {
  const user = useUserStore((state) => state.user);
  const isLoadingUser = useUserStore((state) => state.isLoadingUser);
  const router = useRouter();
  if (isLoadingUser || !user) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="px-4 sm:px-7 py-6 max-w-3xl mx-auto">
        <div
          className="bg-card rounded-lg p-6 mb-6"
          style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '5px 5px 0 var(--brand-ink)' }}
        >
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20" style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}>
              <AvatarImage src={user.image ?? undefined} />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl text-foreground">{user.firstName} {user.lastName}</h1>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-[3px] bg-background" style={{ border: '1.5px solid var(--brand-ink)' }}>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">First name</span>
              <p className="text-sm font-medium text-foreground mt-1">{user.firstName}</p>
            </div>
            <div className="p-3 rounded-[3px] bg-background" style={{ border: '1.5px solid var(--brand-ink)' }}>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Last name</span>
              <p className="text-sm font-medium text-foreground mt-1">{user.lastName}</p>
            </div>
            <div className="p-3 rounded-[3px] bg-background col-span-2" style={{ border: '1.5px solid var(--brand-ink)' }}>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Username</span>
              <p className="text-sm font-medium text-foreground mt-1">{user.username}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/profile/settings")}
              className="press-brutal"
              style={{ background: 'var(--brand-mustard)', color: 'var(--brand-ink)', border: '2.5px solid var(--brand-ink)', boxShadow: '4px 4px 0 var(--brand-ink)' }}
            >
              Update Profile
            </Button>
            <SignOutButton />
          </div>
        </div>
      </main>
    </div>
  );
};
export default ProfileInfo;