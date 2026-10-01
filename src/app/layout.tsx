import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Sidebar } from "@/components/Sidebar";
import { ConditionalFooter } from "@/components/ConditionalFooter";
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
  let completedLevels: number[] = [];
  let handle: string | null = null;
  let role: 'RT' | 'RN' = 'RT';
  let gender: 'male' | 'female' = 'male';
  if (user) {
    const [{ data: progress }, { data: profile }] = await Promise.all([
      supabase.from('progress').select('completed_levels').eq('user_id', user.id).maybeSingle(),
      supabase.from('profiles').select('display_name, role, gender').eq('id', user.id).maybeSingle(),
    ]);
    completedLevels = progress?.completed_levels ?? [];
    handle = profile?.display_name ?? null;
    role = profile?.role ?? 'RT';
    gender = profile?.gender ?? 'male';
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="md:flex">
          <Sidebar
            email={user?.email ?? null}
            handle={handle}
            role={role}
            gender={gender}
            unlocked={access?.allowed ?? false}
            isAdmin={access?.isAdmin ?? false}
            completedLevels={completedLevels}
          />
          <div className="flex-1 min-w-0 pt-14 md:pt-0">
            {children}
            <ConditionalFooter />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
