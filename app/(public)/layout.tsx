import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export const metadata = {
  title: "MastroHUB — Premium Gastronomy & Hospitality Magazine | 2026",
  description:
    "Discover exclusive gastronomy insights, chef interviews, and culinary innovations. Your premier destination for hospitality industry expertise and modern cuisine.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mastrohub.dev"
  ),
  openGraph: {
    title: "MastroHUB — Premium Gastronomy & Hospitality Magazine | 2026",
    description:
      "Discover exclusive gastronomy insights, chef interviews, and culinary innovations. Your premier destination for hospitality industry expertise.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MastroHUB — Premium Gastronomy & Hospitality Magazine | 2026",
    description:
      "Discover exclusive gastronomy insights, chef interviews, and culinary innovations.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
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
