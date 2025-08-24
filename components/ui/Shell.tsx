"use client";
import * as React from "react";

export function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </header>
      <main>{children}</main>
      <footer className="mt-12 border-t pt-4 text-sm text-gray-500">
        MastroHUB v2 • {new Date().getFullYear()}
      </footer>
    </div>
  );
}
