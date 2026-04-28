import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "../ui/button";
import { updateProfileInfoSchema, UpdateProfileInfoSchema } from "@/lib/validation/profile";
import { motion } from "framer-motion";

const UpdateInfoForm = () => {

  const { user, isLoadingUser } = useUserStore();
  const [isPending, setIsPending] = useState(false);

  const defaultValues = {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    username: user?.username ?? "",
  };

  const form = useForm<UpdateProfileInfoSchema>({
    defaultValues,
    resolver: zodResolver(updateProfileInfoSchema),
    mode: "onSubmit"
  });

  const watchedValues = useWatch({ control: form.control });

  const changedValues: Partial<UpdateProfileInfoSchema> = {};
  if (watchedValues.firstName !== defaultValues.firstName) {
    changedValues.firstName = watchedValues.firstName;
  }
  if (watchedValues.lastName !== defaultValues.lastName) {
    changedValues.lastName = watchedValues.lastName;
  }
  if (watchedValues.username !== defaultValues.username) {
    changedValues.username = watchedValues.username;
  }

  const isDirty = Object.keys(changedValues).length > 0;

  const onSubmit = async () => {
    if (!isDirty) return;

    const name =
      (changedValues.firstName ?? defaultValues.firstName ?? "") +
      " " +
      (changedValues.lastName ?? defaultValues.lastName ?? "");

    const payload: Record<string, string> = {};
    payload.name = name;
    if (changedValues.username) payload.username = changedValues.username;

    await updateUser({
      ...payload,
      fetchOptions: {
        onRequest: () => setIsPending(true),
        onResponse: () => {
          setIsPending(false);
          form.reset(watchedValues);
        },
        onError: (ctx) => {
          if (ctx.error.code === "SCHEMA_VALIDATION_FAILED") {
            toast.error(ctx.error.details.issues[0].message);
            return;
          }
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Profile updated successfully");
        },
      },
    });
  };
  if (!user || isLoadingUser) return <div>Loading...</div>;

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="firstName"
        render={({ field, fieldState }) => (
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
              First Name
            </label>
            <input
              {...field}
              type="text"
              className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none"
              style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
            />
            {fieldState.error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1"
                style={{ color: 'var(--brand-coral)' }}
              >
                {fieldState.error.message}
              </motion.p>
            )}
          </div>
        )}
      />
      <Controller
        control={form.control}
        name="lastName"
        render={({ field, fieldState }) => (
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
              Last Name
            </label>
            <input
              {...field}
              type="text"
              className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none"
              style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
            />
            {fieldState.error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1"
                style={{ color: 'var(--brand-coral)' }}
              >
                {fieldState.error.message}
              </motion.p>
            )}
          </div>
        )}
      />
      <Controller
        control={form.control}
        name="username"
        render={({ field, fieldState }) => (
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <input
              {...field}
              type="text"
              className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none"
              style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
            />
            {fieldState.error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-1"
                style={{ color: 'var(--brand-coral)' }}
              >
                {fieldState.error.message}
              </motion.p>
            )}
          </div>
        )}
      />

      <button
        type="submit"
        disabled={!isDirty || isPending}
        className="w-full flex items-center justify-center py-2.5 rounded-[3px] font-medium text-sm cursor-pointer disabled:opacity-50 press-brutal"
        style={{ background: 'var(--brand-mint)', color: 'var(--brand-ink)', border: '2.5px solid var(--brand-ink)', boxShadow: '4px 4px 0 var(--brand-ink)' }}
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default UpdateInfoForm;