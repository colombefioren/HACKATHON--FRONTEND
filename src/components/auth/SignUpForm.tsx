'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RegisterSchema, registerSchema } from "@/lib/validation/auth";
import { signUp } from "@/lib/auth/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getFallbackAvatarUrlAction } from "@/app/actions/get-fallback-avatar-url.action";

interface SignUpFormProps {
  onSuccess?: () => void;
}

export const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const submitRegisterData = async (data: RegisterSchema) => {
    setIsPending(true);

    try {
      await signUp.email({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        image: getFallbackAvatarUrlAction(data.firstName, data.lastName),
        password: data.password,
        username: data.username,
        fetchOptions: {
          onRequest: () => {
            setIsPending(true);
          },
          onResponse: () => {
            setIsPending(false);
            form.reset();
          },
          onError: (ctx) => {
            if (ctx.error.code === "SCHEMA_VALIDATION_FAILED") {
              toast.error(ctx.error.details.issues[0].message);
              return;
            }
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success("Account created successfully");

              router.push("/profile");
          },
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submitRegisterData)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...form.register("firstName")}
            disabled={isPending}
            className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none placeholder:text-muted-foreground"
            style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
            placeholder="John"
          />
          {form.formState.errors.firstName && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs mt-1"
              style={{ color: 'var(--brand-coral)' }}
            >
              {form.formState.errors.firstName.message}
            </motion.p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...form.register("lastName")}
            disabled={isPending}
            className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none placeholder:text-muted-foreground"
            style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
            placeholder="Doe"
          />
          {form.formState.errors.lastName && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs mt-1"
              style={{ color: 'var(--brand-coral)' }}
            >
              {form.formState.errors.lastName.message}
            </motion.p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="username" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
          Username
        </label>
        <input
          id="username"
          type="text"
          {...form.register("username")}
          disabled={isPending}
          className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none placeholder:text-muted-foreground"
          style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
          placeholder="john_doe123"
        />
        {form.formState.errors.username && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs mt-1"
            style={{ color: 'var(--brand-coral)' }}
          >
            {form.formState.errors.username.message}
          </motion.p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...form.register("email")}
          disabled={isPending}
          className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none placeholder:text-muted-foreground"
          style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
          placeholder="you@example.com"
        />
        {form.formState.errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs mt-1"
            style={{ color: 'var(--brand-coral)' }}
          >
            {form.formState.errors.email.message}
          </motion.p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...form.register("password")}
          disabled={isPending}
          className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none placeholder:text-muted-foreground"
          style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
          placeholder="Min. 6 characters"
        />
        {form.formState.errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs mt-1"
            style={{ color: 'var(--brand-coral)' }}
          >
            {form.formState.errors.password.message}
          </motion.p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center py-2.5 rounded-[3px] font-medium text-sm cursor-pointer disabled:opacity-50 press-brutal"
        style={{ background: 'var(--brand-mustard)', color: 'var(--brand-ink)', border: '2.5px solid var(--brand-ink)', boxShadow: '4px 4px 0 var(--brand-ink)' }}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Create account'
        )}
      </button>
    </form>
  );
};