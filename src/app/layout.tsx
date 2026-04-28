import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { QueryProvider } from "@/components/providers";
import { ToastNotification } from "@/components/ToastNotification";
import { PageTransition } from "@/components/PageTransition";
import { GlobalProgressBar } from "@/components/GlobalProgressBar";
import { StaleIndicator } from "@/components/StaleIndicator";
import { FlickeringGrid } from "@/registry/magicui/flickering-grid";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Evalio — AI hackathon judging panel",
  description: "AI-powered hackathon project analysis & judging.",
  icons: {
    icon: "/evalio.svg",
    shortcut: "/evalio.svg",
    apple: "/evalio.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${rubik.variable} min-h-screen`}>
        <FlickeringGrid
          className="fixed inset-0 z-0 size-full"
          squareSize={3}
          gridGap={5}
          color="#6B7280"
          maxOpacity={0.25}
          flickerChance={0.1}
        />
        <QueryProvider>
          <div className="relative z-10">
            <GlobalProgressBar />
            <StaleIndicator />
            <PageTransition>
              {children}
            </PageTransition>
            <ToastNotification />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}