"use client";
import { useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateUser } from "@/lib/auth/auth-client";
import { SiCachet } from "react-icons/si";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { getImageUrlAction } from "@/app/actions/get-image-url.action";
import { removeImageUrlAction } from "@/app/actions/remove-image-url.action";
import { getFallbackAvatarUrlAction } from "@/app/actions/get-fallback-avatar-url.action";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/Topbar";
import UpdateInfoForm from "./UpdateInfoForm";

const UpdateProfilePanel = () => {
  const { user, isLoadingUser } = useUserStore();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  if (isLoadingUser || !user) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    try {
      setIsPending(true);
      const result = await getImageUrlAction(file);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const imageUrl = result.url;
      await updateUser({
        image: imageUrl,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success("Profile updated successfully");
          },
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const handlePicDeletion = async () => {
    try {
      setIsPending(true);

      const result = await removeImageUrlAction();

      if (result.success) {
        const fallbackUrl = getFallbackAvatarUrlAction(
          user.firstName,
          user.lastName
        );

        await updateUser({
          image: fallbackUrl,
          fetchOptions: {
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
            onSuccess: () => {
              toast.success(result.success);
            },
          },
        });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error("handlePicDeletion failed:", err);
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="px-4 sm:px-7 py-6 max-w-3xl mx-auto">
        <div
          className="bg-card rounded-lg p-6 mb-6"
          style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '5px 5px 0 var(--brand-ink)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium text-foreground">Account Settings</h1>
            <button
              onClick={() => router.push("/profile")}
              className="text-xs font-medium px-3 py-1.5 rounded-[3px] press-brutal"
              style={{ border: '1.5px solid var(--brand-ink)', background: 'white', color: 'var(--brand-ink)' }}
            >
              ← Back to profile
            </button>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <Avatar
                className="w-28 h-28 mb-4"
                style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '4px 4px 0 var(--brand-ink)' }}
              >
                <AvatarImage src={user.image ?? undefined} />
              </Avatar>
              <div
                onClick={() => inputRef.current?.click()}
                className={cn(
                  !isPending && "group-hover:opacity-100 cursor-pointer",
                  "absolute w-28 h-28 top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-black/40 rounded-full opacity-0 transition-opacity"
                )}
              >
                <SiCachet className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                disabled={isPending}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-[3px] press-brutal disabled:opacity-50"
                style={{ background: 'var(--brand-sky)', border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)', color: 'var(--brand-ink)' }}
              >
                <span>Change Avatar</span>
                <Input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </button>

              <button
                onClick={handlePicDeletion}
                disabled={isPending}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-[3px] press-brutal disabled:opacity-50"
                style={{ background: 'var(--brand-coral)', border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)', color: 'var(--brand-ink)' }}
              >
                <span>Remove Avatar</span>
              </button>
            </div>
          </div>

          {/* Update Info Form */}
          <UpdateInfoForm />
        </div>
      </main>
    </div>
  );
};

export default UpdateProfilePanel;