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
import UpdateInfoForm from "./UpdateInfoForm";

const UpdateProfilePanel = () => {
  const { user, isLoadingUser } = useUserStore();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();


  const inputRef = useRef<HTMLInputElement>(null);

  if (isLoadingUser || !user) return <div>Loading...</div>;

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
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
          Account Settings
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Manage your profile and account preferences
        </p>
        <Button onClick={()=>router.push("/profile")}>Return to profile</Button>

        <div className="flex flex-col items-center mb-8">
          <div className="relative group bg-lime- h-28">
            <Avatar className="w-28 h-28 mb-4 border-4 border-white shadow-lg">
              <AvatarImage src={user.image ?? undefined} />
            </Avatar>
            <div
              onClick={() => inputRef.current?.click()}
              className={cn(
                !isPending && "group-hover:opacity-100 cursor-pointer",
                "absolute w-26 h-26 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-black/40 rounded-full opacity-0  transition-opacity"
              )}
            >
              <SiCachet className="w-6 h-6 text-white" />
            </div>
          </div>

          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="flex mt-3 items-center justify-center px-4 py-2 rounded-md bg-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <span>Change Avatar</span>
            <Input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </Button>

          <Button
            onClick={handlePicDeletion}
            disabled={isPending}
            className="flex mt-3 items-center justify-center px-4 py-2 rounded-md bg-blue-500 to-cyan-500 text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <span>Remove Avatar</span>
          </Button>
        </div>

        <UpdateInfoForm />
      </div>
    </div>
  );
};

export default UpdateProfilePanel;