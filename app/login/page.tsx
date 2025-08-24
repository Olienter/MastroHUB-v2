/* REDTEAM: will be reverted */
'use client';

import * as React from 'react';

export default function LoginPage() {
  const [email, setEmail] = React.useState('demo@mastrohub.local');
  const [password, setPassword] = React.useState('demo1234');
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    }
  }

  return (
    <>
      <h1>Login</h1>
      <h1>Duplicate Heading</h1> {/* duplicitné H1 */}
      <form>
        <input id="email" type="email" placeholder="Email" /> {/* bez <label> alebo aria-label */}
        <img src="/logo.png" /> {/* bez alt */}
        <button>Submit</button>
      </form>
    </>
  );
}
