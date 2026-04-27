import { Toaster } from "sonner";

export function ToastNotification() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          border: "2.5px solid #111",
          boxShadow: "4px 4px 0 #111",
          borderRadius: "3px",
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          fontSize: "14px",
        },
        classNames: {
          // default / loading
          toast: "!bg-[#F4D738] !text-[#111]",
          // per-type overrides via sonner's built-in class names
          success: "!bg-[#7FBC8C] !text-[#0a2e10]",
          error: "!bg-[#FF6B6B] !text-[#2a0000]",
          warning: "!bg-[#E3A018] !text-[#1a0e00]",
          info: "!bg-[#69D2E7] !text-[#002a30]",
          // icons inherit text color
          icon: "!text-current",
        },
      }}
    />
  );
}
