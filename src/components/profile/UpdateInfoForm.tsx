import { useForm, useWatch, Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "../ui/button";
import { updateProfileInfoSchema, UpdateProfileInfoSchema } from "@/lib/validation/profile";


const UpdateInfoForm = () => {

  const { user, isLoadingUser } = useUserStore();
  const [isPending, setIsPending] = useState(false);

  const defaultValues = {
    firstName: user?.firstName ?? undefined,
    lastName: user?.lastName ?? undefined,
    username: user?.username ?? undefined,
  };

  const form = useForm<UpdateProfileInfoSchema>({
    defaultValues,
    resolver: zodResolver(updateProfileInfoSchema),
    mode:"onSubmit"
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
    <form className="space-y-6 bg-black" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="firstName"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <Input {...field} type="text" />
            <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="lastName"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <Input {...field} type="text" />
            <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="username"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input {...field} type="text" />
            <FieldError errors={fieldState.error ? [{ message: fieldState.error.message }] : []} />
          </Field>
        )}
      />

      <Button disabled={!isDirty} type="submit">
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default UpdateInfoForm;