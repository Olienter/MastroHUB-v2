/* REDTEAM: will be reverted */
"use client";

import * as React from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = React.useState("demo@mastrohub.local");
  const [password, setPassword] = React.useState("demo1234");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || "Login failed");
      }
    } catch {
      setError("Network error");
    }
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Image src="/logo.png" alt="MastroHUB Logo" width={150} height={75} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
