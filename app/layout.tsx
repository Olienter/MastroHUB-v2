/* REDTEAM: will be reverted */
import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export const metadata = {
  title: "MastroHUB v2 — Watchdog Test",
  description: "MastroHUB v2 - AI-powered quality monitoring platform",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mastrohub.dev"
  ),
  openGraph: {
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
