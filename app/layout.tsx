/* REDTEAM: will be reverted */
import "./globals.css";
import { Topbar } from "../components/ui/Topbar";

export const metadata = {
  title: 'MastroHUB v2 — Watchdog Test',
  // description: 'REMOVED ON PURPOSE', // ❌ chýba description
  openGraph: {
    // images: ['/og.png'], // ❌ chýba og:image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col">
          <Topbar />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
