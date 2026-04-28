'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type EmailLoginSchema, emailLoginSchema } from "@/lib/validation/auth";
import { signIn } from "@/lib/auth/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SignInFormProps {
  onSuccess?: () => void;
}

export const SignInForm = ({ onSuccess }: SignInFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<EmailLoginSchema>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const handleSuccess = () => {
    router.push('/profile');
  };

  const submitLoginData = async (data: EmailLoginSchema) => {
    setIsPending(true);

    try {
      await signIn.email({
        email: data.email,
        password: data.password,
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
            toast.success("Signed in successfully");
              handleSuccess();
          },
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submitLoginData)} className="space-y-4">
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
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-xs font-medium text-foreground uppercase tracking-wider">
            Password
          </label>
          <button
            type="button"
            className="text-xs cursor-pointer hover:underline"
            style={{ color: 'var(--brand-ink)' }}
            onClick={() => router.push('/forgot-password')}
          >
            Forgot?
          </button>
        </div>
        <input
          id="password"
          type="password"
          {...form.register("password")}
          disabled={isPending}
          className="w-full rounded-[3px] px-3 py-2.5 text-sm bg-white outline-none placeholder:text-muted-foreground"
          style={{ border: '2.5px solid var(--brand-ink)', boxShadow: '3px 3px 0 var(--brand-ink)' }}
          placeholder="••••••••"
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
        style={{ background: 'var(--brand-coral)', color: 'var(--brand-ink)', border: '2.5px solid var(--brand-ink)', boxShadow: '4px 4px 0 var(--brand-ink)' }}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
};