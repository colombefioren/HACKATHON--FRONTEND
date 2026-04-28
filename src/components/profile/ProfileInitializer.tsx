"use client";

import { useSession } from "@/lib/auth/auth-client";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  username?: string | null;
  displayUsername?: string | null;
}

const ProfileInitializer = () => {
  const { data: session, isPending } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const setIsLoadingUser = useUserStore((state) => state.setLoadingUser);

  useEffect(() => {
    setIsLoadingUser(isPending);

    if (!session?.user) return;

    const user = session.user as SessionUser;
    
    setUser({
      id: user.id,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ")[1],
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      username: user.username,
      displayUsername: user.displayUsername,
    });
  }, [session?.user, isPending, setUser, setIsLoadingUser]);

  return null;
};

export default ProfileInitializer;