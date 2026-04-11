import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solaris — Onboarding Flow",
  description:
    "A 5-step onboarding flow for a modern SaaS. Company info → team → integrations → preferences → launch.",
  openGraph: {
    title: "Solaris — Onboarding Flow",
    description: "Modern SaaS onboarding wizard demo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
