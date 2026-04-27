import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers";
import { ToastNotification } from "@/components/ToastNotification";
import "./globals.css";

export const metadata: Metadata = {
  title: "Judgy — AI hackathon judging panel",
  description: "AI-powered hackathon project analysis & judging."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <QueryProvider>
          {children}
          <ToastNotification />
        </QueryProvider>
      </body>
    </html>
  );
}