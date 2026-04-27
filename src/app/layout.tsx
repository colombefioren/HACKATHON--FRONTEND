import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { QueryProvider } from "@/components/providers";
import { ToastNotification } from "@/components/ToastNotification";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Evalio — AI hackathon judging panel",
  description: "AI-powered hackathon project analysis & judging."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} min-h-screen bg-background`}>
        <QueryProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <ToastNotification />
        </QueryProvider>
      </body>
    </html>
  );
}