import { Toaster } from "sonner";

// Wraps sonner with neo-brutalist styling. Mount once at the root.
export function ToastNotification() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--brand-mustard)",
          color: "var(--brand-ink)",
          border: "2.5px solid var(--brand-ink)",
          boxShadow: "4px 4px 0 var(--brand-ink)",
          borderRadius: "3px",
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );
}
