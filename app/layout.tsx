import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "MastroHUB v2 — AI-Powered Quality Platform",
  description:
    "MastroHUB v2 - Advanced AI-powered quality monitoring and development platform",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mastrohub.dev"
  ),
  openGraph: {
    title: "MastroHUB v2 — AI-Powered Quality Platform",
    description:
      "Advanced AI-powered quality monitoring and development platform",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MastroHUB v2 — AI-Powered Quality Platform",
    description:
      "Advanced AI-powered quality monitoring and development platform",
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
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
