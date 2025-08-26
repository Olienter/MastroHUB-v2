import * as React from "react";
import { cookies } from "next/headers";
import Link from "next/link";

export function Topbar() {
  const authed = Boolean(cookies().get("mhv2_auth")?.value);
  return (
    <div className="sticky top-0 z-20 backdrop-blur border-b bg-white/70">
      <div className="mx-auto w-full max-w-6xl h-14 px-6 flex items-center justify-between">
        <div className="font-semibold">MastroHUB v2</div>
        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-6 opacity-80">
            <Link href="/">Dashboard</Link>
            <Link href="/settings">Settings</Link>
          </nav>
          {authed ? (
            <form action="/api/auth/logout" method="post">
              <button className="rounded-xl border px-3 py-1.5 text-sm hover:shadow transition">
                Logout
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border px-3 py-1.5 text-sm hover:shadow transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
