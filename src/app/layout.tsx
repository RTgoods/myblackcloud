import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { gameAccess } from "@/lib/game-access";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyBlackCloud — SHIFT",
  description: "One fanny pack. An ICU that hides everything. Play SHIFT — an ICU nursing/RT shift simulator — free at level 1, unlock all 8 levels for full access.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const access = user ? await gameAccess(supabase, user) : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="md:flex">
          <Sidebar email={user?.email ?? null} unlocked={access?.allowed ?? false} />
          <div className="flex-1 min-w-0 pt-14 md:pt-0">
            {children}
            <Footer />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
