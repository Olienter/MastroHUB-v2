import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export const metadata = {
  title: "MastroHUB — Gastronomy & Hospitality Magazine",
  description:
    "MastroHUB - Premium gastronomy and hospitality magazine with AI-powered insights, recipes, and industry trends",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mastrohub.dev"
  ),
  openGraph: {
    title: "MastroHUB — Gastronomy & Hospitality Magazine",
    description:
      "Premium gastronomy and hospitality magazine with AI-powered insights, recipes, and industry trends",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MastroHUB — Gastronomy & Hospitality Magazine",
    description:
      "Premium gastronomy and hospitality magazine with AI-powered insights, recipes, and industry trends",
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
          <div className="MainContainer">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
